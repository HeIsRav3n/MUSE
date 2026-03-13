"use client";

import { useState } from "react";
import { Bell, Check } from "lucide-react";
import { Dropdown } from "@/components/ui/Dropdown";

interface Notification {
    id: string;
    type: "friend" | "token" | "artist" | "bond" | "system";
    title: string;
    message: string;
    time: string;
    read: boolean;
}

const mockNotifs: Notification[] = [
    { id: "1", type: "artist", title: "Women's Initiatives 🔥", message: "Producer Pauline Herr just matched with a new Mentorship Collab!", time: "2m ago", read: false },
    { id: "2", type: "token", title: "$AUDIO Staking Impact", message: "Your $AUDIO grant successfully funded the 'Independent Touring Fund'.", time: "15m ago", read: false },
    { id: "3", type: "system", title: "Her Story Podcast", message: "New episode: 'Web3 Engineering For Artists' is now broadcasting live.", time: "1h ago", read: true },
    { id: "4", type: "system", title: "Wellness Audio Set", message: "Your weekly 'Reset Sound Bath' has been loaded to your queue.", time: "2h ago", read: true },
    { id: "5", type: "friend", title: "New Connection", message: "Engineer Luna Wave accepted your Mentorship Collab request.", time: "5h ago", read: true },
];

const typeColors: Record<string, string> = {
    friend: "bg-cyan-500",
    token: "bg-green-500",
    artist: "bg-purple-500",
    bond: "bg-orange-500",
    system: "bg-pink-500",
};

export function NotificationCenter() {
    const [notifications, setNotifications] = useState(mockNotifs);

    const unreadCount = notifications.filter((n) => !n.read).length;

    const markAsRead = (id: string) => {
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    };

    const markAllAsRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    return (
        <Dropdown
            trigger={
                <button className="relative p-2.5 rounded-xl glass hover:bg-white/5 transition-all">
                    <Bell className="w-5 h-5 text-muse-text-dim" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-[9px] flex items-center justify-center text-white font-bold">
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                    )}
                </button>
            }
            position="bottom-right"
            offset={8}
            closeOnClick={false}
            menuClassName="w-80 overflow-hidden"
        >
            {/* Header */}
            <div className="p-3 border-b border-muse-border/50 flex justify-between items-center">
                <h3 className="text-sm font-semibold text-muse-text">Notifications</h3>
                {unreadCount > 0 && (
                    <button
                        onClick={markAllAsRead}
                        className="text-[10px] text-muse-primary hover:text-muse-primary-light flex items-center gap-1"
                    >
                        <Check className="w-3 h-3" /> Mark all read
                    </button>
                )}
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto custom-scrollbar">
                {notifications.map((n) => (
                    <button
                        key={n.id}
                        onClick={() => markAsRead(n.id)}
                        className={`w-full text-left p-3 border-b border-muse-border/30 hover:bg-white/5 transition-all ${!n.read ? "bg-muse-primary/5" : ""}`}
                    >
                        <div className="flex gap-2.5">
                            <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${typeColors[n.type]}`} />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                    <p className="text-xs font-semibold text-muse-text truncate">{n.title}</p>
                                    <span className="text-[10px] text-muse-text-muted whitespace-nowrap">{n.time}</span>
                                </div>
                                <p className="text-[11px] text-muse-text-dim mt-0.5 line-clamp-2">{n.message}</p>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </Dropdown>
    );
}
