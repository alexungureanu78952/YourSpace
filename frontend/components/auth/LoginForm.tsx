"use client";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import API_BASE_URL from "../../config/api";

interface LoginFormState {
    usernameOrEmail: string;
    password: string;
    error?: string;
    loading: boolean;
}

export default function LoginForm() {
    const [state, setState] = useState<LoginFormState>({
        usernameOrEmail: "",
        password: "",
        loading: false,
    });
    const { login } = useAuth();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setState((s) => ({ ...s, loading: true, error: undefined }));
        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    usernameOrEmail: state.usernameOrEmail,
                    password: state.password,
                }),
                credentials: "include", // permite browserului să accepte cookie-ul JWT
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Login failed");
            login(data.token, data.user);
            window.location.href = "/";
        } catch (err: any) {
            setState((s) => ({ ...s, error: err.message, loading: false }));
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white/10 backdrop-blur-md p-8 rounded-lg shadow-lg w-96 flex flex-col gap-4"
        >
            <h2 className="text-2xl font-bold text-white mb-2">Login</h2>
            <input
                type="text"
                placeholder="Username sau Email"
                className="p-2 rounded border border-gray-400"
                value={state.usernameOrEmail}
                onChange={(e) => setState((s) => ({ ...s, usernameOrEmail: e.target.value }))}
                required
            />
            <input
                type="password"
                placeholder="Parolă"
                className="p-2 rounded border border-gray-400"
                value={state.password}
                onChange={(e) => setState((s) => ({ ...s, password: e.target.value }))}
                required
            />
            {state.error && <div className="text-red-400 text-sm">{state.error}</div>}
            <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded mt-2 disabled:opacity-60"
                disabled={state.loading}
            >
                {state.loading ? "Se autentifică..." : "Login"}
            </button>
            <div className="text-sm text-gray-200 mt-2">
                Nu ai cont? <a href="/auth/register" className="underline">Înregistrează-te</a>
            </div>
        </form>
    );
}
