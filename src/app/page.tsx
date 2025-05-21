// src/app/page.tsx
"use client";

import { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import HeroSection from "../components/sections/HeroSection";
import ClientsSection from "../components/sections/ClientsSection";
import StepsSection from "../components/sections/StepsSection";
import ContactSection from "../components/sections/ContactSection";
import useLocoScroll from "../hooks/useLocoScroll";
import LoadingScreen from "../components/LoadingScreen";
import ModernLoadingScreen from "../components/ModernLoadingScreen";
import EnhancedLoadingScreen from "../components/EnhancedLoadingScreen";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  // Simuler un chargement d'application
  useEffect(() => {
    // Vous pouvez remplacer ceci par votre propre logique de chargement
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Montrer l'écran de chargement pendant 3 secondes

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <EnhancedLoadingScreen
        isLoading={isLoading}
        onComplete={() => console.log("Chargement terminé")}
      />

      {!isLoading && (
        <Layout>
          <HeroSection />
          <ClientsSection />
          <StepsSection />
          <ContactSection />
        </Layout>
      )}
    </>
  );
}