"use client";

import API_BASE_URL from "../config/api";
import React, { useState } from "react";
import AiCodeGenerator from "./AiCodeGenerator";

interface EditProfileFormProps {
    user: {
        id: number;
        displayName: string;
        profile?: {
            displayName?: string;
            bio?: string;
            avatarUrl?: string;
            customHtml?: string;
            customCss?: string;
        };
    };
}

export default function EditProfileForm({ user }: EditProfileFormProps) {
    const [form, setForm] = useState({
        displayName: user.profile?.displayName || user.displayName || "",
        bio: user.profile?.bio || "",
        avatarUrl: user.profile?.avatarUrl || "",
        customHtml: user.profile?.customHtml || "",
        customCss: user.profile?.customCss || "",
        error: "",
        loading: false,
        success: false,
    });

    const handleAiCodeGenerated = (html: string, css: string) => {
        setForm(f => ({
            ...f,
            customHtml: html || f.customHtml,
            customCss: css || f.customCss
        }));
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setForm(f => ({ ...f, loading: true, error: "", success: false }));
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Not authenticated');
            }
            const res = await fetch(`${API_BASE_URL}/api/profiles/edit`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                credentials: "include",
                body: JSON.stringify({
                    avatarUrl: form.avatarUrl,
                    html: form.customHtml,
                    css: form.customCss,
                    displayName: form.displayName,
                    bio: form.bio
                }),
            });
            const text = await res.text();
            let data;
            try {
                data = text ? JSON.parse(text) : {};
            } catch {
                data = {};
            }
            console.log("Response status:", res.status);
            console.log("Response data:", data);
            if (!res.ok) throw new Error(data.message || `Update failed (${res.status})`);
            setForm(f => ({ ...f, loading: false, success: true }));
        } catch (err: any) {
            setForm(f => ({ ...f, loading: false, error: err.message }));
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* AI Code Generator */}
            <AiCodeGenerator onCodeGenerated={handleAiCodeGenerated} />

            {/* Edit Profile Form */}
            <form onSubmit={handleSubmit} className="y2k-card flex flex-col gap-6"
                  style={{
                      background: 'rgba(26, 26, 26, 0.9)',
                      borderColor: '#39ff14',
                  }}>
                <div className="mb-4 pb-4 border-b" style={{ borderColor: '#1a4d2e' }}>
                    <h2 className="y2k-heading y2k-heading-md" style={{ marginBottom: 0 }}>
                        EDIT PROFILE
                    </h2>
                </div>

                <div>
                    <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        color: '#39ff14',
                        fontWeight: 'bold',
                        textShadow: '0 0 5px rgba(57, 255, 20, 0.6)',
                    }}>
                        DISPLAY NAME
                    </label>
                    <input
                        type="text"
                        value={form.displayName}
                        onChange={e => setForm(f => ({ ...f, displayName: e.target.value }))}
                        className="y2k-input w-full"
                        style={{ borderColor: '#39ff14' }}
                    />
                </div>

                <div>
                    <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        color: '#39ff14',
                        fontWeight: 'bold',
                        textShadow: '0 0 5px rgba(57, 255, 20, 0.6)',
                    }}>
                        BIO
                    </label>
                    <textarea
                        value={form.bio}
                        onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                        className="y2k-input w-full"
                        rows={3}
                        style={{ borderColor: '#39ff14' }}
                    />
                </div>

                <div>
                    <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        color: '#39ff14',
                        fontWeight: 'bold',
                        textShadow: '0 0 5px rgba(57, 255, 20, 0.6)',
                    }}>
                        AVATAR URL
                    </label>
                    <input
                        type="text"
                        value={form.avatarUrl}
                        onChange={e => setForm(f => ({ ...f, avatarUrl: e.target.value }))}
                        className="y2k-input w-full"
                        style={{ borderColor: '#39ff14' }}
                    />
                </div>

                <div>
                    <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        color: '#00ffff',
                        fontWeight: 'bold',
                        textShadow: '0 0 5px rgba(0, 255, 255, 0.6)',
                    }}>
                        CUSTOM HTML
                    </label>
                    <textarea
                        value={form.customHtml}
                        onChange={e => setForm(f => ({ ...f, customHtml: e.target.value }))}
                        className="y2k-input w-full font-mono"
                        rows={6}
                        style={{ borderColor: '#00ffff' }}
                    />
                </div>

                <div>
                    <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        color: '#00ffff',
                        fontWeight: 'bold',
                        textShadow: '0 0 5px rgba(0, 255, 255, 0.6)',
                    }}>
                        CUSTOM CSS
                    </label>
                    <textarea
                        value={form.customCss}
                        onChange={e => setForm(f => ({ ...f, customCss: e.target.value }))}
                        className="y2k-input w-full font-mono"
                        rows={6}
                        style={{ borderColor: '#00ffff' }}
                    />
                </div>

                {form.error && (
                    <div className="p-3 border-2 border-red-500 font-bold text-center"
                         style={{
                             background: 'rgba(255, 0, 0, 0.1)',
                             color: '#ff0000',
                             textShadow: '0 0 5px rgba(255, 0, 0, 0.6)',
                         }}>
                        {form.error}
                    </div>
                )}

                {form.success && (
                    <div className="p-3 border-2 border-green-500 font-bold text-center"
                         style={{
                             background: 'rgba(57, 255, 20, 0.1)',
                             color: '#39ff14',
                             textShadow: '0 0 5px rgba(57, 255, 20, 0.6)',
                         }}>
                        PROFILE UPDATED! ✓
                    </div>
                )}

                <button
                    type="submit"
                    className="y2k-button w-full py-3"
                    disabled={form.loading}
                    style={{
                        opacity: form.loading ? 0.5 : 1,
                        cursor: form.loading ? 'not-allowed' : 'pointer',
                    }}
                >
                    {form.loading ? "SAVING..." : "SAVE CHANGES"}
                </button>
            </form>
        </div>
    );
}
