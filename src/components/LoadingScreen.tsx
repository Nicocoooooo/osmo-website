// src/components/LoadingScreen.tsx
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OsmoLogoAnimation from './animations/OsmoLogoAnimation'; // Utiliser l'import simplifié

interface LoadingScreenProps {
    minDisplayTime?: number;
    onComplete?: () => void;
    isLoading?: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
    minDisplayTime = 3000,
    onComplete,
    isLoading: externalIsLoading,
}) => {
    const [internalIsLoading, setInternalIsLoading] = useState(true);
    const [hasMetMinTime, setHasMetMinTime] = useState(false);
    const [progress, setProgress] = useState(0);

    // Utiliser soit l'état externe, soit l'état interne
    const isLoading = externalIsLoading !== undefined ? externalIsLoading : internalIsLoading;

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
                setHasMetMinTime(true);

                if (!externalIsLoading) {
                    if (onComplete) onComplete();
                    setInternalIsLoading(false);
                }
            }
        };

        const animationFrame = requestAnimationFrame(updateProgress);

        return () => cancelAnimationFrame(animationFrame);
    }, [minDisplayTime, externalIsLoading, onComplete]);

    // Variants pour les animations Framer Motion
    const containerVariants = {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: {
            opacity: 0,
            transition: { duration: 0.5 }
        }
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
                    {/* Fond avec dégradé noir à vert comme dans la maquette */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-primary"></div>

                    {/* Contenu centré */}
                    <div className="relative z-10 flex flex-col items-center">
                        {/* Logo avec animation */}
                        <div className="w-48 h-48 mb-8">
                            <OsmoLogoAnimation loop={true} duration={2.5} />
                        </div>

                        {/* Texte */}
                        <h2 className="text-white text-2xl font-bold mb-2">
                            Osmo
                        </h2>
                        <p className="text-white/70 text-sm mb-8">
                            Le savoir personnalisé par l'IA
                        </p>

                        {/* Barre de progression stylisée comme dans la maquette */}
                        <div className="mt-8 w-32 h-0.5 bg-primary/50 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LoadingScreen;