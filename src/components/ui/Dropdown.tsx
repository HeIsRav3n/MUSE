"use client";

import { useEffect, useRef, useState, useCallback, type ReactNode } from "react";
import { createPortal } from "react-dom";

/* ─── Dropdown Root ─── */
interface DropdownProps {
    trigger: ReactNode;
    children: ReactNode;
    position?: "bottom-left" | "bottom-right" | "top-left" | "top-right";
    offset?: number;
    closeOnClick?: boolean;
    closeOnEsc?: boolean;
    menuClassName?: string;
    onOpen?: () => void;
    onClose?: () => void;
}

export function Dropdown({
    trigger,
    children,
    position = "bottom-right",
    offset = 8,
    closeOnClick = true,
    closeOnEsc = true,
    menuClassName = "",
    onOpen,
    onClose,
}: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [coords, setCoords] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
    const [mounted, setMounted] = useState(false);
    const triggerRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const rafRef = useRef<number>(0);

    // SSR guard
    useEffect(() => setMounted(true), []);

    const updatePosition = useCallback(() => {
        if (!triggerRef.current) return;
        const r = triggerRef.current.getBoundingClientRect();
        const mw = menuRef.current?.offsetWidth || 220;
        const mh = menuRef.current?.offsetHeight || 0;

        let top = 0, left = 0;
        switch (position) {
            case "bottom-left": top = r.bottom + offset; left = r.left; break;
            case "bottom-right": top = r.bottom + offset; left = r.right - mw; break;
            case "top-left": top = r.top - mh - offset; left = r.left; break;
            case "top-right": top = r.top - mh - offset; left = r.right - mw; break;
        }

        // Clamp to viewport
        const vw = window.innerWidth, vh = window.innerHeight;
        if (left + mw > vw - 12) left = vw - mw - 12;
        if (left < 12) left = 12;
        if (top + mh > vh - 12) top = vh - mh - 12;
        if (top < 12) top = 12;

        setCoords({ top, left });
    }, [position, offset]);

    // Reposition on scroll / resize
    useEffect(() => {
        if (!isOpen) return;
        const update = () => { cancelAnimationFrame(rafRef.current); rafRef.current = requestAnimationFrame(updatePosition); };
        window.addEventListener("scroll", update, true);
        window.addEventListener("resize", update);
        return () => {
            window.removeEventListener("scroll", update, true);
            window.removeEventListener("resize", update);
            cancelAnimationFrame(rafRef.current);
        };
    }, [isOpen, updatePosition]);

    // Position on open
    useEffect(() => {
        if (isOpen) { updatePosition(); onOpen?.(); } else { onClose?.(); }
    }, [isOpen, updatePosition, onOpen, onClose]);

    // Outside click
    useEffect(() => {
        if (!isOpen) return;
        const handler = (e: MouseEvent) => {
            if (triggerRef.current?.contains(e.target as Node) || menuRef.current?.contains(e.target as Node)) return;
            setIsOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [isOpen]);

    // ESC key
    useEffect(() => {
        if (!closeOnEsc || !isOpen) return;
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setIsOpen(false); };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [isOpen, closeOnEsc]);

    return (
        <>
            <div ref={triggerRef} onClick={() => setIsOpen(!isOpen)} className="inline-block cursor-pointer" aria-haspopup="true" aria-expanded={isOpen}>
                {trigger}
            </div>

            {mounted && isOpen && createPortal(
                <div
                    ref={menuRef}
                    className={`fixed z-[100] glass-strong rounded-xl border border-muse-border/50 shadow-2xl py-1 animate-slide-up ${menuClassName}`}
                    style={{ top: coords.top, left: coords.left }}
                    onClick={closeOnClick ? () => setIsOpen(false) : undefined}
                    role="menu"
                >
                    {children}
                </div>,
                document.body,
            )}
        </>
    );
}

/* ─── Dropdown Item ─── */
interface DropdownItemProps {
    children: ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    icon?: ReactNode;
    className?: string;
    preventClose?: boolean;
}

export function DropdownItem({ children, onClick, disabled = false, icon, className = "", preventClose = false }: DropdownItemProps) {
    return (
        <button
            onClick={(e) => {
                if (preventClose) e.stopPropagation();
                onClick?.();
            }}
            disabled={disabled}
            className={`w-full px-3 py-2 flex items-center gap-2.5 text-left text-sm transition-colors hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
            role="menuitem"
        >
            {icon && <span className="w-4 h-4 text-muse-text-dim flex-shrink-0">{icon}</span>}
            <span className="flex-1 text-muse-text">{children}</span>
        </button>
    );
}

/* ─── Dropdown Divider ─── */
export function DropdownDivider() {
    return <div className="my-1 border-t border-muse-border/50" />;
}

/* ─── Dropdown Header ─── */
export function DropdownHeader({ children }: { children: ReactNode }) {
    return (
        <div className="px-3 py-1.5 text-[10px] font-semibold text-muse-text-muted uppercase tracking-wider">
            {children}
        </div>
    );
}
