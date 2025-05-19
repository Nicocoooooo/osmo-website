// ClientsSection.tsx mis à jour avec les bonnes classes CSS pour Tailwind v4
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';

// Enregistrement des plugins GSAP
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

const ClientsSection = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const headingRef = useRef<HTMLHeadingElement>(null);
    const isHeadingInView = useInView(headingRef, { once: false, amount: 0.5 });

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

    // Animation pour la stat des 66%
    useEffect(() => {
        if (sectionRef.current) {
            const statElement = sectionRef.current.querySelector('#stat-percentage');

            if (statElement) {
                gsap.fromTo(
                    statElement,
                    { innerHTML: '0%' },
                    {
                        innerHTML: '66%',
                        duration: 2,
                        ease: 'power1.inOut',
                        scrollTrigger: {
                            trigger: statElement,
                            start: 'top 80%',
                            once: true
                        },
                        onUpdate: function () {
                            // @ts-ignore
                            statElement.innerHTML = Math.round(this.targets()[0].innerHTML.replace('%', '')) + '%';
                        }
                    }
                );
            }
        }
    }, []);

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
                delay: 0.1 * i,
                ease: "easeOut"
            }
        })
    };

    return (
        <section
            ref={sectionRef}
            style={{
                paddingTop: '5rem',
                paddingBottom: '5rem',
                backgroundColor: 'black',
                color: 'white'
            }}
        >
            <div style={{
                maxWidth: '1200px',
                marginLeft: 'auto',
                marginRight: 'auto',
                paddingLeft: '1.5rem',
                paddingRight: '1.5rem'
            }}>
                <motion.h2
                    ref={headingRef}
                    style={{
                        fontSize: '1.875rem',
                        fontWeight: '500',
                        marginBottom: '4rem',
                        textAlign: 'center'
                    }}
                    variants={headingVariants}
                    initial="hidden"
                    animate={isHeadingInView ? "visible" : "hidden"}
                >
                    Ils font déjà confiance à Osmo.
                </motion.h2>

                <div style={{ marginBottom: '4rem' }}>
                    <p style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        textAlign: 'center',
                        marginBottom: '2rem',
                        maxWidth: '48rem',
                        marginLeft: 'auto',
                        marginRight: 'auto'
                    }}>
                        Ces entreprises trouvent les plateformes de formations traditionnelles trop coûteuses et mal adaptées à leurs besoins spécifiques. Osmo utilise la puissance de l'IA appliquée à vos données vérifiées.
                    </p>

                    {/* Section statistiques */}
                    <div style={{
                        backgroundColor: 'rgba(205, 254, 0, 0.1)',
                        borderRadius: '0.5rem',
                        padding: '1.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '1.5rem',
                        marginTop: '2.5rem'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div id="stat-percentage" style={{
                                fontSize: '2.25rem',
                                fontWeight: 'bold',
                                color: '#CDFE00'
                            }}>
                                66%
                            </div>
                            <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
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
                        >
                            <div style={{
                                height: '4rem',
                                width: '1px',
                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                display: 'none'
                            }} className="md:block" />
                        </motion.div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <svg style={{ width: '2rem', height: '2rem', color: '#CDFE00' }} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                                Retour sur investissement positif dès le premier mois.
                            </div>
                        </div>
                    </div>
                </div>

                {/* Logos des clients */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '2rem'
                }} className="md:grid-cols-3 lg:grid-cols-5">
                    {clients.map((client, index) => (
                        <motion.div
                            key={client.id}
                            custom={index}
                            variants={fadeInUpVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.2 }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <div style={{ position: 'relative', width: '112px', height: '48px' }}>
                                <Image
                                    src={client.logo}
                                    alt={client.name}
                                    width={112}
                                    height={48}
                                    style={{
                                        objectFit: 'contain',
                                        filter: 'grayscale(1)',
                                        transition: 'all 300ms'
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.filter = 'grayscale(0)';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.filter = 'grayscale(1)';
                                    }}
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