// src/hooks/usePerformanceOptimizer.ts
import { useEffect, useRef, useState, useCallback } from 'react';

interface PerformanceMetrics {
    fps: number;
    isLowPerformance: boolean;
    shouldReduceAnimations: boolean;
}

interface OptimizationSettings {
    targetFPS: number;
    sampleSize: number;
    performanceThreshold: number;
    checkInterval: number;
}

const defaultSettings: OptimizationSettings = {
    targetFPS: 60,
    sampleSize: 10,
    performanceThreshold: 30, // FPS en dessous duquel on considère les performances faibles
    checkInterval: 1000, // Vérification toutes les secondes
};

export const usePerformanceOptimizer = (settings: Partial<OptimizationSettings> = {}) => {
    const config = { ...defaultSettings, ...settings };
    const [metrics, setMetrics] = useState<PerformanceMetrics>({
        fps: 60,
        isLowPerformance: false,
        shouldReduceAnimations: false,
    });

    const frameTimesRef = useRef<number[]>([]);
    const lastFrameTimeRef = useRef<number>(0);
    const animationFrameRef = useRef<number>();
    const checkIntervalRef = useRef<NodeJS.Timeout>();

    // Fonction pour mesurer les FPS
    const measureFPS = useCallback((currentTime: number) => {
        if (lastFrameTimeRef.current) {
            const deltaTime = currentTime - lastFrameTimeRef.current;
            const fps = 1000 / deltaTime;

            frameTimesRef.current.push(fps);

            // Garder seulement les dernières mesures
            if (frameTimesRef.current.length > config.sampleSize) {
                frameTimesRef.current.shift();
            }
        }

        lastFrameTimeRef.current = currentTime;
        animationFrameRef.current = requestAnimationFrame(measureFPS);
    }, [config.sampleSize]);

    // Fonction pour calculer les métriques moyennes
    const calculateMetrics = useCallback(() => {
        if (frameTimesRef.current.length === 0) return;

        const averageFPS = frameTimesRef.current.reduce((sum, fps) => sum + fps, 0) / frameTimesRef.current.length;
        const isLowPerformance = averageFPS < config.performanceThreshold;
        const shouldReduceAnimations = averageFPS < config.performanceThreshold * 0.8; // 80% du seuil

        setMetrics({
            fps: Math.round(averageFPS),
            isLowPerformance,
            shouldReduceAnimations,
        });
    }, [config.performanceThreshold]);

    // Détection des capacités du dispositif
    const getDeviceCapabilities = useCallback(() => {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        const hasWebGL = !!gl;

        // Détection mobile
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        // Estimation des performances basée sur les caractéristiques
        const deviceMemory = (navigator as any).deviceMemory || 4; // GB
        const hardwareConcurrency = navigator.hardwareConcurrency || 4;

        return {
            hasWebGL,
            isMobile,
            deviceMemory,
            hardwareConcurrency,
            estimatedPerformance: deviceMemory >= 4 && hardwareConcurrency >= 4 && hasWebGL ? 'high' :
                deviceMemory >= 2 && hardwareConcurrency >= 2 ? 'medium' : 'low'
        };
    }, []);

    // Hook principal
    useEffect(() => {
        const deviceCapabilities = getDeviceCapabilities();

        // Adapter les paramètres selon le dispositif
        if (deviceCapabilities.estimatedPerformance === 'low') {
            setMetrics(prev => ({
                ...prev,
                shouldReduceAnimations: true,
                isLowPerformance: true,
            }));
            return; // Pas besoin de monitoring FPS sur les appareils faibles
        }

        // Démarrer le monitoring FPS
        animationFrameRef.current = requestAnimationFrame(measureFPS);

        // Calculer les métriques périodiquement
        checkIntervalRef.current = setInterval(calculateMetrics, config.checkInterval);

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (checkIntervalRef.current) {
                clearInterval(checkIntervalRef.current);
            }
        };
    }, [measureFPS, calculateMetrics, config.checkInterval, getDeviceCapabilities]);

    // Fonctions utilitaires pour les développeurs
    const getOptimizationRecommendations = useCallback(() => {
        const recommendations: string[] = [];

        if (metrics.shouldReduceAnimations) {
            recommendations.push('Réduire le nombre d\'animations simultanées');
            recommendations.push('Utiliser transform au lieu de modifier les propriétés de layout');
            recommendations.push('Réduire la complexité des animations CSS');
        }

        if (metrics.isLowPerformance && !metrics.shouldReduceAnimations) {
            recommendations.push('Considérer l\'utilisation de will-change pour les éléments animés');
            recommendations.push('Optimiser les images et les assets');
        }

        if (metrics.fps > 50) {
            recommendations.push('Performances excellentes - vous pouvez ajouter plus d\'effets');
        }

        return recommendations;
    }, [metrics]);

    // Fonction pour adapter automatiquement les paramètres d'animation
    const getAdaptiveAnimationSettings = useCallback(() => {
        return {
            duration: metrics.shouldReduceAnimations ? 0.2 : 0.6,
            complexity: metrics.shouldReduceAnimations ? 'low' : 'high',
            particleCount: metrics.shouldReduceAnimations ? 5 : 20,
            enableBlur: !metrics.shouldReduceAnimations,
            enableParallax: !metrics.isLowPerformance,
            frameRate: metrics.shouldReduceAnimations ? 30 : 60,
        };
    }, [metrics]);

    return {
        metrics,
        getOptimizationRecommendations,
        getAdaptiveAnimationSettings,
        isOptimized: !metrics.isLowPerformance,
    };
};

// Hook pour les préférences utilisateur
export const useUserPreferences = () => {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
    const [prefersHighContrast, setPrefersHighContrast] = useState(false);

    useEffect(() => {
        // Vérifier les préférences de mouvement réduit
        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(motionQuery.matches);

        const handleMotionChange = (e: MediaQueryListEvent) => {
            setPrefersReducedMotion(e.matches);
        };

        motionQuery.addEventListener('change', handleMotionChange);

        // Vérifier les préférences de contraste élevé
        const contrastQuery = window.matchMedia('(prefers-contrast: high)');
        setPrefersHighContrast(contrastQuery.matches);

        const handleContrastChange = (e: MediaQueryListEvent) => {
            setPrefersHighContrast(e.matches);
        };

        contrastQuery.addEventListener('change', handleContrastChange);

        return () => {
            motionQuery.removeEventListener('change', handleMotionChange);
            contrastQuery.removeEventListener('change', handleContrastChange);
        };
    }, []);

    return {
        prefersReducedMotion,
        prefersHighContrast,
        shouldDisableAnimations: prefersReducedMotion,
    };
};

// Hook combiné pour une optimisation complète
export const useSmartAnimations = (settings?: Partial<OptimizationSettings>) => {
    const performance = usePerformanceOptimizer(settings);
    const userPrefs = useUserPreferences();

    const shouldReduceAnimations = userPrefs.shouldDisableAnimations || performance.metrics.shouldReduceAnimations;
    const animationSettings = performance.getAdaptiveAnimationSettings();

    // Adapter les paramètres selon les préférences utilisateur
    if (userPrefs.shouldDisableAnimations) {
        animationSettings.duration = 0.01;
        animationSettings.complexity = 'none' as any;
        animationSettings.particleCount = 0;
        animationSettings.enableBlur = false;
        animationSettings.enableParallax = false;
    }

    return {
        ...performance,
        userPrefs,
        shouldReduceAnimations,
        animationSettings,
        isAccessible: !userPrefs.prefersReducedMotion || userPrefs.prefersHighContrast,
    };
};