import { motion } from 'framer-motion';
import Link from 'next/link';
import Logo from '../ui/Logo';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    // Animations
    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    // Liens principaux
    const mainLinks = [
        { name: 'Produit', href: '/product' },
        { name: 'Features', href: '/features' },
        { name: 'Pricing', href: '/pricing' },
        { name: 'Contact', href: '/contact' }
    ];

    // Liens utiles supplémentaires
    const resourceLinks = [
        { name: 'FAQ', href: '/faq' },
        { name: 'Tutorials', href: '/tutorials' },
        { name: 'Blog', href: '/blog' },
        { name: 'Webinars', href: '/webinars' }
    ];

    // Liens légaux
    const legalLinks = [
        { name: 'Conditions d\'utilisation', href: '/terms' },
        { name: 'Politique de confidentialité', href: '/privacy' }
    ];

    return (
        <footer className="bg-black text-white pt-16 pb-8">
            <div className="container mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* Branding et description */}
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="col-span-1 md:col-span-2 lg:col-span-1"
                    >
                        <div className="flex items-center mb-6">
                            <Logo variant="light" className="w-10 h-10 mr-3" />
                            <span className="text-2xl font-bold">osmo</span>
                        </div>

                        <p className="text-white/70 mb-6">
                            Révolutionnez la formation professionnelle grâce à l'IA et notre technologie RAG qui personnalise l'apprentissage.
                        </p>

                        <div className="flex space-x-4">
                            {/* Icônes réseaux sociaux */}
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-black transition-colors duration-300">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M22.162 5.656a8.384 8.384 0 0 1-2.402.658A4.196 4.196 0 0 0 21.6 4c-.82.488-1.719.83-2.656 1.015a4.182 4.182 0 0 0-7.126 3.814 11.874 11.874 0 0 1-8.62-4.37 4.168 4.168 0 0 0-.566 2.103c0 1.45.738 2.731 1.86 3.481a4.168 4.168 0 0 1-1.894-.523v.052a4.185 4.185 0 0 0 3.355 4.101 4.21 4.21 0 0 1-1.89.072A4.185 4.185 0 0 0 7.97 16.65a8.394 8.394 0 0 1-6.191 1.732 11.83 11.83 0 0 0 6.41 1.88c7.693 0 11.9-6.373 11.9-11.9 0-.18-.005-.362-.013-.54a8.496 8.496 0 0 0 2.087-2.165z" />
                                </svg>
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-black transition-colors duration-300">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                </svg>
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-black transition-colors duration-300">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                            </a>
                        </div>
                    </motion.div>

                    {/* Liens rapides */}
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        <h3 className="text-lg font-bold mb-6">Entreprise</h3>
                        <ul className="space-y-4">
                            {mainLinks.map(link => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-white/70 hover:text-primary transition-colors duration-300">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Ressources */}
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <h3 className="text-lg font-bold mb-6">Explorer</h3>
                        <ul className="space-y-4">
                            {resourceLinks.map(link => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-white/70 hover:text-primary transition-colors duration-300">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Newsletter */}
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                    >
                        <h3 className="text-lg font-bold mb-6">Newsletter</h3>
                        <p className="text-white/70 mb-4">
                            Inscrivez-vous à notre newsletter pour recevoir les dernières actualités.
                        </p>

                        <div className="flex">
                            <input
                                type="email"
                                placeholder="Votre email"
                                className="flex-grow p-3 bg-white/10 rounded-l-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <button className="bg-primary text-black px-4 py-3 rounded-r-lg font-medium hover:bg-primary/90 transition-colors duration-300">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                                </svg>
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* Pied de page avec mentions légales */}
                <div className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between">
                    <p className="text-white/50 text-sm mb-4 md:mb-0">
                        © {currentYear} Osmo. Tous droits réservés.
                    </p>

                    <div className="flex space-x-6">
                        {legalLinks.map(link => (
                            <Link key={link.name} href={link.href} className="text-white/50 text-sm hover:text-primary transition-colors duration-300">
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;