import React, { useEffect, useState, useRef } from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
    children: React.ReactNode;
}

/**
 * Layout optimisé avec:
 * - Throttling du curseur personnalisé
 * - Détection mobile (désactivation des effets lourds)
 * - Nettoyage approprié des ressources
 */
const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [isPageLoaded, setIsPageLoaded] = useState(false);
    const cursorRef = useRef<HTMLDivElement | null>(null);
    const rafRef = useRef<number | null>(null);
    const lastCursorPos = useRef({ x: 0, y: 0 });
    const isMobile = useRef(false);

    useEffect(() => {
        // Détection de mobile pour désactiver certains effets sur mobile
        isMobile.current = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        // Animation d'entrée de page
        setTimeout(() => {
            setIsPageLoaded(true);
        }, 100);

        // Créer le curseur personnalisé seulement sur desktop
        if (!isMobile.current) {
            createCustomCursor();
        }

        return () => {
            // Nettoyage des animations
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
                rafRef.current = null;
            }

            // Nettoyage du curseur personnalisé
            if (cursorRef.current) {
                document.body.removeChild(cursorRef.current);
                cursorRef.current = null;
            }
        };
    }, []);

    // Création du curseur personnalisé avec optimisations
    const createCustomCursor = () => {
        const customCursor = document.createElement("div");
        customCursor.id = "custom-cursor";

        // Styles initiaux
        customCursor.style.opacity = "0";
        customCursor.style.position = "fixed";
        customCursor.style.width = "24px";
        customCursor.style.height = "24px";
        customCursor.style.borderRadius = "50%";
        customCursor.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        customCursor.style.mixBlendMode = "difference";
        customCursor.style.transform = "translate(-50%, -50%)";
        customCursor.style.pointerEvents = "none";
        customCursor.style.zIndex = "9999";
        customCursor.style.transition = "transform 0.1s ease-out, width 0.2s ease, height 0.2s ease";

        document.body.appendChild(customCursor);
        cursorRef.current = customCursor;

        // Variables pour le throttling
        let ticking = false;

        // Fonction optimisée de mouvement du curseur avec RAF
        const updateCursorPosition = () => {
            if (cursorRef.current) {
                cursorRef.current.style.opacity = "1";
                cursorRef.current.style.left = `${lastCursorPos.current.x}px`;
                cursorRef.current.style.top = `${lastCursorPos.current.y}px`;
            }
            ticking = false;
        };

        // Gestionnaire d'événement throttlé
        const onMouseMove = (e: MouseEvent) => {
            lastCursorPos.current = { x: e.clientX, y: e.clientY };

            if (!ticking) {
                rafRef.current = requestAnimationFrame(updateCursorPosition);
                ticking = true;
            }
        };

        // Gestion des événements de survol des liens et boutons
        const addHoverEffects = () => {
            const interactiveElements = document.querySelectorAll('a, button, [role="button"]');

            interactiveElements.forEach(el => {
                el.addEventListener('mouseenter', () => {
                    if (cursorRef.current) {
                        cursorRef.current.style.width = "36px";
                        cursorRef.current.style.height = "36px";
                        cursorRef.current.style.backgroundColor = "rgba(205, 254, 0, 0.7)";
                    }
                });

                el.addEventListener('mouseleave', () => {
                    if (cursorRef.current) {
                        cursorRef.current.style.width = "24px";
                        cursorRef.current.style.height = "24px";
                        cursorRef.current.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
                    }
                });
            });
        };

        // Ajouter les listeners
        window.addEventListener("mousemove", onMouseMove, { passive: true });

        // Ajouter les effets de survol avec un léger délai pour s'assurer que tout est chargé
        setTimeout(addHoverEffects, 500);
    };

    return (
        <div className={`min-h-screen bg-primary transition-opacity duration-500 ${isPageLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <Header />
            <main className="flex-grow pt-20">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;