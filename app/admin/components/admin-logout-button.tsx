"use client";

import { LogOut } from "lucide-react";

export function AdminLogoutButton() {
    const handleLogout = () => {
        // Redirect to logout API which returns 401
        window.location.href = "/api/auth/logout";
    };

    return (
        <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition"
        >
            <LogOut size={20} />
            Sign Out
        </button>
    );
}
