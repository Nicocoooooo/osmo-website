import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";

// Définition du type pour éviter les erreurs TypeScript
type LenisOptions = {
    duration?: number;
    easing?: (t: number) => number;
    smooth?: boolean;
    smoothTouch?: boolean;
    touchMultiplier?: number;
    // Ne pas inclure 'direction' et 'gestureOrientation' qui causent des erreurs
};

export default function useLocoScroll() {
    useEffect(() => {
        // Configuration simplifiée qui fonctionne avec la version de Lenis installée
        const options: LenisOptions = {
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smooth: true,
            smoothTouch: false,
            touchMultiplier: 2,
        };

        // @ts-ignore - Ignorer les problèmes de typage avec la version spécifique de Lenis
        const lenis = new Lenis(options);

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, []);
}