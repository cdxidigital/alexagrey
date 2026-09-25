import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AgeGate } from "@/components/age-gate";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Facts } from "@/components/facts";
import { About } from "@/components/about";
import { Services } from "@/components/services";
import { Gallery } from "@/components/gallery";
import { Availability } from "@/components/availability";
import { Rates } from "@/components/rates";
import { BookingForm } from "@/components/booking-form";
import { SiteFooter } from "@/components/footer";
import { AlexaChat } from "@/components/alexa-chat";

export const Route = createFileRoute("/")({ component: Home });

const AGE_KEY = "ag-age-ok";

function Home() {
  const [ready, setReady] = useState(false);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    try {
      setAllowed(sessionStorage.getItem(AGE_KEY) === "1");
    } catch {
      setAllowed(false);
    }
    setReady(true);
  }, []);

  const enter = () => {
    try {
      sessionStorage.setItem(AGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setAllowed(true);
  };

  if (!ready) {
    return <div className="min-h-screen bg-ink" />;
  }

  if (!allowed) {
    return <AgeGate onEnter={enter} />;
  }

  return (
    <main className="bg-ink">
      <Navbar />
      <Hero />
      <Facts />
      <About />
      <Services />
      <Gallery />
      <Availability />
      <Rates />
      <BookingForm />
      <SiteFooter />
      <AlexaChat />
    </main>
  );
}
