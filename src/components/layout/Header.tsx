import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Header optimisé avec:
 * - Réduction des animations inutiles
 * - Utilisation de useCallback pour les fonctions
 * - Optimisation des variantes d'animation
 * - Throttling du scroll event
 */
const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Optimisation: utiliser useCallback pour éviter les re-créations de fonction
    const handleScroll = useCallback(() => {
        // Mise en œuvre d'un throttling simple du scroll
        window.requestAnimationFrame(() => {
            const offset = window.scrollY;
            setIsScrolled(offset > 50);
        });
    }, []);

    useEffect(() => {
        // Utilisation de passive: true pour améliorer la performance du scroll
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [handleScroll]);

    // Animations optimisées: transitions plus légères
    const headerVariants = {
        initial: {
            backgroundColor: 'rgba(205, 254, 0, 1)',
            height: '100px',
        },
        scrolled: {
            backgroundColor: 'rgba(205, 254, 0, 0.95)',
            height: '80px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
        }
    };

    // Optimisation: utiliser GPU pour les animations avec translateY plutôt que y
    const logoVariants = {
        initial: { opacity: 0, translateX: -20 },
        animate: {
            opacity: 1,
            translateX: 0,
            transition: { duration: 0.5 }
        },
        hover: {
            scale: 1.05,
            transition: { duration: 0.2, ease: 'easeOut' }
        }
    };

    const linkVariants = {
        initial: { opacity: 0, translateY: -10 },
        animate: (i: number) => ({
            opacity: 1,
            translateY: 0,
            transition: {
                duration: 0.3,
                delay: 0.05 * i
            }
        }),
        hover: {
            color: '#000000',
            fontWeight: '600',
            transition: { duration: 0.2 }
        }
    };

    // Variante mobile optimisée
    const mobileMenuVariants = {
        closed: {
            opacity: 0,
            translateX: '100%',
            transition: {
                duration: 0.3,
                ease: [0.16, 1, 0.3, 1]
            }
        },
        open: {
            opacity: 1,
            translateX: 0,
            transition: {
                duration: 0.4,
                ease: [0.16, 1, 0.3, 1]
            }
        }
    };

    const navLinks = [
        { name: 'Nos solutions', href: '/solutions' },
        { name: 'L\'équipe Osmo', href: '/equipe' },
        { name: 'Contact', href: '/contact' }
    ];

    // Optimisation: fonction pour fermer le menu
    const closeMenu = useCallback(() => {
        setIsMenuOpen(false);
    }, []);

    return (
        <motion.header
            variants={headerVariants}
            initial="initial"
            animate={isScrolled ? 'scrolled' : 'initial'}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12"
        >
            <div className="flex items-center justify-between h-full max-w-7xl mx-auto">
                {/* Logo à gauche */}
                <Link href="/" className="relative z-10">
                    <motion.div
                        variants={logoVariants}
                        initial="initial"
                        animate="animate"
                        whileHover="hover"
                        className="relative w-10 md:w-12 aspect-square cursor-pointer"
                    >
                        <Image
                            src="/images/logo-osmo-light.svg"
                            alt="Osmo Logo"
                            width={48}
                            height={48}
                            className="object-contain"
                            priority // Priorité de chargement pour le logo
                        />
                    </motion.div>
                </Link>

                {/* Navigation centrée sur desktop */}
                <nav className="hidden md:block absolute left-1/2 transform -translate-x-1/2">
                    <ul className="flex space-x-8">
                        {navLinks.map((link, i) => (
                            <motion.li
                                key={link.name}
                                custom={i}
                                variants={linkVariants}
                                initial="initial"
                                animate="animate"
                                whileHover="hover"
                            >
                                <Link href={link.href} className="text-black font-medium text-lg tracking-wide">
                                    {link.name}
                                </Link>
                            </motion.li>
                        ))}
                    </ul>
                </nav>

                {/* Espace réservé pour équilibrer le header */}
                <div className="w-10 md:w-12"></div>

                {/* Menu burger pour mobile - optimisé avec des transitions simples */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="block md:hidden cursor-pointer z-10 absolute right-6"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <div className={`w-8 h-0.5 bg-black mb-2 transition-transform ${isMenuOpen ? 'transform rotate-45 translate-y-2.5' : ''}`}></div>
                    <div className={`w-8 h-0.5 bg-black mb-2 transition-opacity ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></div>
                    <div className={`w-8 h-0.5 bg-black transition-transform ${isMenuOpen ? 'transform -rotate-45 -translate-y-2.5' : ''}`}></div>
                </motion.div>
            </div>

            {/* Menu mobile avec AnimatePresence pour optimiser le DOM */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        key="mobile-menu"
                        variants={mobileMenuVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        className="fixed inset-0 bg-primary z-40 flex flex-col items-center justify-center"
                    >
                        <ul className="flex flex-col space-y-6 items-center">
                            {navLinks.map((link, i) => (
                                <motion.li
                                    key={link.name}
                                    initial={{ opacity: 0, translateY: 20 }}
                                    animate={{
                                        opacity: 1,
                                        translateY: 0,
                                        transition: { delay: 0.05 * i, duration: 0.3 }
                                    }}
                                >
                                    <Link
                                        href={link.href}
                                        className="text-black font-medium text-2xl"
                                        onClick={closeMenu}
                                    >
                                        {link.name}
                                    </Link>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
};

export default Header;