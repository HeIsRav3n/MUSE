"use client";

import React from 'react';
import { motion } from 'framer-motion';

export function WalletBalanceChart() {
  // Mock path for the chart line
  const points = "0,150 50,120 100,140 150,80 200,100 250,40 300,60 350,20 400,50 450,10 500,40 550,20 600,0";
  
  return (
    <div className="h-[240px] w-full mt-6 relative overflow-hidden rounded-2xl group">
      {/* Background Grid */}
      <div className="absolute inset-0 grid grid-rows-4 gap-0 opacity-20 pointer-events-none">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="border-t border-white/10 w-full h-full" />
        ))}
      </div>
      
      {/* Chart SVG */}
      <svg 
        viewBox="0 0 600 200" 
        className="w-full h-full preserve-3d"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e024c3" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#e024c3" stopOpacity="0" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Fill Area */}
        <motion.path
          d={`M ${points} V 200 H 0 Z`}
          fill="url(#chartGradient)"
          initial={{ opacity: 0, pathLength: 0 }}
          animate={{ opacity: 1, pathLength: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
        />

        {/* Line */}
        <motion.path
          d={`M ${points}`}
          fill="none"
          stroke="#e024c3"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glow)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />

        {/* Points/Dots */}
        {points.split(' ').map((p, i) => {
          const [x, y] = p.split(',');
          return (
            <motion.circle
              key={i}
              cx={x}
              cy={y}
              r="4"
              fill="#fff"
              stroke="#e024c3"
              strokeWidth="2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.5 + (i * 0.05), duration: 0.3 }}
              className="hover:r-6 transition-all"
            />
          );
        })}
      </svg>

      {/* Floating Info Labels */}
      <div className="absolute top-4 left-4 flex gap-4">
        <div className="glass px-3 py-1 rounded-full border border-white/10">
          <span className="text-[10px] text-muse-text-dim uppercase tracking-widest font-bold">Peak: $12.4k</span>
        </div>
        <div className="glass px-3 py-1 rounded-full border border-white/10">
          <span className="text-[10px] text-muse-success uppercase tracking-widest font-bold">+18.5% Week</span>
        </div>
      </div>

      {/* X-Axis Labels */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 py-1 text-[9px] text-muse-text-muted font-bold tracking-tighter uppercase opacity-60">
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
        <span>Sun</span>
      </div>
      
      {/* Decorative Glow */}
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-muse-primary/20 blur-[60px] rounded-full group-hover:bg-muse-primary/30 transition-colors" />
    </div>
  );
}
