import React from 'react';
import { AuthContext, AuthContextType } from '../../context/AuthContext';

export function withMockAuthProvider<T>(ui: React.ReactElement, value?: Partial<AuthContextType>) {
    const defaultValue: AuthContextType = {
        user: {
            id: 1,
            username: 'test',
            email: 'test@email.com',
            displayName: 'Test',
            createdAt: new Date().toISOString(),
            ...((value?.user as any) || {})
        },
        token: 'mock-token',
        login: jest.fn(),
        logout: jest.fn(),
        ...value,
    };
    return <AuthContext.Provider value={defaultValue}>{ui}</AuthContext.Provider>;
}
