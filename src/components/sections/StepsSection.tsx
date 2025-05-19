import { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import gsap from 'gsap';
import Image from 'next/image';

const StepsSection = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const isTitleInView = useInView(titleRef, { once: false, amount: 0.5 });

    // Animation des étapes avec GSAP
    useEffect(() => {
        if (sectionRef.current) {
            const stepElements = sectionRef.current.querySelectorAll('.step-container');

            if (stepElements.length) {
                gsap.fromTo(
                    stepElements,
                    {
                        y: 50,
                        opacity: 0
                    },
                    {
                        y: 0,
                        opacity: 1,
                        stagger: 0.2,
                        duration: 0.8,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: "top 70%",
                        }
                    }
                );
            }
        }
    }, []);

    // Animation des titres et sous-titres
    const titleVariants = {
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

    const stepData = [
        {
            id: 1,
            title: "Exprimez",
            description: "Décrivez vos besoins de formation, identifiez vos experts métiers et partagez vos documents. Laissez Osmo comprendre votre environnement de connaissances spécifiques.",
        },
        {
            id: 2,
            title: "Construisez",
            description: "Notre technologie RAG identifie les relations entre vos données, structure les formations, et crée des parcours d'apprentissage adaptés à chaque rôle dans votre entreprise.",
        },
        {
            id: 3,
            title: "Évoluez",
            description: "Votre plateforme s'enrichit constamment, aussi bien par vos retours que par les progrès de l'IA. Tous vos collaborateurs bénéficient de formations personnalisées en temps réel.",
        }
    ];

    return (
        <section ref={sectionRef} className="py-24 bg-white text-black">
            <div className="container mx-auto px-6 md:px-12">
                <div className="max-w-3xl mx-auto mb-16 text-center">
                    <motion.h2
                        ref={titleRef}
                        className="text-4xl md:text-5xl font-bold mb-6"
                        variants={titleVariants}
                        initial="hidden"
                        animate={isTitleInView ? "visible" : "hidden"}
                    >
                        Comment ça marche?
                    </motion.h2>

                    <motion.p
                        className="text-lg text-black/70"
                        variants={titleVariants}
                        initial="hidden"
                        animate={isTitleInView ? "visible" : "hidden"}
                        transition={{ delay: 0.2 }}
                    >
                        Nous simplifions les connaissances d'entreprise et optimisons l'impact de vos formations.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
                    {stepData.map((step, index) => (
                        <div key={step.id} className="step-container relative">
                            {/* Ligne de connexion entre les étapes */}
                            {index < stepData.length - 1 && (
                                <div className="hidden md:block absolute top-16 right-0 w-full h-0.5 bg-primary z-0" style={{ transform: 'translateX(50%)' }}></div>
                            )}

                            <div className="relative z-10 flex flex-col items-center">
                                {/* Numéro de l'étape */}
                                <div className="relative mb-8">
                                    <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-black font-bold text-xl">
                                        {step.id}
                                    </div>

                                    {/* Flèche */}
                                    <svg className="absolute -right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>

                                {/* Titre et description */}
                                <h3 className="text-2xl font-serif italic font-bold mb-4">
                                    {step.title}
                                </h3>

                                <p className="text-black/70 text-center">
                                    {step.description}
                                </p>

                                {/* Illustration de l'étape */}
                                <div className="mt-8 relative h-32 w-full overflow-hidden rounded-lg bg-primary/10">
                                    {/* Placeholder pour l'illustration */}
                                    <div className="absolute inset-0 flex items-center justify-center text-primary/30 text-2xl font-bold">
                                        Étape {step.id}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Illustration au bas de la section */}
                <div className="mt-20 relative bg-primary/10 rounded-xl p-8 overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="max-w-xl">
                                <h3 className="text-xl md:text-2xl font-bold mb-4">
                                    "Votre plateforme s'enrichit constamment, tout comme vos collaborateurs."
                                </h3>

                                <div className="bg-black text-white p-4 rounded-lg">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <div className="w-3 h-3 rounded-full bg-primary"></div>
                                        <div className="text-sm text-white/70">Osmo AI</div>
                                    </div>
                                    <p className="text-sm md:text-base">
                                        Votre plateforme s'améliore constamment, tout comme vos collaborateurs.
                                    </p>
                                </div>
                            </div>

                            <div className="relative w-full md:w-96 h-52">
                                <div className="absolute inset-0 bg-black rounded-lg overflow-hidden">
                                    {/* Simuler un graphique */}
                                    <div className="p-4 text-white">
                                        <div className="mb-2 text-sm text-white/70">Progression des performances</div>
                                        <div className="flex items-end h-32 space-x-2">
                                            <div className="w-4 bg-white/30 rounded-t-sm h-[30%]"></div>
                                            <div className="w-4 bg-white/30 rounded-t-sm h-[45%]"></div>
                                            <div className="w-4 bg-white/30 rounded-t-sm h-[40%]"></div>
                                            <div className="w-4 bg-white/30 rounded-t-sm h-[60%]"></div>
                                            <div className="w-4 bg-white/30 rounded-t-sm h-[50%]"></div>
                                            <div className="w-4 bg-white/30 rounded-t-sm h-[70%]"></div>
                                            <div className="w-4 bg-primary rounded-t-sm h-[90%]"></div>
                                        </div>
                                        <div className="text-xs text-white/50 mt-2">2024</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Décoration en arrière-plan */}
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-primary/20 opacity-50"></div>
                    <div className="absolute -top-10 -left-10 w-20 h-20 rounded-full bg-primary/20 opacity-50"></div>
                </div>
            </div>
        </section>
    );
};

export default StepsSection;