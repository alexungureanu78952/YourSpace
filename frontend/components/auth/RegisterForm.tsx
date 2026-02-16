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
            if (!res.ok) throw new Error(data.message || "Registration failed");
            login(data.token, data.user);
            window.location.href = "/";
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
                borderColor: '#00ffff',
                boxShadow: '0 0 30px rgba(0, 255, 255, 0.4), inset 0 0 20px rgba(0, 255, 255, 0.05)',
            }}>
            <div className="text-center mb-4">
                <h2 className="y2k-heading y2k-heading-md" style={{ marginBottom: 0, color: '#00ffff' }}>
                    SIGN UP
                </h2>
                <div style={{
                    height: '2px',
                    background: 'linear-gradient(90deg, transparent, #00ffff, transparent)',
                    marginTop: '10px',
                }}></div>
            </div>

            <input
                type="text"
                placeholder="Username"
                className="y2k-input w-full"
                value={state.username}
                onChange={(e) => setState((s) => ({ ...s, username: e.target.value }))}
                required
            />

            <input
                type="email"
                placeholder="Email"
                className="y2k-input w-full"
                value={state.email}
                onChange={(e) => setState((s) => ({ ...s, email: e.target.value }))}
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

            {state.success && (
                <div className="p-3 border-2 border-green-500 text-green-400 font-bold text-center"
                     style={{
                         background: 'rgba(57, 255, 20, 0.1)',
                         boxShadow: '0 0 10px rgba(57, 255, 20, 0.4)',
                     }}>
                    {state.success}
                </div>
            )}

            <button
                type="submit"
                className="y2k-button-secondary w-full py-3"
                disabled={state.loading}
            >
                {state.loading ? "Creating Account..." : "Sign Up"}
            </button>

            <div style={{
                textAlign: 'center',
                color: '#888888',
                fontSize: '0.9rem',
                paddingTop: '10px',
                borderTop: '1px solid #0d3b1a',
            }}>
                Already have an account?{' '}
                <a href="/auth/login" style={{
                    color: '#39ff14',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    textShadow: '0 0 5px rgba(57, 255, 20, 0.6)',
                }}>
                    Login here
                </a>
            </div>
        </form>
    );
}
