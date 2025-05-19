// src/utils/animations.ts

/**
 * Solution au problème d'animation de 'backgroundColor' vers 'transparent'
 * 
 * Au lieu d'animer directement vers 'transparent', nous utilisons rgba(0,0,0,0)
 * qui est techniquement la même chose mais est une valeur animable.
 */

import { gsap } from 'gsap';

// Fonction utilitaire pour créer des animations d'apparition avec fond qui disparaît
export const fadeInWithBg = (element: string | Element, delay = 0) => {
    return gsap.fromTo(
        element,
        {
            opacity: 0,
            y: 20,
            backgroundColor: 'rgba(0, 0, 0, 1)' // Au lieu de #000000
        },
        {
            opacity: 1,
            y: 0,
            backgroundColor: 'rgba(0, 0, 0, 0)', // Au lieu de 'transparent'
            duration: 0.8,
            delay,
            ease: 'power2.out'
        }
    );
};

// Fonction pour créer un effet de hover avec changement de fond
export const hoverEffect = (element: Element) => {
    element.addEventListener('mouseenter', () => {
        gsap.to(element, {
            backgroundColor: 'rgba(205, 254, 0, 0.1)', // Couleur primaire avec opacité
            duration: 0.3
        });
    });

    element.addEventListener('mouseleave', () => {
        gsap.to(element, {
            backgroundColor: 'rgba(0, 0, 0, 0)', // Au lieu de 'transparent'
            duration: 0.3
        });
    });
};

// Fonction utilitaire pour les transitions entre sections
export const sectionTransitionEffect = (trigger: string | Element, target: string | Element) => {
    return gsap.fromTo(
        target,
        {
            backgroundColor: 'rgba(0, 0, 0, 0.5)' // Départ avec une opacité
        },
        {
            backgroundColor: 'rgba(0, 0, 0, 0)', // Arrivée complètement transparente
            scrollTrigger: {
                trigger,
                start: 'top center',
                end: 'bottom center',
                scrub: true
            }
        }
    );
};