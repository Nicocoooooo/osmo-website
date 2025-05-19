import { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import Button from '../ui/Button';

const ContactSection = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const isTitleInView = useInView(titleRef, { once: false, amount: 0.5 });

    // Animation des éléments de contact
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

    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.7,
                ease: "easeOut"
            }
        },
        hover: {
            y: -10,
            boxShadow: "0 20px 30px rgba(0, 0, 0, 0.2)",
            transition: { duration: 0.3 }
        }
    };

    const teamMembers = [
        {
            id: 1,
            name: "Alex Martin",
            role: "Expert IA",
            image: "/images/team/team-1.jpg",
            description: "Spécialiste en RAG et en fine-tuning de modèles pour des cas d'usage en entreprise."
        },
        {
            id: 2,
            name: "Julie Dubois",
            role: "Data Scientist",
            image: "/images/team/team-2.jpg",
            description: "Experte en traitement des données et en optimisation des modèles d'IA."
        }
    ];

    return (
        <section ref={sectionRef} className="py-24 bg-black text-white">
            <div className="container mx-auto px-6 md:px-12">
                <div className="max-w-3xl mx-auto mb-16 text-center">
                    <motion.h2
                        ref={titleRef}
                        className="text-4xl md:text-5xl font-bold mb-6"
                        variants={titleVariants}
                        initial="hidden"
                        animate={isTitleInView ? "visible" : "hidden"}
                    >
                        Prenons contact
                    </motion.h2>

                    <motion.p
                        className="text-lg text-white/70"
                        variants={titleVariants}
                        initial="hidden"
                        animate={isTitleInView ? "visible" : "hidden"}
                        transition={{ delay: 0.2 }}
                    >
                        Goûtez aux parfums de l'IA au service des apprentissages spécialisés.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
                    {/* Section Cartes de l'équipe */}
                    <div className="space-y-8">
                        {teamMembers.map((member, index) => (
                            <motion.div
                                key={member.id}
                                variants={cardVariants}
                                initial="hidden"
                                whileInView="visible"
                                whileHover="hover"
                                viewport={{ once: true, amount: 0.3 }}
                                className="bg-black border border-white/10 rounded-xl overflow-hidden p-6 flex items-center space-x-6"
                            >
                                <div className="relative w-16 h-16 rounded-full overflow-hidden bg-primary/20 flex-shrink-0">
                                    {/* Placeholder pour l'image */}
                                    <div className="absolute inset-0 flex items-center justify-center text-primary font-bold">
                                        {member.name.charAt(0)}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold">{member.name}</h3>
                                    <p className="text-primary font-medium">{member.role}</p>
                                    <p className="text-white/60 mt-2 text-sm">{member.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Section Formulaire de contact */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{
                            opacity: 1,
                            x: 0,
                            transition: {
                                duration: 0.8,
                                delay: 0.3
                            }
                        }}
                        viewport={{ once: true, amount: 0.3 }}
                        className="bg-white/5 backdrop-blur-sm rounded-xl p-8"
                    >
                        <h3 className="text-2xl font-bold mb-6">Contactez-nous</h3>

                        <form className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium mb-2">Nom</label>
                                <input
                                    type="text"
                                    id="name"
                                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="Votre nom"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="votre@email.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
                                <textarea
                                    id="message"
                                    rows={4}
                                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="Comment pouvons-nous vous aider?"
                                ></textarea>
                            </div>

                            <Button variant="primary" size="lg" className="w-full">
                                Envoyer le message
                            </Button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;