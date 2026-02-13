"use client";

import LoginForm from "../../../components/auth/LoginForm";
import { useAuth } from "../../../context/AuthContext";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
    const { user } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get('redirect') || '/';
    
    useEffect(() => {
        if (user) router.replace(redirect);
    }, [user, router, redirect]);
    if (user) return null;
    return (
        <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-gray-700">
            <LoginForm redirectUrl={redirect} />
        </main>
    );
}
