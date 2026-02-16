"use client";

import React, { useState } from 'react';
import API_BASE_URL from '../config/api';

interface AiCodeGeneratorProps {
    onCodeGenerated: (html: string, css: string) => void;
}

export default function AiCodeGenerator({ onCodeGenerated }: AiCodeGeneratorProps) {
    const [prompt, setPrompt] = useState('');
    const [type, setType] = useState<'both' | 'html' | 'css'>('both');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState<{ code: string; message: string } | null>(null);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError('Please enter a description');
            return;
        }

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('[AiCodeGenerator] No token found');
                setError('You must be logged in to use AI Assistant');
                setLoading(false);
                return;
            }

            console.log('[AiCodeGenerator] Sending request to:', `${API_BASE_URL}/api/ai/generate-profile-code`);
            console.log('[AiCodeGenerator] Request body:', { prompt, type });

            const response = await fetch(`${API_BASE_URL}/api/ai/generate-profile-code`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ prompt, type })
            });

            console.log('[AiCodeGenerator] Response status:', response.status);
            console.log('[AiCodeGenerator] Response headers:', Object.fromEntries(response.headers.entries()));

            if (!response.ok) {
                const errorText = await response.text();
                console.error('[AiCodeGenerator] Error response text:', errorText);

                let errorData;
                try {
                    errorData = JSON.parse(errorText);
                } catch {
                    errorData = { message: errorText || 'Failed to generate code' };
                }

                console.error('[AiCodeGenerator] Error data:', errorData);
                throw new Error(errorData.message || `Error: ${response.status}`);
            }

            const data = await response.json();
            let code = '';
            if (type === 'html') {
                code = data.html || '';
            } else if (type === 'css') {
                code = data.css || '';
            } else if (type === 'both') {
                code = (data.html ? data.html : '') + (data.css ? '\n\n' + data.css : '');
            }
            setResult({ code, message: data.message });
        } catch (err: any) {
            console.error('[AiCodeGenerator] Exception caught:', err);
            console.error('[AiCodeGenerator] Error stack:', err.stack);
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleApply = () => {
        if (result) {
            // No longer auto-apply, just clear prompt and result
            setResult(null);
            setPrompt('');
        }
    };

    return (
        <div className="y2k-card mb-6" style={{
            background: 'rgba(26, 26, 26, 0.9)',
            borderColor: '#ff00ff',
            boxShadow: '0 0 30px rgba(255, 0, 255, 0.3), inset 0 0 20px rgba(255, 0, 255, 0.05)',
        }}>
            <div className="mb-4">
                <h3 className="y2k-heading y2k-heading-md" style={{
                    color: '#ff00ff',
                    textShadow: '0 0 5px rgba(255, 0, 255, 0.6)',
                    marginBottom: 0,
                }}>
                    AI PROFILE ASSISTANT
                </h3>
                <div style={{
                    height: '2px',
                    background: 'linear-gradient(90deg, transparent, #ff00ff, transparent)',
                    marginTop: '10px',
                }}></div>
            </div>

            <p style={{
                color: '#888888',
                fontSize: '0.95rem',
                marginBottom: '20px',
            }}>
                Describe your profile design and select what code you want AI to generate. Copy the result below into your custom HTML or CSS boxes.
            </p>

            <div className="space-y-4">
                <div>
                    <label className="y2k-heading" style={{
                        color: '#39ff14',
                        fontSize: '0.9rem',
                        textShadow: '0 0 3px rgba(57, 255, 20, 0.5)',
                        marginBottom: '8px',
                        display: 'block',
                    }}>
                        WHAT DO YOU WANT TO CREATE?
                    </label>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g., Create a retro MySpace profile with pink gradient background and sparkles"
                        className="y2k-input w-full"
                        rows={3}
                        style={{
                            borderColor: '#39ff14',
                        }}
                    />
                </div>

                <div>
                    <label className="y2k-heading" style={{
                        color: '#00ffff',
                        fontSize: '0.9rem',
                        textShadow: '0 0 3px rgba(0, 255, 255, 0.5)',
                        marginBottom: '8px',
                        display: 'block',
                    }}>
                        GENERATE:
                    </label>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => setType('both')}
                            className="y2k-button"
                            style={{
                                background: type === 'both' ? '#39ff14' : 'rgba(13, 59, 26, 0.5)',
                                color: type === 'both' ? '#000000' : '#39ff14',
                                borderColor: '#39ff14',
                                flex: 1,
                            }}
                        >
                            BOTH
                        </button>
                        <button
                            type="button"
                            onClick={() => setType('html')}
                            className="y2k-button"
                            style={{
                                background: type === 'html' ? '#00ffff' : 'rgba(13, 59, 26, 0.5)',
                                color: type === 'html' ? '#000000' : '#00ffff',
                                borderColor: '#00ffff',
                                flex: 1,
                            }}
                        >
                            HTML
                        </button>
                        <button
                            type="button"
                            onClick={() => setType('css')}
                            className="y2k-button"
                            style={{
                                background: type === 'css' ? '#ff00ff' : 'rgba(13, 59, 26, 0.5)',
                                color: type === 'css' ? '#000000' : '#ff00ff',
                                borderColor: '#ff00ff',
                                flex: 1,
                            }}
                        >
                            CSS
                        </button>
                    </div>
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={loading || !prompt.trim()}
                    className="y2k-button w-full py-3"
                    style={{
                        opacity: loading || !prompt.trim() ? 0.5 : 1,
                        cursor: loading || !prompt.trim() ? 'not-allowed' : 'pointer',
                    }}
                >
                    {loading ? (
                        <>GENERATING...</>
                    ) : (
                        'GENERATE CODE'
                    )}
                </button>

                {error && (
                    <div className="p-3 border-2 border-red-500 text-red-400 font-bold" style={{
                        background: 'rgba(255, 0, 0, 0.1)',
                        boxShadow: '0 0 10px rgba(255, 0, 0, 0.4)',
                    }}>
                        {error}
                    </div>
                )}

                {result && (
                    <div className="space-y-4 mt-6">
                        <div className="p-3 border-2 border-green-500 text-green-400 font-bold" style={{
                            background: 'rgba(57, 255, 20, 0.1)',
                            boxShadow: '0 0 10px rgba(57, 255, 20, 0.4)',
                        }}>
                            {result.message}
                        </div>

                        <div>
                            <label className="y2k-heading" style={{
                                color: '#39ff14',
                                fontSize: '0.9rem',
                                textShadow: '0 0 3px rgba(57, 255, 20, 0.5)',
                                marginBottom: '8px',
                                display: 'block',
                            }}>
                                GENERATED CODE:
                            </label>
                            <pre className="y2k-card p-4" style={{
                                background: 'rgba(0, 0, 0, 0.7)',
                                borderColor: '#39ff14',
                                overflow: 'x-auto',
                                maxHeight: '240px',
                                fontSize: '0.85rem',
                                color: '#39ff14',
                                fontFamily: 'monospace',
                            }}>
                                {result.code}
                            </pre>
                        </div>

                        <button
                            onClick={handleApply}
                            className="y2k-button-secondary w-full py-3"
                        >
                            CLEAR
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
