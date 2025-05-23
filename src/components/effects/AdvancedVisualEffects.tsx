// src/components/effects/AdvancedVisualEffects.tsx
import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface AdvancedVisualEffectsProps {
    children: React.ReactNode;
    enableParallax?: boolean;
    enableMorphing?: boolean;
    enableGlitch?: boolean;
}

const AdvancedVisualEffects: React.FC<AdvancedVisualEffectsProps> = ({
    children,
    enableParallax = true,
    enableMorphing = true,
    enableGlitch = false
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Spring animations pour un mouvement fluide
    const springConfig = { damping: 25, stiffness: 700 };
    const x = useSpring(mouseX, springConfig);
    const y = useSpring(mouseY, springConfig);

    // Transformations basées sur la position de la souris
    const rotateX = useTransform(y, [-300, 300], [30, -30]);
    const rotateY = useTransform(x, [-300, 300], [-30, 30]);
    const scale = useTransform(x, [-300, 300], [0.95, 1.05]);

    // Effet de parallax pour les éléments de fond
    const backgroundY = useTransform(y, [-300, 300], [-50, 50]);
    const backgroundX = useTransform(x, [-300, 300], [-25, 25]);

    // Gestion du mouvement de la souris
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return;

            const rect = containerRef.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            mouseX.set(e.clientX - centerX);
            mouseY.set(e.clientY - centerY);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <div ref={containerRef} className="relative overflow-hidden">
            {/* Effet de morphing de fond */}
            {enableMorphing && (
                <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: 'radial-gradient(circle at center, rgba(205, 254, 0, 0.1), transparent)',
                        x: backgroundX,
                        y: backgroundY,
                        scale: scale,
                    }}
                />
            )}

            {/* Grille de points interactifs */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-primary/30 rounded-full"
                        style={{
                            left: `${(i % 5) * 25}%`,
                            top: `${Math.floor(i / 5) * 25}%`,
                        }}
                        animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.3, 0.8, 0.3],
                        }}
                        transition={{
                            duration: 2,
                            delay: i * 0.1,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </div>

            {/* Effet de glitch (optionnel) */}
            {enableGlitch && (
                <motion.div
                    className="absolute inset-0 pointer-events-none mix-blend-multiply"
                    animate={{
                        clipPath: [
                            'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                            'polygon(0% 20%, 100% 0%, 100% 80%, 0% 100%)',
                            'polygon(0% 0%, 100% 20%, 100% 100%, 0% 80%)',
                            'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                        ],
                        filter: [
                            'hue-rotate(0deg)',
                            'hue-rotate(90deg)',
                            'hue-rotate(180deg)',
                            'hue-rotate(0deg)',
                        ]
                    }}
                    transition={{
                        duration: 0.2,
                        repeat: Infinity,
                        repeatDelay: 5,
                    }}
                    style={{
                        background: 'linear-gradient(45deg, #CDFE00, transparent)',
                        opacity: 0.1,
                    }}
                />
            )}

            {/* Contenu principal avec effet 3D */}
            <motion.div
                style={{
                    rotateX: enableParallax ? rotateX : 0,
                    rotateY: enableParallax ? rotateY : 0,
                    transformStyle: 'preserve-3d',
                    transformPerspective: 1000,
                }}
                className="relative z-10"
            >
                {children}
            </motion.div>

            {/* Overlay de texture */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.02]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
            />
        </div>
    );
};

export default AdvancedVisualEffects;