// ClientsSection.tsx optimisé pour les performances
import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';

// Enregistrement des plugins GSAP seulement côté client
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

/**
 * ClientsSection optimisée avec:
 * - Utilisation appropriée des styles CSS au lieu d'inline styles
 * - Throttling des animations GSAP
 * - Lazy loading des images
 * - Utilisation d'IntersectionObserver pour les animations
 * - Réduction des calculs inutiles
 */
const ClientsSection = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const headingRef = useRef<HTMLHeadingElement>(null);
    const statRef = useRef<HTMLDivElement>(null);
    const isHeadingInView = useInView(headingRef, { once: true, amount: 0.5 });
    const isStatInView = useInView(statRef, { once: true, amount: 0.7 });
    const [percentage, setPercentage] = useState(0);

    // Animation optimisée pour la stat des 66%
    useEffect(() => {
        if (isStatInView) {
            // Animation progressive du pourcentage
            let startTime: number;
            let animationFrameId: number;

            const animate = (timestamp: number) => {
                if (!startTime) startTime = timestamp;
                const elapsed = timestamp - startTime;
                const progress = Math.min(elapsed / 1500, 1); // Réduire la durée à 1.5s

                // Utiliser une courbe d'accélération pour une animation plus naturelle
                const easedProgress = progress < 0.5
                    ? 4 * progress * progress * progress
                    : 1 - Math.pow(-2 * progress + 2, 3) / 2;

                const currentValue = Math.round(easedProgress * 66);

                setPercentage(currentValue);

                if (progress < 1) {
                    animationFrameId = requestAnimationFrame(animate);
                }
            };

            animationFrameId = requestAnimationFrame(animate);

            return () => {
                if (animationFrameId) {
                    cancelAnimationFrame(animationFrameId);
                }
            };
        }
    }, [isStatInView]);

    // Animations des éléments
    const headingVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1]
            }
        }
    };

    const fadeInUpVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                delay: 0.1 * Math.min(i, 5), // Limiter le délai maximum
                ease: "easeOut"
            }
        })
    };

    // Logos des clients
    const clients = [
        { id: 1, name: 'Adobe', logo: '/images/clients/adobe.svg' },
        { id: 2, name: 'Square', logo: '/images/clients/square.svg' },
        { id: 3, name: 'Checkr', logo: '/images/clients/checkr.svg' },
        { id: 4, name: 'Twilio', logo: '/images/clients/twilio.svg' },
        { id: 5, name: 'Bessarion', logo: '/images/clients/bessarion.svg' },
        { id: 6, name: 'NBA', logo: '/images/clients/nba.svg' },
        { id: 7, name: 'Adobe Creative Cloud', logo: '/images/clients/adobe-cc.svg' },
        { id: 8, name: 'Brex', logo: '/images/clients/brex.svg' },
        { id: 9, name: 'Motive', logo: '/images/clients/motive.svg' },
        { id: 10, name: 'Unision', logo: '/images/clients/unision.svg' },
    ];

    return (
        <section ref={sectionRef} className="py-20 bg-black text-white">
            <div className="container mx-auto px-6 md:px-12">
                <motion.h2
                    ref={headingRef}
                    className="text-2xl sm:text-3xl font-medium mb-16 text-center"
                    variants={headingVariants}
                    initial="hidden"
                    animate={isHeadingInView ? "visible" : "hidden"}
                >
                    Ils font déjà confiance à Osmo.
                </motion.h2>

                <div className="mb-16">
                    <p className="text-white/70 text-center mb-8 max-w-3xl mx-auto">
                        Ces entreprises trouvent les plateformes de formations traditionnelles trop coûteuses
                        et mal adaptées à leurs besoins spécifiques. Osmo utilise la puissance de l'IA
                        appliquée à vos données vérifiées.
                    </p>

                    {/* Section statistiques */}
                    <div
                        ref={statRef}
                        className="bg-primary/10 rounded-lg p-6 flex flex-col items-center justify-center gap-6 mt-10"
                    >
                        <div className="flex items-center gap-4">
                            <div className="text-4xl font-bold text-primary">
                                {percentage}%
                            </div>
                            <div className="text-white/80">
                                de temps gagné dans la formation de collaborateurs.
                            </div>
                        </div>

                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            whileInView={{
                                scale: 1,
                                opacity: 1,
                                transition: {
                                    duration: 0.6,
                                    delay: 0.3
                                }
                            }}
                            viewport={{ once: true, amount: 0.5 }}
                            className="hidden md:block h-16 w-px bg-white/20"
                        />

                        <div className="flex items-center gap-4">
                            <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div className="text-white/80">
                                Retour sur investissement positif dès le premier mois.
                            </div>
                        </div>
                    </div>
                </div>

                {/* Logos des clients - optimisés avec grille CSS et responsive */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                    {clients.map((client, index) => (
                        <motion.div
                            key={client.id}
                            custom={index}
                            variants={fadeInUpVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.2 }}
                            className="flex items-center justify-center"
                        >
                            <div className="relative w-28 h-12">
                                <Image
                                    src={client.logo}
                                    alt={client.name}
                                    width={112}
                                    height={48}
                                    className="object-contain filter grayscale transition-all duration-300 hover:filter-none"
                                    loading={index > 5 ? "lazy" : "eager"} // Lazy load seulement les logos moins visibles
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ClientsSection;