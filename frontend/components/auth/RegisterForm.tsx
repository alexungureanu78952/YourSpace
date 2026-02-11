"use client";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import API_BASE_URL from "../../config/api";

interface RegisterFormState {
    username: string;
    email: string;
    password: string;
    error?: string;
    success?: string;
    loading: boolean;
}

export default function RegisterForm() {
    const [state, setState] = useState<RegisterFormState>({
        username: "",
        email: "",
        password: "",
        loading: false,
    });
    const { login } = useAuth();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setState((s) => ({ ...s, loading: true, error: undefined, success: undefined }));
        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: state.username,
                    email: state.email,
                    password: state.password,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Înregistrare eșuată");
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
            <h2 className="text-2xl font-bold text-white mb-2">Înregistrare</h2>
            <input
                type="text"
                placeholder="Username"
                className="p-2 rounded border border-gray-400"
                value={state.username}
                onChange={(e) => setState((s) => ({ ...s, username: e.target.value }))}
                required
            />
            <input
                type="email"
                placeholder="Email"
                className="p-2 rounded border border-gray-400"
                value={state.email}
                onChange={(e) => setState((s) => ({ ...s, email: e.target.value }))}
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
            {state.success && <div className="text-green-400 text-sm">{state.success}</div>}
            <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded mt-2 disabled:opacity-60"
                disabled={state.loading}
            >
                {state.loading ? "Se înregistrează..." : "Înregistrează-te"}
            </button>
            <div className="text-sm text-gray-200 mt-2">
                Ai deja cont? <a href="/auth/login" className="underline">Login</a>
            </div>
        </form>
    );
}
