import { motion } from 'framer-motion';
import Link from 'next/link';

interface ButtonProps {
    children: React.ReactNode;
    href?: string;
    onClick?: () => void;
    variant?: 'primary' | 'outline' | 'text';
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
        primary: 'bg-primary text-black hover:bg-primary/90',
        outline: 'bg-transparent border-2 border-white text-white hover:bg-white/10',
        text: 'bg-transparent text-white hover:text-primary',
    };

    const sizeStyles = {
        sm: 'text-sm py-2 px-4',
        md: 'text-base py-3 px-6',
        lg: 'text-lg py-4 px-8',
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

    const ButtonComponent = () => (
        <motion.button
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            onClick={onClick}
            className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        >
            {icon && <span className="mr-2">{icon}</span>}
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