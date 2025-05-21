import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

// Types pour les messages
type MessageType = 'user' | 'ai';

interface Message {
    id: number;
    type: MessageType;
    text: string;
}

interface TypedMessage extends Message {
    displayedText: string;
    isCompleted: boolean;
}

interface ChatbotAnimationProps {
    initialDelay?: number;
    typingSpeed?: number;
    delayBetweenMessages?: number;
    loopDelay?: number;
    characterTypingSpeed?: number;
}

const ChatbotAnimation = ({
    initialDelay = 300,
    typingSpeed = 40,
    delayBetweenMessages = 1000,
    loopDelay = 3000,
    characterTypingSpeed = 20
}: ChatbotAnimationProps) => {
    const [messages, setMessages] = useState<TypedMessage[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
    const [currentTypingMessage, setCurrentTypingMessage] = useState<TypedMessage | null>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const [isRestarting, setIsRestarting] = useState(false);

    // Prédéfinir les messages de la conversation avec IDs uniques
    const conversationData: Message[] = [
        { id: 1, type: 'user', text: "Bonjour, je dois configurer un serveur Docker pour notre nouvelle architecture microservices. Pouvez-vous m'aider ?" },
        { id: 2, type: 'ai', text: "Bonjour ! Je serais ravi de vous aider avec la configuration de Docker pour vos microservices. Selon la documentation interne de votre entreprise, vous utilisez principalement Docker Compose. Souhaitez-vous des instructions sur ce sujet spécifique ?" },
        { id: 3, type: 'user', text: "Oui, j'ai besoin de comprendre comment structurer le docker-compose.yml pour gérer la communication entre nos services." },
        { id: 4, type: 'ai', text: "D'après vos documents techniques, voici les étapes recommandées pour votre architecture microservices :\n\n1. Créez un réseau Docker dédié\n2. Définissez chaque service avec son propre Dockerfile\n3. Configurez les variables d'environnement selon l'environnement cible\n\nJe peux vous fournir un exemple basé sur votre projet actuel." },
        { id: 5, type: 'user', text: "Ce serait parfait, pouvez-vous me montrer un exemple adapté à notre stack technique ?" },
        { id: 6, type: 'ai', text: "Voici un exemple basé sur votre stack actuelle (Node.js, PostgreSQL et Redis) :\n\n```yaml\nversion: '3.8'\n\nnetworks:\n  app-network:\n    driver: bridge\n\nservices:\n  api:\n    build: ./api\n    ports:\n      - \"3000:3000\"\n    environment:\n      - NODE_ENV=development\n      - DB_HOST=postgres\n    networks:\n      - app-network\n    depends_on:\n      - postgres\n      - redis\n\n  postgres:\n    image: postgres:13\n    environment:\n      - POSTGRES_USER=app\n      - POSTGRES_PASSWORD=securepwd\n    volumes:\n      - pgdata:/var/lib/postgresql/data\n    networks:\n      - app-network\n\n  redis:\n    image: redis:6\n    networks:\n      - app-network\n\nvolumes:\n  pgdata:\n```\n\nCe fichier correspond aux standards définis dans votre guide d'architecture interne." },
    ];

    // Réinitialiser l'animation quand terminée
    useEffect(() => {
        if (currentMessageIndex >= conversationData.length && !isRestarting) {
            const resetTimer = setTimeout(() => {
                setIsRestarting(true);
                setMessages([]);
                setCurrentMessageIndex(0);
                setCurrentTypingMessage(null);
                setIsTyping(false);

                // Retarder un peu la reprise après nettoyage
                setTimeout(() => {
                    setIsRestarting(false);
                }, 500);
            }, loopDelay);

            return () => clearTimeout(resetTimer);
        }
    }, [currentMessageIndex, loopDelay, conversationData.length, isRestarting]);

    // Effet pour simuler la saisie et l'ajout progressif des messages
    useEffect(() => {
        if (currentMessageIndex >= conversationData.length || isRestarting) return;
        if (currentTypingMessage !== null) return; // Si on est déjà en train de taper un message

        const currentMessage = conversationData[currentMessageIndex];

        // Démarre après le délai initial pour le premier message
        const startDelay = currentMessageIndex === 0 ? initialDelay : 0;

        // Simule le délai avant que l'IA ou l'utilisateur commence à taper
        const typingDelay = setTimeout(() => {
            if (currentMessage.type === 'ai') {
                // Montrer l'indicateur de frappe avant de commencer
                setIsTyping(true);

                // Durée d'attente avant de commencer à taper
                setTimeout(() => {
                    setIsTyping(false);
                    // Commencer à taper caractère par caractère
                    setCurrentTypingMessage({
                        ...currentMessage,
                        displayedText: '',
                        isCompleted: false
                    });
                }, 1000); // Durée fixe pour l'apparition de l'indicateur de frappe
            } else {
                // Pour les messages utilisateur, commencer à taper directement
                setCurrentTypingMessage({
                    ...currentMessage,
                    displayedText: '',
                    isCompleted: false
                });
            }
        }, startDelay + (currentMessageIndex > 0 ? delayBetweenMessages : 0));

        return () => clearTimeout(typingDelay);
    }, [currentMessageIndex, initialDelay, typingSpeed, delayBetweenMessages, conversationData, currentTypingMessage, isRestarting]);

    // Effet pour l'animation caractère par caractère
    useEffect(() => {
        if (!currentTypingMessage || currentTypingMessage.isCompleted || isRestarting) return;

        const fullText = currentTypingMessage.text;
        const currentLength = currentTypingMessage.displayedText.length;

        if (currentLength >= fullText.length) {
            // Le message a fini de s'écrire
            const timer = setTimeout(() => {
                setMessages(prev => [...prev, { ...currentTypingMessage, isCompleted: true }]);
                setCurrentTypingMessage(null);
                setCurrentMessageIndex(prev => prev + 1);
            }, 100); // Petit délai après avoir terminé de taper

            return () => clearTimeout(timer);
        }

        // Ajouter le caractère suivant
        const timer = setTimeout(() => {
            setCurrentTypingMessage(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    displayedText: fullText.slice(0, currentLength + 1)
                };
            });
        }, characterTypingSpeed);

        return () => clearTimeout(timer);
    }, [currentTypingMessage, characterTypingSpeed, isRestarting]);

    // Auto-scroll au bas du chat quand de nouveaux messages arrivent
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, isTyping, currentTypingMessage]);

    // Animation pour l'indicateur de frappe
    const typingVariants = {
        initial: { opacity: 0, y: 10 },
        animate: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.3 }
        },
        exit: {
            opacity: 0,
            transition: { duration: 0.2 }
        }
    };

    // Animation pour les bulles de messages
    const messageVariants = {
        initial: { opacity: 0, y: 20 },
        animate: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.4,
                ease: [0.16, 1, 0.3, 1]
            }
        }
    };

    // Fonction pour formatter le texte avec prise en charge des sauts de ligne et code
    const formatMessageText = (text: string, messageId: number) => {
        // Détecte les blocs de code
        if (text.includes('```')) {
            const parts = text.split('```');
            return (
                <>
                    {parts.map((part, index) => {
                        // Si c'est un index impair, c'est un bloc de code
                        if (index % 2 === 1) {
                            // Extrait le langage de programmation s'il est spécifié (ex: ```yaml)
                            const [lang, ...codeParts] = part.split('\n');
                            const code = codeParts.join('\n');

                            return (
                                <div key={`code-${messageId}-${index}`} className="bg-black/80 p-3 rounded-md font-mono text-sm mt-2 mb-2 overflow-x-auto">
                                    {/* Barre supérieure avec le nom du langage */}
                                    {lang && (
                                        <div className="text-white/50 text-xs mb-2 pb-1 border-b border-white/10">
                                            {lang}
                                        </div>
                                    )}
                                    {/* Corps du code avec préservation des sauts de ligne */}
                                    <pre className="text-primary/90">
                                        {code}
                                    </pre>
                                </div>
                            );
                        } else {
                            // Texte normal avec préservation des sauts de ligne
                            return part.split('\n').map((line, i) => (
                                <p key={`text-${messageId}-${index}-${i}`} className={i > 0 ? 'mt-2' : ''}>
                                    {line}
                                </p>
                            ));
                        }
                    })}
                </>
            );
        }

        // Texte normal avec sauts de ligne
        return text.split('\n').map((line, i) => (
            <p key={`line-${messageId}-${i}`} className={i > 0 ? 'mt-2' : ''}>
                {line}
            </p>
        ));
    };

    return (
        <div className="osmo-chatbot bg-black/95 rounded-lg overflow-hidden w-full max-w-2xl mx-auto shadow-2xl">
            {/* Header du chatbot */}
            <div className="chatbot-header bg-black/90 p-4 border-b border-white/10 flex items-center">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                        {/* Logo Osmo simplifié ou avatar IA */}
                        <div className="text-primary font-bold text-sm">O</div>
                    </div>
                    <div>
                        <div className="text-white font-medium">Osmo Assistant</div>
                        <div className="text-white/50 text-xs">Connecté à votre base de connaissances</div>
                    </div>
                </div>
                <div className="ml-auto flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
            </div>

            {/* Corps du chat avec messages */}
            <div
                ref={chatContainerRef}
                className="chatbot-body p-4 h-96 overflow-y-auto custom-scrollbar"
            >
                <div className="flex flex-col space-y-4">
                    {/* Messages complets */}
                    {messages.map((message) => (
                        <motion.div
                            key={message.id}
                            variants={messageVariants}
                            initial="initial"
                            animate="animate"
                            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            {message.type === 'ai' && (
                                <div className="w-8 h-8 rounded-full bg-primary/20 mr-2 flex-shrink-0 flex items-center justify-center">
                                    <div className="text-primary font-bold text-sm">O</div>
                                </div>
                            )}
                            <div
                                className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.type === 'user'
                                        ? 'bg-primary text-black rounded-tr-none'
                                        : 'bg-white/10 text-white rounded-tl-none'
                                    }`}
                            >
                                {formatMessageText(message.text, message.id)}
                            </div>
                        </motion.div>
                    ))}

                    {/* Message en cours de frappe */}
                    {currentTypingMessage && (
                        <motion.div
                            key={`typing-${currentTypingMessage.id}`}
                            variants={messageVariants}
                            initial="initial"
                            animate="animate"
                            className={`flex ${currentTypingMessage.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            {currentTypingMessage.type === 'ai' && (
                                <div className="w-8 h-8 rounded-full bg-primary/20 mr-2 flex-shrink-0 flex items-center justify-center">
                                    <div className="text-primary font-bold text-sm">O</div>
                                </div>
                            )}
                            <div
                                className={`max-w-[80%] rounded-2xl px-4 py-3 ${currentTypingMessage.type === 'user'
                                        ? 'bg-primary text-black rounded-tr-none'
                                        : 'bg-white/10 text-white rounded-tl-none'
                                    }`}
                            >
                                {formatMessageText(currentTypingMessage.displayedText, currentTypingMessage.id)}
                                <span className="inline-block w-2 h-4 ml-1 bg-current animate-pulse"></span>
                            </div>
                        </motion.div>
                    )}

                    {/* Indicateur de frappe */}
                    <AnimatePresence>
                        {isTyping && (
                            <motion.div
                                variants={typingVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                className="flex items-center"
                            >
                                <div className="w-8 h-8 rounded-full bg-primary/20 mr-2 flex-shrink-0 flex items-center justify-center">
                                    <div className="text-primary font-bold text-sm">O</div>
                                </div>
                                <div className="bg-white/10 text-white rounded-2xl rounded-tl-none px-4 py-3">
                                    <div className="flex space-x-2">
                                        <div className="typing-dot w-2 h-2 rounded-full bg-primary/70 animate-pulse" style={{ animationDelay: '0ms' }}></div>
                                        <div className="typing-dot w-2 h-2 rounded-full bg-primary/70 animate-pulse" style={{ animationDelay: '300ms' }}></div>
                                        <div className="typing-dot w-2 h-2 rounded-full bg-primary/70 animate-pulse" style={{ animationDelay: '600ms' }}></div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Pied du chatbot avec champ de saisie */}
            <div className="chatbot-footer border-t border-white/10 p-4 bg-black/90">
                <div className="relative">
                    <input
                        type="text"
                        disabled
                        placeholder="Posez votre question..."
                        className="w-full bg-white/10 text-white rounded-full px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button className="absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                        <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatbotAnimation;