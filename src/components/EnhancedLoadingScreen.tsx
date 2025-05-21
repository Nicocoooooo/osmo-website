// src/components/EnhancedLoadingScreen.tsx
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OsmoLogoAnimation from './animations/OsmoLogoAnimation';

interface EnhancedLoadingScreenProps {
    minDisplayTime?: number;
    onComplete?: () => void;
    isLoading?: boolean;
}

const EnhancedLoadingScreen: React.FC<EnhancedLoadingScreenProps> = ({
    minDisplayTime = 3000,
    onComplete,
    isLoading: externalIsLoading,
}) => {
    // États simplifiés
    const [internalIsLoading, setInternalIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [displayText, setDisplayText] = useState("");

    // Utiliser soit l'état externe, soit l'état interne
    const isLoading = externalIsLoading !== undefined ? externalIsLoading : internalIsLoading;

    // Animation de progression et de texte combinés dans un seul useEffect
    useEffect(() => {
        if (!isLoading) return;

        const startTime = Date.now();
        const endTime = startTime + minDisplayTime;

        // Animation de progression
        const animationId = requestAnimationFrame(function updateProgress() {
            const currentTime = Date.now();
            const elapsed = currentTime - startTime;
            const newProgress = Math.min(100, (elapsed / minDisplayTime) * 100);

            setProgress(newProgress);

            if (currentTime < endTime) {
                requestAnimationFrame(updateProgress);
            } else {
                if (!externalIsLoading) {
                    if (onComplete) {
                        setTimeout(onComplete, 300);
                    }
                    setInternalIsLoading(false);
                }
            }
        });

        // Animation de texte
        const fullText = "Le savoir personnalisé par l'IA";
        let currentIndex = 0;

        const textInterval = setInterval(() => {
            if (currentIndex <= fullText.length) {
                setDisplayText(fullText.substring(0, currentIndex));
                currentIndex++;
            } else {
                clearInterval(textInterval);
            }
        }, 70);

        // Nettoyage des deux animations
        return () => {
            cancelAnimationFrame(animationId);
            clearInterval(textInterval);
        };
    }, [isLoading, minDisplayTime, externalIsLoading, onComplete]);

    // Retourne simplement le texte sans coloration spéciale
    const getDisplayText = () => {
        return displayText;
    };

    // Variables simplifiées pour les animations Framer Motion
    const containerVariants = {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0, transition: { duration: 0.5 } }
    };

    const logoVariants = {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1, transition: { duration: 0.8 } },
        exit: { opacity: 0, scale: 1.2, transition: { duration: 0.6 } }
    };

    const titleVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.3 } }
    };

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    variants={containerVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
                >
                    {/* Fond noir */}
                    <div className="absolute inset-0 bg-black"></div>

                    {/* Effet de halo principal */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary/10 blur-3xl"></div>
                    </div>

                    {/* Conteneur principal */}
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

                            {/* Logo Osmo */}
                            <div className="relative w-48 h-48">
                                <OsmoLogoAnimation loop={true} duration={2.5} />
                            </div>
                        </motion.div>

                        {/* Texte avec animation */}
                        <motion.div
                            variants={titleVariants}
                            className="text-center mb-16"
                        >
                            <motion.h2 className="text-white text-4xl font-bold mb-3 tracking-wide">
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

                            <div className="h-8">
                                <p className="text-white/80 text-lg font-light">
                                    {getDisplayText()}
                                </p>
                            </div>
                        </motion.div>

                        {/* Indicateur de progression simplifié */}
                        <div className="w-full max-w-xs relative">
                            {/* Valeur de progression */}
                            <div className="absolute -top-8 right-0 text-white/80 text-sm font-mono tracking-wider">
                                <span className="text-primary">{Math.round(progress)}</span>
                                <span className="text-white/50">%</span>
                            </div>

                            {/* Barre de progression avec effet brillant */}
                            <div className="h-[2px] w-full bg-white/10 overflow-hidden rounded-full backdrop-blur-sm relative">
                                <div
                                    className="h-full bg-primary relative"
                                    style={{ width: `${progress}%` }}
                                >
                                    {/* Effet de brillance sur la barre */}
                                    <div className="absolute top-0 right-0 h-full w-[10px] bg-white/80 blur-[2px] transform translate-x-[5px]"></div>
                                </div>
                            </div>

                            {/* Ligne décorative en bas */}
                            <div className="h-px w-full bg-gradient-to-r from-primary/0 via-primary/60 to-primary/0 mt-8" />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default EnhancedLoadingScreen;