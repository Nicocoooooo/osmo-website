import { motion } from 'framer-motion';
import Link from 'next/link';

interface ButtonProps {
    children: React.ReactNode;
    href?: string;
    onClick?: () => void;
    variant?: 'primary' | 'dark' | 'outline' | 'text' | 'play';
    size?: 'sm' | 'md' | 'lg';
    icon?: React.ReactNode;
    className?: string;
    animated?: boolean;
}

const Button = ({
    children,
    href,
    onClick,
    variant = 'primary',
    size = 'md',
    icon,
    className = '',
    animated = true,
}: ButtonProps) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-full transition-all focus:outline-none';

    const variantStyles = {
        primary: 'bg-primary text-black hover:bg-primary/90 border-2 border-transparent',
        dark: 'bg-black text-white hover:bg-black/90 border-2 border-transparent',
        outline: 'bg-transparent border-2 border-black text-black hover:bg-black/10',
        text: 'bg-transparent text-black hover:text-black/80',
        play: 'bg-transparent border-2 border-black text-black hover:bg-black/10 pl-4 pr-6',
    };

    const sizeStyles = {
        sm: 'text-sm py-2 px-4',
        md: 'text-base py-3 px-6',
        lg: 'text-lg py-3 px-8',
    };

    const buttonVariants = {
        initial: { scale: 1 },
        hover: {
            scale: animated ? 1.03 : 1,
            transition: { duration: 0.2 }
        },
        tap: {
            scale: animated ? 0.97 : 1,
            transition: { duration: 0.1 }
        },
    };

    const PlayIcon = () => (
        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
        </svg>
    );

    const ButtonComponent = () => (
        <motion.button
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            onClick={onClick}
            className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        >
            {variant === 'play' && <PlayIcon />}
            {icon && variant !== 'play' && <span className="mr-2">{icon}</span>}
            {children}
        </motion.button>
    );

    if (href) {
        return (
            <Link href={href}>
                <ButtonComponent />
            </Link>
        );
    }

    return <ButtonComponent />;
};

export default Button;