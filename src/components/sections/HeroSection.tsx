import { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import gsap from 'gsap';
import Button from '../ui/Button';
import Logo from '../ui/Logo';

const HeroSection = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(textRef, { once: false, amount: 0.2 });

    // Animation des titres et sous-titres
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

    const subtitleVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                delay: 0.2,
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

    // Effet de parallaxe et particules en arrière-plan
    useEffect(() => {
        if (containerRef.current) {
            // Animation du texte au scroll
            gsap.fromTo(
                textRef.current,
                { y: 0 },
                {
                    y: -50,
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top top',
                        end: 'bottom top',
                        scrub: true
                    }
                }
            );

            // Création de particules en arrière-plan (points comme le logo)
            const generateParticles = () => {
                const container = containerRef.current;
                if (!container) return;

                // Supprimer les anciennes particules si elles existent
                const oldParticles = container.querySelectorAll('.particle');
                oldParticles.forEach(p => p.remove());

                // Générer de nouvelles particules
                const particlesCount = 20;
                for (let i = 0; i < particlesCount; i++) {
                    const particle = document.createElement('div');
                    const size = 5 + Math.random() * 15;

                    particle.className = 'particle absolute rounded-full bg-primary opacity-20';
                    particle.style.width = `${size}px`;
                    particle.style.height = `${size}px`;
                    particle.style.left = `${Math.random() * 100}%`;
                    particle.style.top = `${Math.random() * 100}%`;
                    particle.style.zIndex = '0';

                    container.appendChild(particle);

                    // Animation des particules
                    gsap.to(particle, {
                        x: -30 + Math.random() * 60,
                        y: 20 + Math.random() * 40,
                        duration: 5 + Math.random() * 10,
                        repeat: -1,
                        yoyo: true,
                        ease: 'sine.inOut',
                        delay: Math.random() * 2
                    });
                }
            };

            generateParticles();

            // Regenerer les particules lors du redimensionnement
            window.addEventListener('resize', generateParticles);

            return () => {
                window.removeEventListener('resize', generateParticles);
            };
        }
    }, []);

    return (
        <div
            ref={containerRef}
            className="relative min-h-screen flex items-center overflow-hidden bg-black"
        >
            {/* Arrière-plan avec gradient */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/80 to-black z-10" />
            </div>

            {/* Contenu principal */}
            <div className="container mx-auto px-6 md:px-12 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div ref={textRef} className="max-w-2xl">
                        <motion.h1
                            className="font-serif text-4xl md:text-6xl font-bold mb-6 text-white"
                            variants={titleVariants}
                            initial="hidden"
                            animate={isInView ? "visible" : "hidden"}
                        >
                            <span className="block">le savoir,</span>
                            <span className="block italic">personnalisé</span>
                            <span className="block">par l'IA</span>
                        </motion.h1>

                        <motion.p
                            className="text-lg md:text-xl text-white/80 mb-8"
                            variants={subtitleVariants}
                            initial="hidden"
                            animate={isInView ? "visible" : "hidden"}
                        >
                            Révolutionnez la formation professionnelle grâce à des assistants IA conversationnels spécialisés par domaines d'expertise.
                        </motion.p>

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
                                <Button variant="outline" size="lg">
                                    Commencer l'aventure
                                </Button>
                            </motion.div>
                        </div>
                    </div>

                    {/* Logo animé à droite */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: 1,
                            transition: {
                                duration: 1,
                                delay: 0.4
                            }
                        }}
                        className="hidden lg:flex justify-center items-center"
                    >
                        <div className="relative w-64 h-64">
                            <Logo
                                variant="light"
                                className="w-full h-full"
                                animated={true}
                            />
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Indicateur de défilement */}
            <motion.div
                className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
                initial={{ opacity: 0, y: -20 }}
                animate={{
                    opacity: [0.4, 1, 0.4],
                    y: [0, 10, 0],
                    transition: {
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }
                }}
            >
                <div className="w-8 h-12 border-2 border-white rounded-full flex justify-center">
                    <div className="w-1 h-3 bg-white rounded-full mt-2" />
                </div>
            </motion.div>
        </div>
    );
};

export default HeroSection;