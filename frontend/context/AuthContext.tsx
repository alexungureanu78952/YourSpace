"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

interface User {
    id: number;
    username: string;
    email: string;
    displayName: string;
    createdAt: string;
}

export interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string, user: User) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        console.log('🔄 [AuthContext] Initializing...');
        const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null;
        console.log('🔍 [AuthContext] localStorage token:', storedToken ? `${storedToken.substring(0, 20)}...` : 'NULL');
        console.log('🔍 [AuthContext] localStorage user:', storedUser ? 'EXISTS' : 'NULL');
        
        if (storedToken && storedUser) {
            try {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
                console.log('✅ [AuthContext] Loaded from localStorage');
            } catch (error) {
                // Invalid JSON in localStorage, clear it
                console.warn('Failed to parse stored user data, clearing localStorage');
                localStorage.removeItem("token");
                localStorage.removeItem("user");
            }
        } else {
            console.log('⚠️ [AuthContext] No data in localStorage');
        }
    }, []);

    const login = (jwt: string, userObj: User) => {
        console.log('🔐 [AuthContext] Login called with token:', jwt?.substring(0, 20), 'and user:', userObj.username);
        setToken(jwt);
        setUser(userObj);
        localStorage.setItem("token", jwt);
        localStorage.setItem("user", JSON.stringify(userObj));
        console.log('✅ [AuthContext] Saved to localStorage');
        
        // Verify save
        const verified = localStorage.getItem("token");
        console.log('🔍 [AuthContext] Verification - token in localStorage:', verified ? 'EXISTS' : 'FAILED');
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
    return ctx;
}
