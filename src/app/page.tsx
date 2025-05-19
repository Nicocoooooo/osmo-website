// src/app/page.tsx
"use client";

import { useEffect } from "react";
import Layout from ".././components/layout/Layout";
import HeroSection from "../components/sections/HeroSection";
import ClientsSection from "../components/sections/ClientsSection";
import StepsSection from "../components/sections/StepsSection";
import ContactSection from ".././components/sections/ContactSection";
import useLocoScroll from "../hooks/useLocoScroll";

export default function Home() {
  // Initialisation du défilement fluide
  useLocoScroll();

  // Implémentation du curseur personnalisé
  useEffect(() => {
    const cursor = document.getElementById("custom-cursor");

    const onMouseMove = (e: MouseEvent) => {
      if (cursor) {
        cursor.style.opacity = "1";
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
      }
    };

    window.addEventListener("mousemove", onMouseMove);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <Layout>
      <HeroSection />
      <ClientsSection />
      <StepsSection />
      <ContactSection />
    </Layout>
  );
}