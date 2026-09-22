import { useEffect, useState } from "react";
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { StudioInbox } from "@/components/studio-inbox";
import { lockInbox } from "@/lib/bookings";
import { clearInboxToken, readInboxTabToken } from "@/lib/inbox-session";

export const Route = createFileRoute("/admin")({ component: AdminPage });

function lockThisTab() {
  clearInboxToken();
  void lockInbox();
}

function AdminPage() {
  const [unlocked] = useState(() => readInboxTabToken().length > 0);

  useEffect(() => {
    const onHide = () => lockThisTab();
    const onShow = (event: PageTransitionEvent) => {
      if (event.persisted && !readInboxTabToken()) {
        window.location.replace("/login");
      }
    };
    window.addEventListener("pagehide", onHide);
    window.addEventListener("pageshow", onShow);
    return () => {
      window.removeEventListener("pagehide", onHide);
      window.removeEventListener("pageshow", onShow);
      window.setTimeout(() => {
        if (!window.location.pathname.startsWith("/admin")) lockThisTab();
      }, 0);
    };
  }, []);

  if (!unlocked) return <Navigate to="/login" />;

  return <StudioInbox />;
}
