import os
import asyncio
import logging
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from typing import Annotated, List, Optional

from bson import ObjectId
from dotenv import load_dotenv
from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, BeforeValidator, EmailStr, Field, ConfigDict

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(ROOT_DIR, ".env"))

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("alexa-grey")

MONGO_URL = os.environ.get("MONGO_URL")
DB_NAME = os.environ.get("DB_NAME")
RESEND_API_KEY = os.environ.get("RESEND_API_KEY", "").strip()
SENDER_EMAIL = os.environ.get("SENDER_EMAIL", "onboarding@resend.dev")
OWNER_EMAIL = os.environ.get("OWNER_EMAIL", "").strip()

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

@asynccontextmanager
async def lifespan(app: FastAPI):
    yield
    client.close()


app = FastAPI(title="Alexa Grey API", lifespan=lifespan)
api = APIRouter(prefix="/api")


# ---------- Mongo helpers ----------
def _validate_object_id(v):
    if isinstance(v, ObjectId):
        return str(v)
    return str(v)


PyObjectId = Annotated[str, BeforeValidator(_validate_object_id)]


class BaseDocument(BaseModel):
    model_config = ConfigDict(populate_by_name=True, arbitrary_types_allowed=True)
    id: Optional[PyObjectId] = Field(default=None, alias="_id")

    @classmethod
    def from_mongo(cls, doc: dict):
        if not doc:
            return None
        return cls(**doc)


# ---------- Models ----------
class BookingCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    email: EmailStr
    phone: str = Field(..., min_length=3, max_length=40)
    duration: str = Field(..., max_length=60)
    date: Optional[str] = Field(default="", max_length=80)
    location: str = Field(..., min_length=1, max_length=200)
    extras: List[str] = Field(default_factory=list)
    message: Optional[str] = Field(default="", max_length=2000)


class Booking(BaseDocument):
    name: str
    email: str
    phone: str
    duration: str
    date: str = ""
    location: str
    extras: List[str] = Field(default_factory=list)
    message: str = ""
    status: str = "new"
    created_at: str


# ---------- Email ----------
def _booking_email_html(b: dict) -> str:
    extras = ", ".join(b.get("extras") or []) or "None"
    rows = [
        ("Name", b.get("name")),
        ("Email", b.get("email")),
        ("Phone", b.get("phone")),
        ("Preferred date/time", b.get("date") or "-"),
        ("Duration", b.get("duration")),
        ("Location (outcall)", b.get("location")),
        ("Extras", extras),
        ("Message", b.get("message") or "-"),
    ]
    tr = "".join(
        f'<tr><td style="padding:8px 14px;color:#997A15;font-weight:600;'
        f'white-space:nowrap;vertical-align:top">{k}</td>'
        f'<td style="padding:8px 14px;color:#111">{v}</td></tr>'
        for k, v in rows
    )
    return f"""
    <div style="background:#050505;padding:28px;font-family:Arial,sans-serif">
      <div style="max-width:560px;margin:auto;background:#fff;border-radius:12px;overflow:hidden">
        <div style="background:#050505;padding:22px 24px">
          <div style="color:#D4AF37;font-size:22px;letter-spacing:3px;font-weight:700">ALEXA GREY</div>
          <div style="color:#A3A3A3;font-size:12px;letter-spacing:2px">NEW BOOKING ENQUIRY</div>
        </div>
        <table style="width:100%;border-collapse:collapse;font-size:14px">{tr}</table>
      </div>
    </div>
    """


async def send_booking_email(b: dict) -> bool:
    if not RESEND_API_KEY or not OWNER_EMAIL:
        logger.warning("Resend not configured (RESEND_API_KEY / OWNER_EMAIL missing) - skipping email.")
        return False
    try:
        import resend
        resend.api_key = RESEND_API_KEY
        params = {
            "from": SENDER_EMAIL,
            "to": [OWNER_EMAIL],
            "subject": f"New booking enquiry from {b.get('name')}",
            "html": _booking_email_html(b),
            "reply_to": b.get("email"),
        }
        result = await asyncio.to_thread(resend.Emails.send, params)
        logger.info(f"Booking email sent: {result}")
        return True
    except Exception as e:
        logger.error(f"Failed to send booking email: {e}")
        return False


# ---------- Routes ----------
@api.get("/")
async def root():
    return {"status": "ok", "service": "Alexa Grey"}


@api.post("/bookings")
async def create_booking(payload: BookingCreate):
    doc = payload.model_dump()
    doc["status"] = "new"
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    result = await db.bookings.insert_one(doc)
    doc["_id"] = result.inserted_id
    email_sent = await send_booking_email(doc)
    booking = Booking.from_mongo(doc)
    return {
        "success": True,
        "email_sent": email_sent,
        "booking": booking.model_dump(by_alias=False),
    }


@api.get("/bookings")
async def list_bookings():
    docs = await db.bookings.find().sort("created_at", -1).to_list(200)
    return [Booking.from_mongo(d).model_dump(by_alias=False) for d in docs]


app.include_router(api)

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
