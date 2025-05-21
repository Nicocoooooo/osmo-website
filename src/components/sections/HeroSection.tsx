import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import gsap from 'gsap';
import Button from '../ui/Button';
import TerminalAnimation from '../animations/TerminalAnimation';

/**
 * HeroSection redesignée avec:
 * - Fond noir
 * - "personnalisé" en jaune/vert
 * - Texte à gauche
 * - Terminal à droite, aligné verticalement avec le texte
 * - Demi-cercle lumineux en bas
 */

const HeroSection = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    // État pour suivre si un composant est visible
    const [isInView, setIsInView] = useState(false);

    // Animation des titres et sous-titres avec Framer Motion
    const titleVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1]
            }
        }
    };

    const buttonVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                delay: 0.3 + (i * 0.1),
                ease: [0.16, 1, 0.3, 1]
            }
        })
    };

    // Observer pour déterminer si l'élément est visible
    useEffect(() => {
        if (!textRef.current) return;

        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    setIsInView(entry.isIntersecting);
                });
            },
            { threshold: 0.2 }
        );

        observer.observe(textRef.current);

        return () => {
            if (textRef.current) {
                observer.unobserve(textRef.current);
            }
        };
    }, []);

    // Animation du texte au scroll avec GSAP (plus légère)
    useEffect(() => {
        if (textRef.current && containerRef.current) {
            gsap.fromTo(
                textRef.current,
                { y: 0 },
                {
                    y: -20,
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top top',
                        end: 'bottom top',
                        scrub: 0.5,
                        invalidateOnRefresh: true
                    }
                }
            );
        }
    }, []);

    return (
        <div
            ref={containerRef}
            className="relative min-h-screen flex items-center overflow-hidden bg-black text-white"
        >
            {/* Effet de glow prononcé */}
            <div className="absolute bottom-0 left-0 right-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="osmo-glow-circle"></div>
            </div>

            {/* Contenu principal - avec grille */}
            <div className="container mx-auto px-6 md:px-12 relative z-20 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
                    {/* Titre et boutons à gauche - occupe 3 colonnes sur 5 */}
                    <div ref={textRef} className="lg:col-span-3 max-w-3xl">
                        <motion.h1
                            className="playfair mb-12 lg:mb-24 text-left"
                            variants={titleVariants}
                            initial="hidden"
                            animate={isInView ? "visible" : "hidden"}
                        >
                            <span className="block font-normal text-5xl md:text-7xl xl:text-8xl text-white" style={{ lineHeight: '1.1' }}>
                                le savoir,
                            </span>
                            <span className="block italic font-normal text-5xl md:text-7xl xl:text-8xl text-primary" style={{ lineHeight: '1.1' }}>
                                personnalisé
                            </span>
                            <span className="block font-medium text-5xl md:text-7xl xl:text-8xl text-white" style={{ lineHeight: '1.1' }}>
                                par l'IA
                            </span>
                        </motion.h1>

                        <div className="flex flex-wrap gap-4">
                            <motion.div
                                custom={0}
                                variants={buttonVariants}
                                initial="hidden"
                                animate={isInView ? "visible" : "hidden"}
                            >
                                <Button variant="primary" size="lg">
                                    Démo
                                </Button>
                            </motion.div>

                            <motion.div
                                custom={1}
                                variants={buttonVariants}
                                initial="hidden"
                                animate={isInView ? "visible" : "hidden"}
                            >
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="border-primary text-primary hover:bg-primary/10"
                                >
                                    <span className="mr-2">▶</span> Commencer l'aventure
                                </Button>
                            </motion.div>
                        </div>
                    </div>

                    {/* Terminal interactif - repositionné pour s'aligner avec le texte principal */}
                    <div className="lg:col-span-2 h-full relative hidden lg:flex items-start justify-center" style={{ marginTop: "-7rem" }}>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="w-full relative"
                        >
                            {/* Effet de halo simplifié */}
                            <div className="absolute -inset-4 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-xl opacity-50"></div>

                            <div className="relative transform scale-110">
                                <TerminalAnimation
                                    texts={[
                                        "initializing osmo RAG system...",
                                        "connecting to knowledge base...",
                                        "processing learning patterns...",
                                        "personalizing content...",
                                        "osmo AI ready for collaboration"
                                    ]}
                                    typingSpeed={50}
                                    delayBetweenLines={1000}
                                    cursorColor="#CDFE00"
                                />
                                <div className="terminal-glow"></div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;