// src/components/LiquidLoadingScreen.tsx
import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LiquidLoadingScreenProps {
    minDisplayTime?: number;
    onComplete?: () => void;
    isLoading?: boolean;
}

const LiquidLoadingScreen: React.FC<LiquidLoadingScreenProps> = ({
    minDisplayTime = 3000,
    onComplete,
    isLoading: externalIsLoading,
}) => {
    const [internalIsLoading, setInternalIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const liquidRef = useRef<HTMLDivElement>(null);

    // Utiliser soit l'état externe, soit l'état interne
    const isLoading = externalIsLoading !== undefined ? externalIsLoading : internalIsLoading;

    // Animation de progression avec remplissage liquide
    useEffect(() => {
        if (!isLoading) return;

        const startTime = Date.now();
        const endTime = startTime + minDisplayTime;

        const animationId = requestAnimationFrame(function updateProgress() {
            const currentTime = Date.now();
            const elapsed = currentTime - startTime;
            const newProgress = Math.min(100, (elapsed / minDisplayTime) * 100);

            setProgress(newProgress);

            // Mettre à jour la hauteur du liquide
            if (liquidRef.current) {
                const liquidHeight = (newProgress / 100) * 100;
                liquidRef.current.style.setProperty('--liquid-height', `${100 - liquidHeight}%`);
            }

            if (currentTime < endTime) {
                requestAnimationFrame(updateProgress);
            } else {
                if (!externalIsLoading) {
                    if (onComplete) {
                        setTimeout(onComplete, 300);
                    }
                    setInternalIsLoading(false);
                }
            }
        });

        return () => {
            cancelAnimationFrame(animationId);
        };
    }, [isLoading, minDisplayTime, externalIsLoading, onComplete]);

    // Variantes d'animation
    const containerVariants = {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: {
            opacity: 0,
            transition: { duration: 0.5 }
        }
    };

    const logoVariants = {
        initial: { opacity: 0, scale: 0.8 },
        animate: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
        }
    };

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    variants={containerVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-black"
                >
                    {/* Effet de halo principal */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary/10 blur-3xl"></div>
                    </div>

                    {/* Conteneur principal */}
                    <div className="relative z-10 flex flex-col items-center max-w-lg w-full px-6">
                        {/* Logo avec animation liquide */}
                        <motion.div
                            variants={logoVariants}
                            className="relative"
                        >
                            {/* Effet de halo autour du logo */}
                            <motion.div
                                className="absolute inset-0 bg-primary/20 filter blur-xl rounded-full transform scale-125"
                                animate={{
                                    scale: [1.25, 1.35, 1.25],
                                    opacity: [0.2, 0.3, 0.2],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            />

                            {/* Container du logo avec animation liquide */}
                            <div
                                ref={liquidRef}
                                className="relative w-80 h-60 overflow-hidden"
                                style={{
                                    '--liquid-height': '100%'
                                } as React.CSSProperties}
                            >
                                {/* Logo SVG avec animation de remplissage */}
                                <div className="relative w-full h-full flex items-center justify-center">
                                    <svg
                                        width="320"
                                        height="200"
                                        viewBox="0 0 1512 982"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="absolute inset-0"
                                    >
                                        {/* Définition du masque pour l'effet liquide */}
                                        <defs>
                                            <linearGradient id="liquidGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                                <stop offset="0%" stopColor="#CDFE00" stopOpacity="0" />
                                                <stop offset="var(--liquid-height, 100%)" stopColor="#CDFE00" stopOpacity="0" />
                                                <stop offset="var(--liquid-height, 100%)" stopColor="#CDFE00" stopOpacity="1" />
                                                <stop offset="100%" stopColor="#CDFE00" stopOpacity="1" />
                                            </linearGradient>
                                            <mask id="liquidMask">
                                                <rect width="100%" height="100%" fill="url(#liquidGradient)" />
                                            </mask>
                                        </defs>

                                        {/* Éléments du logo avec masque liquide */}
                                        <g mask="url(#liquidMask)">
                                            <circle cx="286.637" cy="249.046" r="19.0463" fill="#CDFE00" />
                                            <ellipse cx="119.982" cy="438.715" rx="26.9822" ry="27.7758" fill="#CDFE00" />
                                            <circle cx="233.466" cy="524.423" r="26.1886" fill="#CDFE00" />
                                            <circle cx="305.684" cy="460.142" r="20.6334" fill="#CDFE00" />
                                            <circle cx="303.303" cy="533.947" r="21.427" fill="#CDFE00" />
                                            <circle cx="162.043" cy="556.167" r="18.2527" fill="#CDFE00" />
                                            <circle cx="217.594" cy="591.085" r="19.8399" fill="#CDFE00" />
                                            <circle cx="278.701" cy="312.534" r="17.4591" fill="#CDFE00" />
                                            <circle cx="132.68" cy="369.673" r="17.4591" fill="#CDFE00" />
                                            <ellipse cx="177.121" cy="321.264" rx="19.0463" ry="19.8399" fill="#CDFE00" />
                                            <ellipse cx="231.086" cy="351.42" rx="20.6334" ry="21.427" fill="#CDFE00" />
                                            <circle cx="178.708" cy="477.601" r="20.6334" fill="#CDFE00" />
                                            <ellipse cx="189.025" cy="401.417" rx="23.0142" ry="23.8078" fill="#CDFE00" />
                                            <ellipse cx="239.022" cy="445.065" rx="22.2206" ry="23.0142" fill="#CDFE00" />
                                            <circle cx="228.705" cy="278.409" r="15.0783" fill="#CDFE00" />
                                            <ellipse cx="286.637" cy="392.686" rx="15.8719" ry="16.6655" fill="#CDFE00" />
                                            <ellipse cx="119.983" cy="506.964" rx="15.8719" ry="16.6655" fill="#CDFE00" />
                                            <ellipse cx="339.808" cy="276.028" rx="11.9039" ry="12.6975" fill="#CDFE00" />
                                            <circle cx="275.527" cy="582.356" r="12.6975" fill="#CDFE00" />
                                            <circle cx="323.143" cy="612.512" r="11.1103" fill="#CDFE00" />
                                            <circle cx="316.794" cy="666.477" r="9.52313" fill="#CDFE00" />
                                            <ellipse cx="266.003" cy="638.701" rx="14.2847" ry="15.0783" fill="#CDFE00" />

                                            {/* Texte "osmo" */}
                                            <path d="M493.783 578.382C463.423 578.382 437.618 567.894 416.367 546.919C395.115 525.943 384.49 500.138 384.49 469.503C384.49 438.868 395.115 413.062 416.367 392.087C437.618 371.112 463.423 360.624 493.783 360.624C524.418 360.624 550.223 371.112 571.198 392.087C592.45 413.062 603.076 438.868 603.076 469.503C603.076 500.138 592.45 525.943 571.198 546.919C550.223 567.894 524.418 578.382 493.783 578.382ZM447.83 516.284C460.25 528.703 475.567 534.913 493.783 534.913C511.998 534.913 527.316 528.703 539.735 516.284C552.155 503.864 558.365 488.27 558.365 469.503C558.365 450.735 552.155 435.142 539.735 422.722C527.316 410.302 511.998 404.093 493.783 404.093C475.567 404.093 460.25 410.302 447.83 422.722C435.41 435.142 429.2 450.735 429.2 469.503C429.2 488.27 435.41 503.864 447.83 516.284ZM679.618 423.136C679.618 430.036 683.344 435.556 690.796 439.696C698.524 443.56 707.769 447.009 718.533 450.045C729.573 452.805 740.613 456.117 751.652 459.981C762.692 463.845 771.938 470.469 779.39 479.853C787.117 488.96 790.981 500.552 790.981 514.628C790.981 534.499 783.253 550.093 767.798 561.408C752.618 572.724 733.437 578.382 710.253 578.382C689.83 578.382 672.304 574.104 657.677 565.548C643.049 556.992 632.424 545.125 625.8 529.945L664.301 507.59C671.476 527.461 686.794 537.397 710.253 537.397C733.713 537.397 745.442 529.669 745.442 514.214C745.442 507.59 741.579 502.208 733.851 498.068C726.399 493.928 717.153 490.478 706.114 487.718C695.35 484.682 684.448 481.233 673.408 477.369C662.369 473.505 652.985 467.157 645.257 458.325C637.805 449.217 634.079 437.764 634.079 423.964C634.079 404.921 641.255 389.603 655.607 378.011C670.234 366.42 688.312 360.624 709.839 360.624C726.951 360.624 742.131 364.488 755.378 372.216C768.902 379.667 779.252 390.155 786.427 403.679L748.754 424.792C741.579 409.06 728.607 401.195 709.839 401.195C701.284 401.195 694.108 403.127 688.312 406.991C682.516 410.578 679.618 415.96 679.618 423.136ZM1056.32 360.624C1079.78 360.624 1098.69 368.214 1113.04 383.393C1127.39 398.573 1134.57 418.996 1134.57 444.664V573H1089.86V447.561C1089.86 433.21 1086.27 422.17 1079.09 414.442C1071.92 406.439 1062.12 402.437 1049.7 402.437C1035.9 402.437 1024.86 406.991 1016.58 416.098C1008.58 425.206 1004.57 438.868 1004.57 457.083V573H959.863V447.561C959.863 433.21 956.413 422.17 949.513 414.442C942.889 406.439 933.367 402.437 920.948 402.437C907.424 402.437 896.384 407.129 887.829 416.512C879.273 425.62 874.995 439.144 874.995 457.083V573H830.284V366.006H874.995V390.845C888.243 370.698 907.976 360.624 934.195 360.624C960.691 360.624 980.286 371.526 992.982 393.329C1006.78 371.526 1027.89 360.624 1056.32 360.624ZM1280.12 578.382C1249.76 578.382 1223.95 567.894 1202.7 546.919C1181.45 525.943 1170.83 500.138 1170.83 469.503C1170.83 438.868 1181.45 413.062 1202.7 392.087C1223.95 371.112 1249.76 360.624 1280.12 360.624C1310.75 360.624 1336.56 371.112 1357.53 392.087C1378.79 413.062 1389.41 438.868 1389.41 469.503C1389.41 500.138 1378.79 525.943 1357.53 546.919C1336.56 567.894 1310.75 578.382 1280.12 578.382ZM1234.17 516.284C1246.59 528.703 1261.9 534.913 1280.12 534.913C1298.33 534.913 1313.65 528.703 1326.07 516.284C1338.49 503.864 1344.7 488.27 1344.7 469.503C1344.7 450.735 1338.49 435.142 1326.07 422.722C1313.65 410.302 1298.33 404.093 1280.12 404.093C1261.9 404.093 1246.59 410.302 1234.17 422.722C1221.75 435.142 1215.54 450.735 1215.54 469.503C1215.54 488.27 1221.75 503.864 1234.17 516.284Z"
                                                fill="#CDFE00" />
                                        </g>

                                        {/* Éléments en gris pour montrer la forme complète */}
                                        <g opacity="0.2">
                                            <circle cx="286.637" cy="249.046" r="19.0463" fill="white" />
                                            <ellipse cx="119.982" cy="438.715" rx="26.9822" ry="27.7758" fill="white" />
                                            <circle cx="233.466" cy="524.423" r="26.1886" fill="white" />
                                            <circle cx="305.684" cy="460.142" r="20.6334" fill="white" />
                                            <circle cx="303.303" cy="533.947" r="21.427" fill="white" />
                                            <circle cx="162.043" cy="556.167" r="18.2527" fill="white" />
                                            <circle cx="217.594" cy="591.085" r="19.8399" fill="white" />
                                            <circle cx="278.701" cy="312.534" r="17.4591" fill="white" />
                                            <circle cx="132.68" cy="369.673" r="17.4591" fill="white" />
                                            <ellipse cx="177.121" cy="321.264" rx="19.0463" ry="19.8399" fill="white" />
                                            <ellipse cx="231.086" cy="351.42" rx="20.6334" ry="21.427" fill="white" />
                                            <circle cx="178.708" cy="477.601" r="20.6334" fill="white" />
                                            <ellipse cx="189.025" cy="401.417" rx="23.0142" ry="23.8078" fill="white" />
                                            <ellipse cx="239.022" cy="445.065" rx="22.2206" ry="23.0142" fill="white" />
                                            <circle cx="228.705" cy="278.409" r="15.0783" fill="white" />
                                            <ellipse cx="286.637" cy="392.686" rx="15.8719" ry="16.6655" fill="white" />
                                            <ellipse cx="119.983" cy="506.964" rx="15.8719" ry="16.6655" fill="white" />
                                            <ellipse cx="339.808" cy="276.028" rx="11.9039" ry="12.6975" fill="white" />
                                            <circle cx="275.527" cy="582.356" r="12.6975" fill="white" />
                                            <circle cx="323.143" cy="612.512" r="11.1103" fill="white" />
                                            <circle cx="316.794" cy="666.477" r="9.52313" fill="white" />
                                            <ellipse cx="266.003" cy="638.701" rx="14.2847" ry="15.0783" fill="white" />

                                            {/* Texte "osmo" en gris */}
                                            <path d="M493.783 578.382C463.423 578.382 437.618 567.894 416.367 546.919C395.115 525.943 384.49 500.138 384.49 469.503C384.49 438.868 395.115 413.062 416.367 392.087C437.618 371.112 463.423 360.624 493.783 360.624C524.418 360.624 550.223 371.112 571.198 392.087C592.45 413.062 603.076 438.868 603.076 469.503C603.076 500.138 592.45 525.943 571.198 546.919C550.223 567.894 524.418 578.382 493.783 578.382ZM447.83 516.284C460.25 528.703 475.567 534.913 493.783 534.913C511.998 534.913 527.316 528.703 539.735 516.284C552.155 503.864 558.365 488.27 558.365 469.503C558.365 450.735 552.155 435.142 539.735 422.722C527.316 410.302 511.998 404.093 493.783 404.093C475.567 404.093 460.25 410.302 447.83 422.722C435.41 435.142 429.2 450.735 429.2 469.503C429.2 488.27 435.41 503.864 447.83 516.284ZM679.618 423.136C679.618 430.036 683.344 435.556 690.796 439.696C698.524 443.56 707.769 447.009 718.533 450.045C729.573 452.805 740.613 456.117 751.652 459.981C762.692 463.845 771.938 470.469 779.39 479.853C787.117 488.96 790.981 500.552 790.981 514.628C790.981 534.499 783.253 550.093 767.798 561.408C752.618 572.724 733.437 578.382 710.253 578.382C689.83 578.382 672.304 574.104 657.677 565.548C643.049 556.992 632.424 545.125 625.8 529.945L664.301 507.59C671.476 527.461 686.794 537.397 710.253 537.397C733.713 537.397 745.442 529.669 745.442 514.214C745.442 507.59 741.579 502.208 733.851 498.068C726.399 493.928 717.153 490.478 706.114 487.718C695.35 484.682 684.448 481.233 673.408 477.369C662.369 473.505 652.985 467.157 645.257 458.325C637.805 449.217 634.079 437.764 634.079 423.964C634.079 404.921 641.255 389.603 655.607 378.011C670.234 366.42 688.312 360.624 709.839 360.624C726.951 360.624 742.131 364.488 755.378 372.216C768.902 379.667 779.252 390.155 786.427 403.679L748.754 424.792C741.579 409.06 728.607 401.195 709.839 401.195C701.284 401.195 694.108 403.127 688.312 406.991C682.516 410.578 679.618 415.96 679.618 423.136ZM1056.32 360.624C1079.78 360.624 1098.69 368.214 1113.04 383.393C1127.39 398.573 1134.57 418.996 1134.57 444.664V573H1089.86V447.561C1089.86 433.21 1086.27 422.17 1079.09 414.442C1071.92 406.439 1062.12 402.437 1049.7 402.437C1035.9 402.437 1024.86 406.991 1016.58 416.098C1008.58 425.206 1004.57 438.868 1004.57 457.083V573H959.863V447.561C959.863 433.21 956.413 422.17 949.513 414.442C942.889 406.439 933.367 402.437 920.948 402.437C907.424 402.437 896.384 407.129 887.829 416.512C879.273 425.62 874.995 439.144 874.995 457.083V573H830.284V366.006H874.995V390.845C888.243 370.698 907.976 360.624 934.195 360.624C960.691 360.624 980.286 371.526 992.982 393.329C1006.78 371.526 1027.89 360.624 1056.32 360.624ZM1280.12 578.382C1249.76 578.382 1223.95 567.894 1202.7 546.919C1181.45 525.943 1170.83 500.138 1170.83 469.503C1170.83 438.868 1181.45 413.062 1202.7 392.087C1223.95 371.112 1249.76 360.624 1280.12 360.624C1310.75 360.624 1336.56 371.112 1357.53 392.087C1378.79 413.062 1389.41 438.868 1389.41 469.503C1389.41 500.138 1378.79 525.943 1357.53 546.919C1336.56 567.894 1310.75 578.382 1280.12 578.382ZM1234.17 516.284C1246.59 528.703 1261.9 534.913 1280.12 534.913C1298.33 534.913 1313.65 528.703 1326.07 516.284C1338.49 503.864 1344.7 488.27 1344.7 469.503C1344.7 450.735 1338.49 435.142 1326.07 422.722C1313.65 410.302 1298.33 404.093 1280.12 404.093C1261.9 404.093 1246.59 410.302 1234.17 422.722C1221.75 435.142 1215.54 450.735 1215.54 469.503C1215.54 488.27 1221.75 503.864 1234.17 516.284Z"
                                                fill="white" />
                                        </g>
                                    </svg>

                                    {/* Effet d'onde liquide */}
                                    <motion.div
                                        className="absolute bottom-0 left-0 right-0 h-2 bg-primary/40 rounded-full"
                                        animate={{
                                            scaleX: [1, 1.05, 1],
                                            opacity: [0.4, 0.7, 0.4],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                        style={{
                                            bottom: `calc(var(--liquid-height, 100%) - 5px)`
                                        }}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LiquidLoadingScreen;