// src/app/page.tsx
"use client";

import { useState } from "react";
import Layout from "../components/layout/Layout";
import HeroSection from "../components/sections/HeroSection";
import ClientsSection from "../components/sections/ClientsSection";
import StepsSection from "../components/sections/StepsSection";
import ContactSection from "../components/sections/ContactSection";
import useLocoScroll from "../hooks/useLocoScroll";
import LiquidLoadingScreen from "../components/LiquidLoadingScreen";
import CircularTransition from "../components/CircularTransition";

export default function Home() {
  const [loadingPhase, setLoadingPhase] = useState<'loading' | 'transitioning' | 'complete'>('loading');
  const [showContent, setShowContent] = useState(false);

  // Gérer les phases de chargement
  const handleLoadingComplete = () => {
    setLoadingPhase('transitioning');
  };

  const handleTransitionComplete = () => {
    setLoadingPhase('complete');
    setShowContent(true);
  };

  // Activer le smooth scroll seulement quand le contenu est affiché
  useLocoScroll(showContent);

  return (
    <>
      {/* Écran de chargement avec animation liquide */}
      <LiquidLoadingScreen
        isLoading={loadingPhase === 'loading'}
        onComplete={handleLoadingComplete}
        minDisplayTime={3000}
      />

      {/* Transition circulaire */}
      <CircularTransition
        isActive={loadingPhase === 'transitioning'}
        onComplete={handleTransitionComplete}
        duration={1500}
      />

      {/* Contenu principal */}
      {showContent && (
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