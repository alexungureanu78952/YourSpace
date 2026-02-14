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
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur border border-purple-500/20 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
                <h3 className="text-xl font-bold text-white">AI Profile Assistant</h3>
            </div>

            <p className="text-gray-300 text-sm mb-4">
                Describe your profile design and select what code you want AI to generate. Copy the result below into your custom HTML or CSS boxes.
            </p>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        What do you want to create?
                    </label>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g., Create a retro MySpace profile with pink gradient background and sparkles"
                        className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        rows={3}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Generate:
                    </label>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => setType('both')}
                            className={`px-4 py-2 rounded-lg font-medium transition ${type === 'both'
                                ? 'bg-purple-600 text-white'
                                : 'bg-white/5 text-gray-300 hover:bg-white/10'
                                }`}
                        >
                            Both (HTML + CSS)
                        </button>
                        <button
                            type="button"
                            onClick={() => setType('html')}
                            className={`px-4 py-2 rounded-lg font-medium transition ${type === 'html'
                                ? 'bg-purple-600 text-white'
                                : 'bg-white/5 text-gray-300 hover:bg-white/10'
                                }`}
                        >
                            HTML Only
                        </button>
                        <button
                            type="button"
                            onClick={() => setType('css')}
                            className={`px-4 py-2 rounded-lg font-medium transition ${type === 'css'
                                ? 'bg-purple-600 text-white'
                                : 'bg-white/5 text-gray-300 hover:bg-white/10'
                                }`}
                        >
                            CSS Only
                        </button>
                    </div>
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={loading || !prompt.trim()}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Generating...
                        </>
                    ) : (
                        'Generate Code'
                    )}
                </button>

                {error && (
                    <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                {result && (
                    <div className="space-y-4 mt-6">
                        <div className="bg-green-500/20 border border-green-500 text-green-300 px-4 py-3 rounded-lg">
                            {result.message}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Generated Code:
                            </label>
                            <pre className="bg-black/50 border border-gray-600 rounded-lg p-4 text-xs text-gray-300 overflow-x-auto max-h-60">
                                {result.code}
                            </pre>
                        </div>

                        <button
                            onClick={handleApply}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
                        >
                            Clear
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
