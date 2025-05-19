// src/components/layout/Header.tsx
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);

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
            backgroundColor: '#000000',
            height: '80px',
        }
    };

    const logoVariants = {
        initial: { opacity: 0, y: -20 },
        animate: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        },
        hover: {
            scale: 1.05,
            transition: { duration: 0.2 }
        }
    };

    // Typage explicite pour éviter l'erreur 'any'
    const linkVariants = {
        initial: { opacity: 0, y: -20 },
        animate: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                delay: 0.1 * i
            }
        }),
        hover: {
            color: '#CDFE00',
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
            className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-16"
        >
            <Link href="/">
                <motion.div
                    variants={logoVariants}
                    initial="initial"
                    animate="animate"
                    whileHover="hover"
                    className="relative w-32 h-12 cursor-pointer"
                >
                    <Image
                        src="/images/logo-osmo.svg"
                        alt="Osmo Logo"
                        fill
                        className="object-contain"
                    />
                </motion.div>
            </Link>

            <nav className="hidden md:block">
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
                            <Link href={link.href} className="text-white font-medium text-lg tracking-wide">
                                {link.name}
                            </Link>
                        </motion.li>
                    ))}
                </ul>
            </nav>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="block md:hidden cursor-pointer"
            >
                <div className="w-8 h-0.5 bg-white mb-2"></div>
                <div className="w-8 h-0.5 bg-white mb-2"></div>
                <div className="w-8 h-0.5 bg-white"></div>
            </motion.div>
        </motion.header>
    );
};

export default Header;