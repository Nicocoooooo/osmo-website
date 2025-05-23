// src/components/CircularTransition.tsx
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CircularTransitionProps {
    isActive: boolean;
    onComplete?: () => void;
    duration?: number;
}

const CircularTransition: React.FC<CircularTransitionProps> = ({
    isActive,
    onComplete,
    duration = 1500
}) => {
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        if (isActive) {
            setIsTransitioning(true);

            // Délai pour la completion de la transition
            const timer = setTimeout(() => {
                if (onComplete) onComplete();
                setIsTransitioning(false);
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [isActive, duration, onComplete]);

    return (
        <AnimatePresence>
            {isTransitioning && (
                <motion.div
                    className="fixed inset-0 z-[60] pointer-events-none"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Masque circulaire qui s'agrandit */}
                    <motion.div
                        className="absolute inset-0 bg-black"
                        initial={{
                            clipPath: 'circle(0% at 50% 50%)'
                        }}
                        animate={{
                            clipPath: [
                                'circle(0% at 50% 50%)',
                                'circle(5% at 50% 50%)',
                                'circle(100% at 50% 50%)'
                            ]
                        }}
                        transition={{
                            duration: duration / 1000,
                            times: [0, 0.1, 1],
                            ease: [0.16, 1, 0.3, 1]
                        }}
                    />

                    {/* Particules autour du point de transition */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-2 h-2 bg-primary rounded-full"
                                initial={{
                                    opacity: 0,
                                    scale: 0,
                                    x: 0,
                                    y: 0
                                }}
                                animate={{
                                    opacity: [0, 1, 0],
                                    scale: [0, 1, 1.5],
                                    x: Math.cos((i * Math.PI * 2) / 8) * 60,
                                    y: Math.sin((i * Math.PI * 2) / 8) * 60
                                }}
                                transition={{
                                    duration: 0.8,
                                    delay: i * 0.05,
                                    ease: "easeOut"
                                }}
                            />
                        ))}
                    </div>

                    {/* Onde circulaire qui se propage */}
                    <motion.div
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                        initial={{
                            width: 0,
                            height: 0,
                            opacity: 0.8
                        }}
                        animate={{
                            width: '200vw',
                            height: '200vw',
                            opacity: 0
                        }}
                        transition={{
                            duration: duration / 1000,
                            ease: "easeOut"
                        }}
                        style={{
                            border: '2px solid #CDFE00',
                            borderRadius: '50%'
                        }}
                    />

                    {/* Second cercle pour effet de profondeur */}
                    <motion.div
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                        initial={{
                            width: 0,
                            height: 0,
                            opacity: 0.4
                        }}
                        animate={{
                            width: '180vw',
                            height: '180vw',
                            opacity: 0
                        }}
                        transition={{
                            duration: duration / 1000,
                            delay: 0.1,
                            ease: "easeOut"
                        }}
                        style={{
                            border: '1px solid #CDFE00',
                            borderRadius: '50%'
                        }}
                    />

                    {/* Effet de flash au centre */}
                    <motion.div
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full"
                        initial={{
                            scale: 0,
                            opacity: 0
                        }}
                        animate={{
                            scale: [0, 1.5, 0],
                            opacity: [0, 1, 0]
                        }}
                        transition={{
                            duration: 0.6,
                            times: [0, 0.3, 1],
                            ease: "easeInOut"
                        }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CircularTransition;