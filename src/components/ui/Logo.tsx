import { useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import gsap from 'gsap';

interface LogoProps {
    variant?: 'light' | 'dark';
    className?: string;
    animated?: boolean;
}

const Logo = ({
    variant = 'light',
    className = '',
    animated = true
}: LogoProps) => {
    const logoRef = useRef<HTMLDivElement>(null);

    // Source du logo basée sur la variante
    const logoSrc = variant === 'light'
        ? '/images/logo-osmo-light.svg'
        : '/images/logo-osmo-dark.svg';

    // Animation au chargement
    useEffect(() => {
        if (animated && logoRef.current) {
            // Animation avec GSAP
            gsap.fromTo(
                logoRef.current,
                {
                    opacity: 0,
                    scale: 0.8
                },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 0.8,
                    ease: 'power2.out'
                }
            );
        }
    }, [animated]);

    // Animation de survol avec Framer Motion
    const logoVariants = {
        initial: { scale: 1 },
        hover: {
            scale: 1.05,
            transition: { duration: 0.3 }
        }
    };

    return (
        <motion.div
            ref={logoRef}
            variants={logoVariants}
            initial="initial"
            whileHover="hover"
            className={`relative ${className}`}
        >
            <Image
                src={logoSrc}
                alt="Osmo Logo"
                width={100}
                height={100}
                className="w-full h-auto"
            />
        </motion.div>
    );
};

export default Logo;