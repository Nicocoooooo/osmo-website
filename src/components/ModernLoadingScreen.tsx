// src/components/ModernLoadingScreen.tsx
// Écran de chargement design avec effets visuels avancés
import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OsmoLogoAnimation from './animations/OsmoLogoAnimation';

interface ModernLoadingScreenProps {
    minDisplayTime?: number;
    onComplete?: () => void;
    isLoading?: boolean;
}

const ModernLoadingScreen: React.FC<ModernLoadingScreenProps> = ({
    minDisplayTime = 3000,
    onComplete,
    isLoading: externalIsLoading,
}) => {
    const [internalIsLoading, setInternalIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [particles, setParticles] = useState<Array<{ x: number; y: number; size: number; speed: number }>>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    // Utiliser soit l'état externe, soit l'état interne
    const isLoading = externalIsLoading !== undefined ? externalIsLoading : internalIsLoading;

    // Générer des particules aléatoires
    useEffect(() => {
        if (!containerRef.current) return;

        const generateParticles = () => {
            const newParticles = [];
            const containerWidth = containerRef.current?.clientWidth || window.innerWidth;
            const containerHeight = containerRef.current?.clientHeight || window.innerHeight;

            for (let i = 0; i < 20; i++) {
                newParticles.push({
                    x: Math.random() * containerWidth,
                    y: Math.random() * containerHeight,
                    size: Math.random() * 3 + 1,
                    speed: Math.random() * 0.5 + 0.1
                });
            }

            setParticles(newParticles);
        };

        generateParticles();

        // Redimensionnement
        const handleResize = () => {
            generateParticles();
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Animation de progression
    useEffect(() => {
        const startTime = Date.now();
        const endTime = startTime + minDisplayTime;

        const updateProgress = () => {
            const currentTime = Date.now();
            const elapsed = currentTime - startTime;
            const newProgress = Math.min(100, (elapsed / minDisplayTime) * 100);
            setProgress(newProgress);

            if (currentTime < endTime) {
                requestAnimationFrame(updateProgress);
            } else {
                if (!externalIsLoading) {
                    if (onComplete) onComplete();
                    setInternalIsLoading(false);
                }
            }
        };

        const animationFrame = requestAnimationFrame(updateProgress);
        return () => cancelAnimationFrame(animationFrame);
    }, [minDisplayTime, externalIsLoading, onComplete]);

    // Variables pour les animations Framer Motion
    const containerVariants = {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: {
            opacity: 0,
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
        }
    };

    const logoVariants = {
        initial: { opacity: 0, scale: 0.8 },
        animate: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
        },
        exit: {
            opacity: 0,
            scale: 1.2,
            transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
        }
    };

    const titleVariants = {
        initial: { opacity: 0, y: 20 },
        animate: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.3
            }
        },
        exit: {
            opacity: 0,
            y: -20,
            transition: {
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1]
            }
        }
    };

    const subtitleVariants = {
        initial: { opacity: 0, y: 15 },
        animate: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.5
            }
        },
        exit: {
            opacity: 0,
            y: -15,
            transition: {
                duration: 0.4,
                ease: [0.16, 1, 0.3, 1]
            }
        }
    };

    const progressBarVariants = {
        initial: { opacity: 0, width: 0 },
        animate: {
            opacity: 1,
            width: "100%",
            transition: {
                opacity: { duration: 0.4 },
                width: { duration: 0.1, delay: 0.2 }
            }
        }
    };

    const progressValueVariants = {
        initial: { opacity: 0 },
        animate: {
            opacity: 1,
            transition: { duration: 0.4, delay: 0.6 }
        }
    };

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    ref={containerRef}
                    variants={containerVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
                >
                    {/* Fond avec dégradé amélioré et effet de "grain" */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-primary opacity-90"></div>

                    {/* Effet de noise/grain pour ajouter de la texture */}
                    <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]"></div>

                    {/* Effet de particules */}
                    <div className="absolute inset-0 overflow-hidden">
                        {particles.map((particle, i) => (
                            <motion.div
                                key={i}
                                className="absolute rounded-full bg-primary/30"
                                style={{
                                    width: particle.size,
                                    height: particle.size,
                                    left: particle.x,
                                    top: particle.y,
                                }}
                                animate={{
                                    y: ["0%", "100%"],
                                    opacity: [0, 0.7, 0]
                                }}
                                transition={{
                                    duration: 10 / particle.speed,
                                    repeat: Infinity,
                                    ease: "linear",
                                    delay: i * 0.2,
                                }}
                            />
                        ))}
                    </div>

                    {/* Effet de halo lumineux */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary/10 blur-3xl"></div>
                    </div>

                    {/* Conteneur principal avec meilleur espacement */}
                    <div className="relative z-10 flex flex-col items-center max-w-lg w-full px-6">
                        {/* Logo avec animation */}
                        <motion.div
                            variants={logoVariants}
                            className="mb-12 relative"
                        >
                            {/* Effet de halo autour du logo */}
                            <motion.div
                                className="absolute inset-0 bg-primary/20 filter blur-xl rounded-full transform scale-125"
                                animate={{
                                    scale: [1.25, 1.35, 1.25],
                                    opacity: [0.2, 0.3, 0.2],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            ></motion.div>

                            <div className="relative w-48 h-48">
                                <OsmoLogoAnimation loop={true} duration={2.5} />
                            </div>
                        </motion.div>

                        {/* Textes avec meilleures animations et typographie */}
                        <motion.h2
                            variants={titleVariants}
                            className="text-white text-4xl font-bold mb-3 tracking-wide"
                        >
                            <span className="relative inline-block">
                                Osmo
                                <motion.span
                                    className="absolute -bottom-1 left-0 w-full h-[2px] bg-primary"
                                    initial={{ width: 0, left: "50%", x: "-50%" }}
                                    animate={{ width: "100%", left: "0%", x: "0%" }}
                                    transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
                                />
                            </span>
                        </motion.h2>

                        <motion.p
                            variants={subtitleVariants}
                            className="text-white/80 text-lg mb-16 font-light"
                        >
                            Le savoir <span className="text-primary font-normal">personnalisé</span> par l'IA
                        </motion.p>

                        {/* Indicateur de progression amélioré avec effet futuriste */}
                        <div className="w-full max-w-xs relative">
                            {/* Valeur de progression avec animation */}
                            <motion.div
                                variants={progressValueVariants}
                                className="absolute -top-8 right-0 text-white/80 text-sm font-mono tracking-wider"
                            >
                                <span className="text-primary">{Math.round(progress)}</span>
                                <span className="text-white/50">%</span>
                            </motion.div>

                            {/* Barre de progression avec effet brillant */}
                            <div className="h-[2px] w-full bg-white/10 overflow-hidden rounded-full backdrop-blur-sm relative">
                                <motion.div
                                    className="h-full bg-primary relative"
                                    style={{ width: `${progress}%` }}
                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                >
                                    {/* Effet de brillance sur la barre */}
                                    <div className="absolute top-0 right-0 h-full w-[10px] bg-white/80 blur-[2px] transform translate-x-[5px]"></div>
                                </motion.div>
                            </div>

                            {/* Ligne décorative avec animation */}
                            <motion.div
                                initial={{ width: 0, opacity: 0 }}
                                animate={{
                                    width: "100%",
                                    opacity: 1,
                                    transition: {
                                        width: { duration: 1.5, ease: "easeOut" },
                                        opacity: { duration: 0.8 }
                                    }
                                }}
                                className="h-px w-full bg-gradient-to-r from-primary/0 via-primary/60 to-primary/0 mt-8"
                            />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ModernLoadingScreen;