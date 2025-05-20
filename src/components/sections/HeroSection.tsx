import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import gsap from 'gsap';
import Button from '../ui/Button';
import * as THREE from 'three';

interface GridPoint {
    x: number;
    y: number;
    originalX: number;
    originalY: number;
}

interface GridData {
    points: GridPoint[];
    cols: number;
    rows: number;
    width: number;
    height: number;
}

const HeroSection = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const threeContainerRef = useRef<HTMLDivElement>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const isInView = useInView(textRef, { once: false, amount: 0.2 });
    const animationFrameRef = useRef<number | null>(null);

    // Animation des titres et sous-titres
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

    // Tracking de la position de la souris avec throttling pour la performance
    useEffect(() => {
        let lastMoveTime = 0;
        const throttleTime = 16; // ~60fps

        const handleMouseMove = (e: MouseEvent) => {
            const currentTime = Date.now();
            if (currentTime - lastMoveTime < throttleTime) return;

            lastMoveTime = currentTime;
            const { clientX, clientY } = e;
            const x = clientX / window.innerWidth;
            const y = clientY / window.innerHeight;
            setMousePosition({ x, y });
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    // Effet de distorsion plus fluide avec GSAP
    useEffect(() => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        // Utiliser l'assertion de type simple
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        if (!ctx) return;

        // Optimisations pour la fluidité - avec assertion de type
        (ctx as any).imageSmoothingEnabled = true;
        (ctx as any).imageSmoothingQuality = 'high';

        // Configuration pour ajuster la taille du canvas avec offscreen rendering
        const setCanvasSize = () => {
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            ctx.scale(dpr, dpr);
            canvas.style.width = `${rect.width}px`;
            canvas.style.height = `${rect.height}px`;
        };

        setCanvasSize();
        let prevTimestamp = 0;

        // Configuration de la grille
        const grid = {
            spacing: Math.min(window.innerWidth, window.innerHeight) / 20,
            lineWidth: 0.5,
            amplitude: 15,
            speed: 0.0003,
            density: 1
        };

        // Créer une grille de points précalculée pour optimiser
        const createGrid = (): GridData => {
            const width = canvas.width / window.devicePixelRatio;
            const height = canvas.height / window.devicePixelRatio;

            const cols = Math.ceil(width / grid.spacing) + 2;
            const rows = Math.ceil(height / grid.spacing) + 2;

            const points: GridPoint[] = [];
            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    points.push({
                        x: i * grid.spacing,
                        y: j * grid.spacing,
                        originalX: i * grid.spacing,
                        originalY: j * grid.spacing,
                    });
                }
            }

            return { points, cols, rows, width, height };
        };

        let gridData = createGrid();

        // Animation ultrafluide avec RAF et deltaTime
        const animateGrid = (timestamp: number) => {
            if (!ctx) return;

            // Calculer le delta pour des animations stables
            const deltaTime = timestamp - prevTimestamp;
            prevTimestamp = timestamp;

            // Clear avec une légère trace pour un effet plus fluide
            ctx.clearRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);

            // Mise à jour de tous les points de la grille
            const { points, cols, rows, width, height } = gridData;

            // Calculer les déformations
            for (let i = 0; i < points.length; i++) {
                const point = points[i];

                // Distorsion basée sur le temps et la position de la souris
                const distanceToMouse = Math.sqrt(
                    Math.pow((point.originalX / width - mousePosition.x), 2) +
                    Math.pow((point.originalY / height - mousePosition.y), 2)
                );

                // Effet atténué avec la distance
                const influence = Math.max(0, 1 - distanceToMouse * 3);

                // Animation sinusoïdale continue
                const time = timestamp * grid.speed;
                const waveX = Math.sin(point.originalY * 0.01 + time) * grid.amplitude;
                const waveY = Math.cos(point.originalX * 0.01 + time) * grid.amplitude;

                // Combiner l'effet de souris et l'animation de vague
                point.x = point.originalX + waveX * 0.3 + influence * grid.amplitude * 2 * (0.5 - mousePosition.x);
                point.y = point.originalY + waveY * 0.3 + influence * grid.amplitude * 2 * (0.5 - mousePosition.y);
            }

            // Dessiner les lignes horizontales et verticales
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.07)';
            ctx.lineWidth = grid.lineWidth;

            // Verticales
            for (let col = 0; col < cols; col++) {
                ctx.beginPath();
                for (let row = 0; row < rows; row++) {
                    const point = points[row * cols + col];
                    if (row === 0) {
                        ctx.moveTo(point.x, point.y);
                    } else {
                        ctx.lineTo(point.x, point.y);
                    }
                }
                ctx.stroke();
            }

            // Horizontales
            for (let row = 0; row < rows; row++) {
                ctx.beginPath();
                for (let col = 0; col < cols; col++) {
                    const point = points[row * cols + col];
                    if (col === 0) {
                        ctx.moveTo(point.x, point.y);
                    } else {
                        ctx.lineTo(point.x, point.y);
                    }
                }
                ctx.stroke();
            }

            animationFrameRef.current = requestAnimationFrame(animateGrid);
        };

        // Gestionnaire de redimensionnement optimisé
        const handleResize = () => {
            setCanvasSize();
            gridData = createGrid();
        };

        let resizeTimeout: ReturnType<typeof setTimeout>;
        const throttledResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(handleResize, 100);
        };

        window.addEventListener('resize', throttledResize);

        // Animation du texte au scroll
        if (textRef.current && containerRef.current) {
            gsap.fromTo(
                textRef.current,
                { y: 0 },
                {
                    y: -30,
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top top',
                        end: 'bottom top',
                        scrub: true
                    }
                }
            );
        }

        // Démarrer l'animation avec une valeur initiale
        prevTimestamp = performance.now(); // Fournir une valeur initiale
        animationFrameRef.current = requestAnimationFrame(animateGrid);

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            window.removeEventListener('resize', throttledResize);
            clearTimeout(resizeTimeout);
        };
    }, [mousePosition]);

    // Visualisation 3D avec Three.js
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
        const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
        camera.position.z = 4.5;

        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        });
        renderer.setSize(width, height);
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);

        // Géométrie 3D - sphère complexe
        const geometry = new THREE.IcosahedronGeometry(1.8, 2);

        // Matériau en maille (wireframe)
        const material = new THREE.MeshBasicMaterial({
            color: 0x000000,
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });

        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);

        // Ajouter des points
        const particlesCount = 150;
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
            opacity: 0.7
        });

        const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particleSystem);

        // Ajouter des connexions entre les points
        const linesMaterial = new THREE.LineBasicMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0.15
        });

        const lines: THREE.Line[] = [];
        const maxConnections = 30;

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

        // Animation
        let animationId: number;
        let lastTime = 0;

        const animate = (time: number) => {
            const delta = time - lastTime;
            lastTime = time;

            // Rotation lente
            sphere.rotation.y += 0.0002 * delta;
            sphere.rotation.x += 0.0001 * delta;
            particleSystem.rotation.y = sphere.rotation.y;
            particleSystem.rotation.x = sphere.rotation.x;

            // Effet de respiration
            const breatheFactor = Math.sin(time * 0.0005) * 0.03 + 1;
            sphere.scale.set(breatheFactor, breatheFactor, breatheFactor);

            // Mettre à jour les lignes
            lines.forEach(line => {
                line.rotation.y = sphere.rotation.y;
                line.rotation.x = sphere.rotation.x;
            });

            renderer.render(scene, camera);
            animationId = requestAnimationFrame(animate);
        };

        // Responsive
        const handleResize = () => {
            const newWidth = container.clientWidth;
            const newHeight = container.clientHeight;

            camera.aspect = newWidth / newHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(newWidth, newHeight);
        };

        window.addEventListener('resize', handleResize);

        // Lancer l'animation avec valeur initiale
        lastTime = performance.now(); // Fournir une valeur initiale
        animationId = requestAnimationFrame(animate);

        return () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
            window.removeEventListener('resize', handleResize);

            // Libérer les ressources - Correction de dispose
            geometry.dispose();
            if (material instanceof THREE.Material) {
                material.dispose();
            }
            particlesGeometry.dispose();
            particlesMaterial.dispose();

            lines.forEach(line => {
                line.geometry.dispose();
                if (line.material instanceof THREE.Material) {
                    line.material.dispose();
                }
            });

            renderer.dispose();
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="relative min-h-screen flex items-center overflow-hidden bg-primary"
        >
            {/* Animation de distorsion en arrière-plan */}
            <div className="absolute inset-0 z-0">
                <canvas ref={canvasRef} className="w-full h-full"></canvas>
            </div>

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