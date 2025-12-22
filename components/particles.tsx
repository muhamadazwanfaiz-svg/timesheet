"use client";

import { useEffect, useState } from "react";

export function Particles() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    // Generate some random particles
    const particles = Array.from({ length: 15 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: `${Math.random() * 5}s`,
        duration: `${10 + Math.random() * 10}s`,
        size: `${4 + Math.random() * 8}px`,
    }));

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {particles.map((p) => (
                <div
                    key={p.id}
                    className="absolute rounded-full bg-indigo-400/20 dark:bg-indigo-500/20 blur-[1px]"
                    style={{
                        left: p.left,
                        top: p.top,
                        width: p.size,
                        height: p.size,
                        animation: `particle-fade ${p.duration} infinite ease-in-out`,
                        animationDelay: p.delay,
                    }}
                />
            ))}
        </div>
    );
}
