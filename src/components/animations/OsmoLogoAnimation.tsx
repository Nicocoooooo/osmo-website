// src/components/animations/OsmoLogoAnimation.tsx
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface OsmoLogoAnimationProps {
    onAnimationComplete?: () => void;
    loop?: boolean;
    duration?: number;
    className?: string;
}

const OsmoLogoAnimation: React.FC<OsmoLogoAnimationProps> = ({
    onAnimationComplete,
    loop = false,
    duration = 2,
    className = '',
}) => {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!svgRef.current) return;

        // Sélectionner tous les cercles et ellipses
        const circlesAndEllipses = Array.from(svgRef.current.querySelectorAll('circle, ellipse'));

        // Trier les éléments selon leur position verticale (de haut en bas)
        const sortedElements = [...circlesAndEllipses].sort((a, b) => {
            const aY = parseFloat(a.getAttribute('cy') || '0');
            const bY = parseFloat(b.getAttribute('cy') || '0');
            return aY - bY;
        });

        // Créer une timeline GSAP
        const timeline = gsap.timeline({
            repeat: loop ? -1 : 0,
            onComplete: () => {
                if (onAnimationComplete) onAnimationComplete();
            }
        });

        // Animation du haut vers le bas
        timeline
            // Phase 1: Remplissage de couleur progressive du haut vers le bas
            .to(sortedElements, {
                fill: '#CDFE00',
                stagger: {
                    each: 0.04,
                    from: "start", // Du premier élément (le plus haut) au dernier
                    ease: "power1.inOut"
                },
                duration: 0.3,
                ease: "sine.inOut"
            })

            // Phase 2: Légère pulsation une fois rempli
            .to(sortedElements, {
                scale: 1.1,
                stagger: {
                    each: 0.02,
                    from: "start",
                    ease: "power1.out"
                },
                duration: 0.2,
                ease: "power1.out"
            }, "-=0.1")

            // Phase 3: Retour à l'échelle normale
            .to(sortedElements, {
                scale: 1,
                stagger: {
                    each: 0.02,
                    from: "start",
                    ease: "power1.in"
                },
                duration: 0.2,
                ease: "power1.in"
            })

            // Phase 4: Pause avant de revenir à la couleur originale
            .to({}, { duration: 0.5 })

            // Phase 5: Retour à la couleur blanche, du haut vers le bas
            .to(sortedElements, {
                fill: 'white',
                stagger: {
                    each: 0.04,
                    from: "start",
                    ease: "power1.inOut"
                },
                duration: 0.4
            });

        // Ajuster la vitesse globale d'animation
        timeline.timeScale(2 / duration);

        return () => {
            // Nettoyer l'animation
            timeline.kill();
        };
    }, [loop, duration, onAnimationComplete]);

    return (
        <div className={`osmo-logo-animation ${className}`}>
            {/* Version simplifiée du SVG - avec des couleurs blanches directes au lieu des dégradés */}
            <svg
                ref={svgRef}
                width="587"
                height="665"
                viewBox="0 0 587 665"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
            >
                {/* Fond transparent */}
                <circle cx="356.768" cy="129.961" r="18.9608" fill="white" />
                <ellipse cx="190.861" cy="318.779" rx="26.8612" ry="27.6512" fill="white" />
                <circle cx="303.836" cy="404.103" r="26.0712" fill="white" />
                <circle cx="375.73" cy="340.111" r="20.5409" fill="white" />
                <circle cx="373.359" cy="413.583" r="21.331" fill="white" />
                <circle cx="232.733" cy="435.704" r="18.1708" fill="white" />
                <circle cx="288.035" cy="470.466" r="19.7509" fill="white" />
                <circle cx="348.869" cy="193.163" r="17.3808" fill="white" />
                <circle cx="203.502" cy="250.046" r="17.3808" fill="white" />
                <ellipse cx="247.744" cy="201.854" rx="18.9608" ry="19.7509" fill="white" />
                <ellipse cx="301.467" cy="231.875" rx="20.5409" ry="21.331" fill="white" />
                <circle cx="249.324" cy="357.491" r="20.5409" fill="white" />
                <ellipse cx="259.595" cy="281.648" rx="22.911" ry="23.7011" fill="white" />
                <ellipse cx="309.367" cy="325.1" rx="22.121" ry="22.911" fill="white" />
                <circle cx="299.097" cy="159.192" r="15.0107" fill="white" />
                <ellipse cx="356.768" cy="272.957" rx="15.8007" ry="16.5907" fill="white" />
                <ellipse cx="190.862" cy="386.722" rx="15.8007" ry="16.5907" fill="white" />
                <ellipse cx="409.701" cy="156.822" rx="11.8505" ry="12.6406" fill="white" />
                <circle cx="345.708" cy="461.776" r="12.6406" fill="white" />
                <circle cx="393.11" cy="491.797" r="11.0605" fill="white" />
                <circle cx="386.79" cy="545.519" r="9.48042" fill="white" />
                <ellipse cx="336.227" cy="517.868" rx="14.2206" ry="15.0107" fill="white" />
            </svg>
        </div>
    );
};

export default OsmoLogoAnimation;