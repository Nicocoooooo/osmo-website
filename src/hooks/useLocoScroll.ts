import { useEffect, useRef } from "react";

/**
 * Hook optimisé pour le défilement fluide
 * - Correction des problèmes de mode strict
 * - Utilisation d'expressions de fonction au lieu de déclarations
 */

// Définition des types d'easing et raf en dehors des blocs
type EasingFunction = (t: number) => number;
type RafCallback = (time: number) => void;

export default function useLocoScroll(enabled = true) {
    // Garder une référence à l'instance Lenis
    const lenisRef = useRef<any | null>(null);
    // Garder une référence à l'ID d'animation pour nettoyage
    const rafIdRef = useRef<number | null>(null);

    useEffect(() => {
        // Retourner immédiatement si le smooth scroll est désactivé
        if (!enabled) return;

        // Détection de mobile pour réduire la qualité sur mobile
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        // Fonction d'easing définie en dehors des blocs
        const easingFn: EasingFunction = (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t));

        // Fonction RAF définie en dehors des blocs
        const handleRaf: RafCallback = (time) => {
            if (lenisRef.current) {
                if (time - lastFrameTime >= frameInterval) {
                    lastFrameTime = time;
                    lenisRef.current.raf(time);
                }
                rafIdRef.current = requestAnimationFrame(handleRaf);
            }
        };

        // Import dynamique défini comme une variable
        const importLenisModule = async () => {
            try {
                // Dynamically import Lenis
                const module = await import('@studio-freight/lenis');
                const LenisModule = module.default;

                // Configuration plus légère
                const options = {
                    duration: isMobile ? 0.8 : 1.0,
                    easing: easingFn,
                    smooth: true,
                    smoothTouch: false,
                    touchMultiplier: 1.5,
                    wheelMultiplier: 0.8,
                    lerp: isMobile ? 0.15 : 0.1,
                };

                // Création de l'instance Lenis
                lenisRef.current = new LenisModule(options);

                // Optimisation: utiliser une vitesse de rafraîchissement plus basse sur mobile
                const targetFPS = isMobile ? 30 : 60;
                frameInterval = 1000 / targetFPS;
                lastFrameTime = 0;

                // Démarrer l'animation
                rafIdRef.current = requestAnimationFrame(handleRaf);
            } catch (error) {
                console.error("Erreur lors de l'initialisation de Lenis:", error);
            }
        };

        // Variables de throttling
        let frameInterval = 1000 / 60; // valeur par défaut
        let lastFrameTime = 0;

        // Exécuter l'import dynamique
        importLenisModule();

        // Gestionnaire de visibilité défini comme une variable
        const handleVisibilityChange = () => {
            if (document.hidden && lenisRef.current) {
                lenisRef.current.destroy();
                lenisRef.current = null;

                // Nettoyer l'animation
                if (rafIdRef.current) {
                    cancelAnimationFrame(rafIdRef.current);
                    rafIdRef.current = null;
                }
            } else if (!document.hidden && !lenisRef.current) {
                // Recréer Lenis
                importLenisModule();
            }
        };

        // Ajouter l'écouteur d'événements
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            // Nettoyer les écouteurs
            document.removeEventListener('visibilitychange', handleVisibilityChange);

            // Nettoyer l'animation frame
            if (rafIdRef.current) {
                cancelAnimationFrame(rafIdRef.current);
                rafIdRef.current = null;
            }

            // Nettoyer l'instance Lenis
            if (lenisRef.current) {
                lenisRef.current.destroy();
                lenisRef.current = null;
            }
        };
    }, [enabled]);

    // Exposer l'instance lenis pour contrôle externe
    return lenisRef.current;
}