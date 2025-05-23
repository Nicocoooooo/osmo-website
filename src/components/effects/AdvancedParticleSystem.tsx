// src/components/effects/AdvancedParticleSystem.tsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSmartAnimations } from '../../hooks/usePerformanceOptimizer';

interface Particle {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    size: number;
    color: string;
    opacity: number;
    type: 'bubble' | 'spark' | 'glow' | 'liquid';
}

interface AdvancedParticleSystemProps {
    count?: number;
    emitterX?: number;
    emitterY?: number;
    width?: number;
    height?: number;
    interactive?: boolean;
    theme?: 'liquid' | 'electric' | 'cosmic' | 'minimal';
    intensity?: 'low' | 'medium' | 'high';
}

const AdvancedParticleSystem: React.FC<AdvancedParticleSystemProps> = ({
    count = 20,
    emitterX = 50,
    emitterY = 50,
    width = 800,
    height = 600,
    interactive = true,
    theme = 'liquid',
    intensity = 'medium'
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const animationRef = useRef<number>();
    const mouseRef = useRef({ x: emitterX, y: emitterY });
    const [isActive, setIsActive] = useState(true);

    // Utiliser notre hook d'optimisation
    const { animationSettings, shouldReduceAnimations } = useSmartAnimations();

    // Configuration adaptative selon les performances
    const adaptiveCount = shouldReduceAnimations ?
        Math.min(count, animationSettings.particleCount) : count;

    // Thèmes de couleurs
    const themes = {
        liquid: {
            colors: ['#CDFE00', '#A8D500', '#83AC00', '#5E8300'],
            glowColor: 'rgba(205, 254, 0, 0.3)',
            particleTypes: ['bubble', 'liquid'] as const,
        },
        electric: {
            colors: ['#00F5FF', '#0080FF', '#004CFF', '#001AFF'],
            glowColor: 'rgba(0, 245, 255, 0.4)',
            particleTypes: ['spark', 'glow'] as const,
        },
        cosmic: {
            colors: ['#FF6B35', '#F7931E', '#FFD23F', '#FFFFFF'],
            glowColor: 'rgba(255, 107, 53, 0.3)',
            particleTypes: ['glow', 'spark'] as const,
        },
        minimal: {
            colors: ['#FFFFFF', '#F0F0F0', '#E0E0E0', '#D0D0D0'],
            glowColor: 'rgba(255, 255, 255, 0.2)',
            particleTypes: ['bubble'] as const,
        }
    };

    const currentTheme = themes[theme];

    // Créer une particule
    const createParticle = useCallback((x: number, y: number): Particle => {
        const particleType = currentTheme.particleTypes[
            Math.floor(Math.random() * currentTheme.particleTypes.length)
        ];

        const intensityMultiplier = {
            low: 0.5,
            medium: 1,
            high: 1.5
        }[intensity];

        return {
            id: Math.random(),
            x,
            y,
            vx: (Math.random() - 0.5) * 4 * intensityMultiplier,
            vy: (Math.random() - 0.5) * 4 * intensityMultiplier,
            life: 0,
            maxLife: 60 + Math.random() * 120,
            size: 2 + Math.random() * 6,
            color: currentTheme.colors[Math.floor(Math.random() * currentTheme.colors.length)],
            opacity: 0.8,
            type: particleType,
        };
    }, [currentTheme, intensity]);

    // Mettre à jour les particules
    const updateParticles = useCallback(() => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Nettoyer le canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Mettre à jour les particules existantes
        particlesRef.current = particlesRef.current.filter(particle => {
            particle.life++;
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Gravité légère
            particle.vy += 0.05;

            // Friction
            particle.vx *= 0.99;
            particle.vy *= 0.99;

            // Calculer l'opacité basée sur la vie
            const lifeRatio = particle.life / particle.maxLife;
            particle.opacity = Math.max(0, 1 - lifeRatio);

            // Dessiner la particule
            ctx.save();
            ctx.globalAlpha = particle.opacity;

            switch (particle.type) {
                case 'bubble':
                    drawBubble(ctx, particle);
                    break;
                case 'spark':
                    drawSpark(ctx, particle);
                    break;
                case 'glow':
                    drawGlow(ctx, particle);
                    break;
                case 'liquid':
                    drawLiquid(ctx, particle);
                    break;
            }

            ctx.restore();

            return particle.life < particle.maxLife;
        });

        // Ajouter de nouvelles particules
        if (particlesRef.current.length < adaptiveCount && isActive) {
            const emissionRate = shouldReduceAnimations ? 1 : 2;
            for (let i = 0; i < emissionRate; i++) {
                particlesRef.current.push(
                    createParticle(
                        mouseRef.current.x + (Math.random() - 0.5) * 20,
                        mouseRef.current.y + (Math.random() - 0.5) * 20
                    )
                );
            }
        }

        animationRef.current = requestAnimationFrame(updateParticles);
    }, [adaptiveCount, shouldReduceAnimations, isActive, createParticle]);

    // Fonctions de dessin pour différents types de particules
    const drawBubble = (ctx: CanvasRenderingContext2D, particle: Particle) => {
        const gradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.size
        );
        gradient.addColorStop(0, particle.color);
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
    };

    const drawSpark = (ctx: CanvasRenderingContext2D, particle: Particle) => {
        ctx.strokeStyle = particle.color;
        ctx.lineWidth = particle.size / 2;
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(particle.x - particle.vx, particle.y - particle.vy);
        ctx.lineTo(particle.x, particle.y);
        ctx.stroke();
    };

    const drawGlow = (ctx: CanvasRenderingContext2D, particle: Particle) => {
        const gradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.size * 2
        );
        gradient.addColorStop(0, particle.color + 'AA');
        gradient.addColorStop(0.5, particle.color + '44');
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
        ctx.fill();

        // Centre brillant
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size / 3, 0, Math.PI * 2);
        ctx.fill();
    };

    const drawLiquid = (ctx: CanvasRenderingContext2D, particle: Particle) => {
        // Effet liquide avec déformation
        const distortion = Math.sin(particle.life * 0.1) * particle.size * 0.3;

        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.ellipse(
            particle.x,
            particle.y,
            particle.size + distortion,
            particle.size - distortion * 0.5,
            0, 0, Math.PI * 2
        );
        ctx.fill();
    };

    // Gestion des interactions souris
    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!interactive) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        mouseRef.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    }, [interactive]);

    // Démarrer/arrêter l'animation
    useEffect(() => {
        if (shouldReduceAnimations) {
            setIsActive(false);
            return;
        }

        animationRef.current = requestAnimationFrame(updateParticles);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [updateParticles, shouldReduceAnimations]);

    // Contrôles de débogage (à supprimer en production)
    const debugControls = process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 right-4 bg-black/80 text-white p-2 rounded text-xs">
            <div>Particules: {particlesRef.current.length}/{adaptiveCount}</div>
            <div>FPS cible: {animationSettings.frameRate}</div>
            <div>Qualité: {shouldReduceAnimations ? 'Réduite' : 'Normale'}</div>
            <button
                onClick={() => setIsActive(!isActive)}
                className="mt-2 px-2 py-1 bg-primary text-black rounded"
            >
                {isActive ? 'Pause' : 'Play'}
            </button>
        </div>
    );

    return (
        <div className="relative" style={{ width, height }}>
            <canvas
                ref={canvasRef}
                width={width}
                height={height}
                onMouseMove={handleMouseMove}
                className="absolute inset-0 pointer-events-auto"
                style={{
                    background: `radial-gradient(circle at ${emitterX}% ${emitterY}%, ${currentTheme.glowColor}, transparent 50%)`,
                }}
            />
            {debugControls}
        </div>
    );
};

export default AdvancedParticleSystem;