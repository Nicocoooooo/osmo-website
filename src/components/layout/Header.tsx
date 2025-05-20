import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const offset = window.scrollY;
            if (offset > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const headerVariants = {
        initial: {
            backgroundColor: 'transparent',
            height: '100px',
        },
        scrolled: {
            backgroundColor: '#CDFE00',
            height: '80px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
        }
    };

    const logoVariants = {
        initial: { opacity: 0, x: -20 },
        animate: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.5 }
        },
        hover: {
            scale: 1.05,
            transition: { duration: 0.2 }
        }
    };

    const linkVariants = {
        initial: { opacity: 0, y: -10 },
        animate: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                delay: 0.1 * i
            }
        }),
        hover: {
            color: '#000000',
            fontWeight: '600',
            transition: { duration: 0.2 }
        }
    };

    const navLinks = [
        { name: 'Nos solutions', href: '/solutions' },
        { name: 'L\'équipe Osmo', href: '/equipe' },
        { name: 'Contact', href: '/contact' }
    ];

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

                {/* Menu burger pour mobile */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="block md:hidden cursor-pointer z-10 absolute right-6"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <div className={`w-8 h-0.5 bg-black mb-2 transition-transform ${isMenuOpen ? 'transform rotate-45 translate-y-2.5' : ''}`}></div>
                    <div className={`w-8 h-0.5 bg-black mb-2 transition-opacity ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></div>
                    <div className={`w-8 h-0.5 bg-black transition-transform ${isMenuOpen ? 'transform -rotate-45 -translate-y-2.5' : ''}`}></div>
                </motion.div>
            </div>

            {/* Menu mobile */}
            {isMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, x: '100%' }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: '100%' }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 bg-primary z-40 flex flex-col items-center justify-center"
                >
                    <ul className="flex flex-col space-y-6 items-center">
                        {navLinks.map((link, i) => (
                            <motion.li
                                key={link.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * i }}
                            >
                                <Link
                                    href={link.href}
                                    className="text-black font-medium text-2xl"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            </motion.li>
                        ))}
                    </ul>
                </motion.div>
            )}
        </motion.header>
    );
};

export default Header;