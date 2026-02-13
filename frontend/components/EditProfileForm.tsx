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
        <div className="max-w-4xl mx-auto mt-8 space-y-6">
            {/* AI Code Generator */}
            <AiCodeGenerator onCodeGenerated={handleAiCodeGenerated} />

            {/* Edit Profile Form */}
            <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur p-8 rounded-lg shadow-lg flex flex-col gap-4">
                <h2 className="text-2xl font-bold mb-2">Edit Profile</h2>
                <label>Display Name</label>
                <input type="text" value={form.displayName} onChange={e => setForm(f => ({ ...f, displayName: e.target.value }))} className="input" />
                <label>Bio</label>
                <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} className="input" />
                <label>Avatar URL</label>
                <input type="text" value={form.avatarUrl} onChange={e => setForm(f => ({ ...f, avatarUrl: e.target.value }))} className="input" />
                <label>Custom HTML</label>
                <textarea value={form.customHtml} onChange={e => setForm(f => ({ ...f, customHtml: e.target.value }))} className="input font-mono" rows={4} />
                <label>Custom CSS</label>
                <textarea value={form.customCss} onChange={e => setForm(f => ({ ...f, customCss: e.target.value }))} className="input font-mono" rows={4} />
                {form.error && <div className="text-red-500">{form.error}</div>}
                {form.success && <div className="text-green-600">Profile updated!</div>}
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded" disabled={form.loading}>
                    {form.loading ? "Saving..." : "Save Changes"}
                </button>
            </form>
        </div>
    );
}
