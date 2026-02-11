import React, { useState } from 'react';
import { AuthContext, AuthContextType } from '../../context/AuthContext';

interface MockAuthProviderProps {
    initialUser?: any;
    initialToken?: string | null;
    children: React.ReactNode;
}

export function MockAuthProvider({ initialUser = null, initialToken = null, children }: MockAuthProviderProps) {
    const [user, setUser] = useState(initialUser);
    const [token, setToken] = useState(initialToken);

    const login = jest.fn((newToken: string, newUser: any) => {
        setToken(newToken);
        setUser(newUser);
    });

    const logout = jest.fn(() => {
        setToken(null);
        setUser(null);
    });

    const value: AuthContextType = {
        user,
        token,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
