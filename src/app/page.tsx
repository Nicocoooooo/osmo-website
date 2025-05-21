// src/app/page.tsx
"use client";

import { useEffect } from "react";
import Layout from "../components/layout/Layout";
import HeroSection from "../components/sections/HeroSection";
import ClientsSection from "../components/sections/ClientsSection";
import StepsSection from "../components/sections/StepsSection";
import ContactSection from "../components/sections/ContactSection";
import useLocoScroll from "../hooks/useLocoScroll";

export default function Home() {
  // Initialisation du défilement fluide
  useLocoScroll();

  // Curseur personnalisé géré dans le Layout, donc supprimé d'ici

  return (
    <Layout>
      <HeroSection />
      <ClientsSection />
      <StepsSection />
      <ContactSection />
    </Layout>
  );
}