"use client";
import { useState, useRef, ReactNode, MouseEvent } from 'react';

export default function TiltCard({ children, className = "" }: { children: ReactNode, className?: string }) {
  const [style, setStyle] = useState({});
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 20; 
    const y = -(e.clientY - top - height / 2) / 20;
    
    setStyle({
      transform: `perspective(1000px) rotateX(${y}deg) rotateY(${x}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: 'none',
      boxShadow: `${-x}px ${y}px 25px rgba(74, 222, 128, 0.3)`
    });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
      transition: 'transform 0.5s ease, box-shadow 0.5s ease',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)'
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={style}
      className={`transition-all duration-300 ease-out will-change-transform ${className}`}
    >
      {children}
    </div>
  );
}