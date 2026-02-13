"use client";
import { useAuth } from "../../context/AuthContext";

export default function UserMenu() {
    const { user, logout } = useAuth();

    if (!user) return null;

    return (
        <div className="flex items-center gap-4">
            <span className="text-white font-semibold">Hello, {user.displayName || user.username}!</span>
            <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
            >
                Logout
            </button>
        </div>
    );
}
