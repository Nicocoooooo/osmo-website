import React, { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [isPageLoaded, setIsPageLoaded] = useState(false);

    useEffect(() => {
        // Animation d'entrée de page
        setIsPageLoaded(true);

        // Création du curseur personnalisé si besoin
        const cursor = document.getElementById("custom-cursor");
        if (!cursor) {
            const customCursor = document.createElement("div");
            customCursor.id = "custom-cursor";
            document.body.appendChild(customCursor);

            const onMouseMove = (e: MouseEvent) => {
                customCursor.style.left = `${e.clientX}px`;
                customCursor.style.top = `${e.clientY}px`;
            };

            window.addEventListener("mousemove", onMouseMove);

            return () => {
                window.removeEventListener("mousemove", onMouseMove);
                customCursor.remove();
            };
        }
    }, []);

    return (
        <div className={`min-h-screen bg-primary transition-opacity duration-500 ${isPageLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <Header />
            <main className="flex-grow pt-20">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;