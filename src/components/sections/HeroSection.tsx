import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import gsap from 'gsap';
import Button from '../ui/Button';
import * as THREE from 'three';

/**
 * HeroSection optimisé avec:
 * - Suppression complète du canvas de distorsion
 * - Optimisation de Three.js
 * - Correction des erreurs de type (physicallyCorrectLights)
 */

const HeroSection = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const threeContainerRef = useRef<HTMLDivElement>(null);

    // État pour suivre si un composant est visible
    const [isInView, setIsInView] = useState(false);

    // Référence pour la scène Three.js
    const threeSceneRef = useRef<{
        scene?: THREE.Scene;
        camera?: THREE.PerspectiveCamera;
        renderer?: THREE.WebGLRenderer;
        sphere?: THREE.Mesh;
        particles?: THREE.Points;
        lines?: THREE.Line[];
    }>({});

    // Référence pour l'animation frame
    const threeAnimationFrameRef = useRef<number | null>(null);

    // Animation des titres et sous-titres avec Framer Motion
    const titleVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1]
            }
        }
    };

    const buttonVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                delay: 0.3 + (i * 0.1),
                ease: [0.16, 1, 0.3, 1]
            }
        })
    };

    // Observer pour déterminer si l'élément est visible
    useEffect(() => {
        if (!textRef.current) return;

        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    setIsInView(entry.isIntersecting);
                });
            },
            { threshold: 0.2 }
        );

        observer.observe(textRef.current);

        return () => {
            if (textRef.current) {
                observer.unobserve(textRef.current);
            }
        };
    }, []);

    // Animation du texte au scroll avec GSAP (plus légère)
    useEffect(() => {
        if (textRef.current && containerRef.current) {
            gsap.fromTo(
                textRef.current,
                { y: 0 },
                {
                    y: -20, // Valeur réduite
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top top',
                        end: 'bottom top',
                        scrub: 0.5, // Ajout de lissage
                        invalidateOnRefresh: true
                    }
                }
            );
        }
    }, []);

    // Visualisation 3D avec Three.js optimisée
    useEffect(() => {
        if (!threeContainerRef.current) return;

        // Setup Three.js
        const container = threeContainerRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight;

        // Supprimer les éléments précédents
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

        // Scene, camera et renderer
        const scene = new THREE.Scene();
        threeSceneRef.current.scene = scene;

        const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
        camera.position.z = 4.5;
        threeSceneRef.current.camera = camera;

        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: false, // Désactiver l'antialiasing pour la performance
            powerPreference: 'high-performance'
        });

        renderer.setPixelRatio(window.devicePixelRatio > 1 ? 1.5 : 1); // Limiter le pixel ratio
        renderer.setSize(width, height);
        renderer.setClearColor(0x000000, 0);

        // Désactiver les ombres
        renderer.shadowMap.enabled = false;

        // Note: physicallyCorrectLights n'est plus nécessaire, nous l'avons retiré

        container.appendChild(renderer.domElement);
        threeSceneRef.current.renderer = renderer;

        // Géométrie 3D - sphère simplifiée
        const geometry = new THREE.IcosahedronGeometry(1.8, 1); // Réduit la complexité (niveau 1 au lieu de 2)

        // Matériau en maille (wireframe) simplifié
        const material = new THREE.MeshBasicMaterial({
            color: 0x000000,
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });

        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);
        threeSceneRef.current.sphere = sphere;

        // Ajouter des points (réduit le nombre)
        const particlesCount = 60; // Réduit de 150 à 60
        const particlesGeometry = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount; i++) {
            // Distribuer les points uniformément autour de la sphère
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const radius = 1.5 + Math.random() * 0.5;

            particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            particlePositions[i * 3 + 2] = radius * Math.cos(phi);
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

        // Matériau pour les points
        const particlesMaterial = new THREE.PointsMaterial({
            color: 0x000000,
            size: 0.05,
            transparent: true,
            opacity: 0.7,
            sizeAttenuation: true
        });

        const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particleSystem);
        threeSceneRef.current.particles = particleSystem;

        // Ajouter des connexions entre les points (réduites)
        const linesMaterial = new THREE.LineBasicMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0.15
        });

        const lines: THREE.Line[] = [];
        const maxConnections = 10; // Réduit de 30 à 10

        for (let i = 0; i < maxConnections; i++) {
            const idx1 = Math.floor(Math.random() * particlesCount);
            const idx2 = Math.floor(Math.random() * particlesCount);

            const pos1 = new THREE.Vector3(
                particlePositions[idx1 * 3],
                particlePositions[idx1 * 3 + 1],
                particlePositions[idx1 * 3 + 2]
            );

            const pos2 = new THREE.Vector3(
                particlePositions[idx2 * 3],
                particlePositions[idx2 * 3 + 1],
                particlePositions[idx2 * 3 + 2]
            );

            const lineGeometry = new THREE.BufferGeometry().setFromPoints([pos1, pos2]);
            const line = new THREE.Line(lineGeometry, linesMaterial);
            lines.push(line);
            scene.add(line);
        }

        threeSceneRef.current.lines = lines;

        // Animation avec throttling FPS
        let animationId: number;
        let lastTime = 0;
        let fpsInterval = 1000 / 30; // Limiter à 30 FPS

        const animate = (time: number) => {
            // Calculer le delta de temps écoulé
            const now = time;
            const elapsed = now - lastTime;

            // Si le temps écoulé est inférieur à l'intervalle cible, continuer sans mettre à jour
            if (elapsed < fpsInterval) {
                threeAnimationFrameRef.current = requestAnimationFrame(animate);
                return;
            }

            // Mettre à jour le dernier temps d'exécution
            lastTime = now - (elapsed % fpsInterval);

            if (!sphere || !particleSystem) return;

            // Rotation lente (réduite)
            sphere.rotation.y += 0.0001 * elapsed;
            sphere.rotation.x += 0.00005 * elapsed;
            particleSystem.rotation.y = sphere.rotation.y;
            particleSystem.rotation.x = sphere.rotation.x;

            // Effet de respiration (réduit)
            const breatheFactor = Math.sin(time * 0.0003) * 0.02 + 1;
            sphere.scale.set(breatheFactor, breatheFactor, breatheFactor);

            // Mettre à jour les lignes
            if (lines) {
                lines.forEach(line => {
                    line.rotation.y = sphere.rotation.y;
                    line.rotation.x = sphere.rotation.x;
                });
            }

            if (renderer && scene && camera) {
                renderer.render(scene, camera);
            }

            threeAnimationFrameRef.current = requestAnimationFrame(animate);
        };

        // Responsive avec throttling
        const handleThreeResize = () => {
            if (!camera || !renderer) return;

            const newWidth = container.clientWidth;
            const newHeight = container.clientHeight;

            camera.aspect = newWidth / newHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(newWidth, newHeight);
        };

        let resizeThreeTimeout: ReturnType<typeof setTimeout>;
        const throttledThreeResize = () => {
            clearTimeout(resizeThreeTimeout);
            resizeThreeTimeout = setTimeout(handleThreeResize, 200);
        };

        window.addEventListener('resize', throttledThreeResize);

        // Lancer l'animation avec valeur initiale
        lastTime = performance.now();
        threeAnimationFrameRef.current = requestAnimationFrame(animate);

        return () => {
            // Nettoyer les animations et les événements
            if (threeAnimationFrameRef.current) {
                cancelAnimationFrame(threeAnimationFrameRef.current);
            }

            window.removeEventListener('resize', throttledThreeResize);
            clearTimeout(resizeThreeTimeout);

            // Libérer les ressources Three.js
            if (geometry) geometry.dispose();
            if (material instanceof THREE.Material) material.dispose();
            if (particlesGeometry) particlesGeometry.dispose();
            if (particlesMaterial instanceof THREE.Material) particlesMaterial.dispose();

            if (lines) {
                lines.forEach(line => {
                    if (line.geometry) line.geometry.dispose();
                    if (line.material instanceof THREE.Material) line.material.dispose();
                });
            }

            if (renderer) renderer.dispose();

            // Vider les références
            threeSceneRef.current = {};
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="relative min-h-screen flex items-center overflow-hidden bg-primary"
        >
            {/* Contenu principal */}
            <div className="container mx-auto px-6 md:px-12 relative z-20 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
                    {/* Titre et boutons - occupe 3 colonnes sur 5 */}
                    <div ref={textRef} className="lg:col-span-3 max-w-3xl">
                        <motion.h1
                            className="playfair text-black mb-12 lg:mb-24"
                            variants={titleVariants}
                            initial="hidden"
                            animate={isInView ? "visible" : "hidden"}
                        >
                            <span className="block font-normal text-5xl md:text-7xl xl:text-8xl" style={{ lineHeight: '1.1' }}>
                                le savoir,
                            </span>
                            <span className="block italic font-normal text-5xl md:text-7xl xl:text-8xl" style={{ lineHeight: '1.1' }}>
                                personnalisé
                            </span>
                            <span className="block font-medium text-5xl md:text-7xl xl:text-8xl" style={{ lineHeight: '1.1' }}>
                                par l'IA
                            </span>
                        </motion.h1>

                        <div className="flex flex-wrap gap-4">
                            <motion.div
                                custom={0}
                                variants={buttonVariants}
                                initial="hidden"
                                animate={isInView ? "visible" : "hidden"}
                            >
                                <Button variant="dark" size="lg">
                                    Démo
                                </Button>
                            </motion.div>

                            <motion.div
                                custom={1}
                                variants={buttonVariants}
                                initial="hidden"
                                animate={isInView ? "visible" : "hidden"}
                            >
                                <Button variant="play" size="lg">
                                    Commencer l'aventure
                                </Button>
                            </motion.div>
                        </div>
                    </div>

                    {/* Visualisation 3D à droite */}
                    <div className="lg:col-span-2 h-full relative hidden lg:block">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.4 }}
                            className="w-full"
                            style={{ height: '400px' }}
                        >
                            <div
                                ref={threeContainerRef}
                                className="w-full h-full relative rounded-xl overflow-hidden"
                            ></div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;