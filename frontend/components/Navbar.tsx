"use client";
import Link from "next/link";

import { useAuth } from "../context/AuthContext";
import UserMenu from "./auth/UserMenu";

export default function Navbar() {
    const { user } = useAuth();
    return (
        <nav className="w-full flex items-center justify-between px-8 py-4 bg-gray-900/80 backdrop-blur-md shadow">
            <div className="flex items-center gap-4">
                <Link href="/" className="text-2xl font-bold text-white">YourSpace</Link>
                <Link href="/feed" className="text-white/80 hover:text-white">Feed</Link>
                <Link href="/profiles" className="text-white/80 hover:text-white">Profiluri</Link>
            </div>
            <div className="flex items-center gap-4">
                {!user && (
                    <>
                        <Link href="/auth/login" className="text-white/80 hover:text-white">Login</Link>
                        <Link href="/auth/register" className="text-white/80 hover:text-white">Register</Link>
                    </>
                )}
                {user && (
                    <>
                        <Link
                            href="/profile"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                            aria-label="Profilul meu"
                        >
                            Profilul meu
                        </Link>
                        <UserMenu />
                    </>
                )}
            </div>
        </nav>
    );
}
