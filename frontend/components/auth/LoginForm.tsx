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

interface LoginFormProps {
    redirectUrl?: string;
}

export default function LoginForm({ redirectUrl = '/' }: LoginFormProps) {
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
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Login failed");
            login(data.token, data.user);
            window.location.href = redirectUrl;
        } catch (err: any) {
            setState((s) => ({ ...s, error: err.message, loading: false }));
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="y2k-card w-96 flex flex-col gap-6"
            style={{
                background: 'rgba(26, 26, 26, 0.9)',
                borderColor: '#39ff14',
                boxShadow: '0 0 30px rgba(57, 255, 20, 0.4), inset 0 0 20px rgba(57, 255, 20, 0.05)',
            }}>
            <div className="text-center mb-4">
                <h2 className="y2k-heading y2k-heading-md" style={{ marginBottom: 0 }}>
                    LOGIN
                </h2>
                <div style={{
                    height: '2px',
                    background: 'linear-gradient(90deg, transparent, #39ff14, transparent)',
                    marginTop: '10px',
                }}></div>
            </div>

            <input
                type="text"
                placeholder="Username or Email"
                className="y2k-input w-full"
                value={state.usernameOrEmail}
                onChange={(e) => setState((s) => ({ ...s, usernameOrEmail: e.target.value }))}
                required
            />

            <input
                type="password"
                placeholder="Password"
                className="y2k-input w-full"
                value={state.password}
                onChange={(e) => setState((s) => ({ ...s, password: e.target.value }))}
                required
            />

            {state.error && (
                <div className="p-3 border-2 border-red-500 text-red-400 font-bold text-center"
                     style={{
                         background: 'rgba(255, 0, 0, 0.1)',
                         boxShadow: '0 0 10px rgba(255, 0, 0, 0.4)',
                     }}>
                    {state.error}
                </div>
            )}

            <button
                type="submit"
                className="y2k-button w-full py-3"
                disabled={state.loading}
            >
                {state.loading ? "Logging in..." : "Login"}
            </button>

            <div style={{
                textAlign: 'center',
                color: '#888888',
                fontSize: '0.9rem',
                paddingTop: '10px',
                borderTop: '1px solid #0d3b1a',
            }}>
                Don't have an account?{' '}
                <a href="/auth/register" style={{
                    color: '#00ffff',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    textShadow: '0 0 5px rgba(0, 255, 255, 0.6)',
                }}>
                    Sign up here
                </a>
            </div>
        </form>
    );
}
