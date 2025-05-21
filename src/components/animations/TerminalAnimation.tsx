import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface TypewriterEffectProps {
    texts: string[];
    typingSpeed?: number;
    delayBetweenLines?: number;
    cursorColor?: string;
}

const TerminalAnimation = ({
    texts,
    typingSpeed = 50,
    delayBetweenLines = 1000,
    cursorColor = '#CDFE00'
}: TypewriterEffectProps) => {
    const [displayedLines, setDisplayedLines] = useState<string[]>([]);
    const [currentLine, setCurrentLine] = useState('');
    const [currentLineIndex, setCurrentLineIndex] = useState(0);
    const [currentCharIndex, setCurrentCharIndex] = useState(0);
    const [showCursor, setShowCursor] = useState(true);
    const terminalRef = useRef<HTMLDivElement>(null);

    // Cursor blink effect
    useEffect(() => {
        const blinkInterval = setInterval(() => {
            setShowCursor((prev) => !prev);
        }, 530);

        return () => clearInterval(blinkInterval);
    }, []);

    // Typewriter effect
    useEffect(() => {
        if (currentLineIndex >= texts.length) return;

        // Get current text being typed
        const currentText = texts[currentLineIndex];

        // If we haven't finished typing the current line
        if (currentCharIndex < currentText.length) {
            const timer = setTimeout(() => {
                setCurrentLine((prevLine) => prevLine + currentText[currentCharIndex]);
                setCurrentCharIndex((prevIndex) => prevIndex + 1);
            }, typingSpeed);

            return () => clearTimeout(timer);
        }
        // When a line is completed
        else {
            const lineTimer = setTimeout(() => {
                // Add completed line to displayed lines
                setDisplayedLines((prevLines) => [...prevLines, currentLine]);
                // Reset for next line
                setCurrentLine('');
                setCurrentCharIndex(0);
                setCurrentLineIndex((prevIndex) => prevIndex + 1);
            }, delayBetweenLines);

            return () => clearTimeout(lineTimer);
        }
    }, [currentLineIndex, currentCharIndex, texts, typingSpeed, delayBetweenLines]);

    // Auto-scroll to the bottom when new content is added
    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [displayedLines, currentLine]);

    // Assurer un affichage correct au chargement initial
    useEffect(() => {
        if (terminalRef.current) {
            // Forcer le scrollTop à 0 pour que le texte initial soit visible
            terminalRef.current.scrollTop = 0;
        }
    }, []);

    return (
        // Bordure verte supprimée
        <div className="osmo-terminal bg-black/95 rounded-lg p-6 w-full max-w-2xl mx-auto shadow-2xl overflow-hidden">
            {/* Terminal header */}
            <div className="terminal-header flex items-center mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <div className="flex-grow text-center text-xs text-white/70">osmo-ai-terminal</div>
            </div>

            {/* Terminal body */}
            <div
                ref={terminalRef}
                className="terminal-body font-mono text-base overflow-y-auto custom-scrollbar"
                style={{ height: '320px', minHeight: '320px' }}
            >
                {/* Boot sequence - Première ligne en haut */}
                <motion.div
                    className="text-primary text-lg font-bold mb-6 py-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    [ OSMO AI SYSTEM INITIALIZED ]
                </motion.div>

                {/* Container pour les lignes avec hauteur fixe */}
                <div className="terminal-lines">
                    {/* Previously completed lines */}
                    {displayedLines.map((line, index) => (
                        <div key={index} className="text-white py-2 h-10 flex items-center">
                            <span className="text-primary font-bold mr-2">&gt;</span> {line}
                        </div>
                    ))}

                    {/* Current line being typed */}
                    {currentLine && (
                        <div className="text-white py-2 h-10 flex items-center">
                            <span className="text-primary font-bold mr-2">&gt;</span> {currentLine}
                            {showCursor && (
                                <span
                                    className="inline-block w-3 h-6 ml-1 align-middle"
                                    style={{ backgroundColor: cursorColor }}
                                ></span>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TerminalAnimation;