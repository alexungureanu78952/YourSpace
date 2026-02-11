"use client";
import Link from "next/link";
import UserMenu from "./auth/UserMenu";

export default function Navbar() {
    return (
        <nav className="w-full flex items-center justify-between px-8 py-4 bg-gray-900/80 backdrop-blur-md shadow">
            <div className="flex items-center gap-4">
                <Link href="/" className="text-2xl font-bold text-white">YourSpace</Link>
                <Link href="/feed" className="text-white/80 hover:text-white">Feed</Link>
                <Link href="/profiles" className="text-white/80 hover:text-white">Profiluri</Link>
            </div>
            <div>
                <UserMenu />
            </div>
        </nav>
    );
}
