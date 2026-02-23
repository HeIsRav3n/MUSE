"use client";

import React from "react";

interface SectionProps {
    title: string;
    icon: React.ElementType; // or specific LucideIcon type
    danger?: boolean;
    children: React.ReactNode;
}

export function Section({ title, icon: Icon, danger, children }: SectionProps) {
    return (
        <div className={`glass rounded-2xl overflow-hidden ${danger ? "border-red-500/20" : ""}`}>
            <div className={`flex items-center gap-2.5 px-5 py-4 border-b ${danger ? "border-red-500/10" : "border-sonara-border/30"}`}>
                <Icon className={`w-4 h-4 ${danger ? "text-red-400" : "text-sonara-primary"}`} />
                <h3 className={`text-sm font-semibold tracking-wide uppercase ${danger ? "text-red-400" : "text-sonara-text"}`}>{title}</h3>
            </div>
            <div className="divide-y divide-sonara-border/20 bg-sonara-card/30">{children}</div>
        </div>
    );
}
