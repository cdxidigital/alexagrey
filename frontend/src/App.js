import React, { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import "./App.css";
import AgeGate from "./components/AgeGate";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import QuickFacts from "./components/QuickFacts";
import About from "./components/About";
import Services from "./components/Services";
import Gallery from "./components/Gallery";
import Availability from "./components/Availability";
import Rates from "./components/Rates";
import BookingForm from "./components/BookingForm";
import Footer from "./components/Footer";

function App() {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    document.body.style.overflow = entered ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [entered]);

  return (
    <div className="grain relative min-h-screen bg-ink font-sans text-cream">
      <AnimatePresence>
        {!entered && <AgeGate onEnter={() => setEntered(true)} />}
      </AnimatePresence>

      <Navbar />
      <main>
        <Hero />
        <QuickFacts />
        <About />
        <Services />
        <Gallery />
        <Availability />
        <Rates />
        <BookingForm />
      </main>
      <Footer />
    </div>
  );
}

export default App;
