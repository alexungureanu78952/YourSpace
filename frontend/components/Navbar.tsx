"use client";
import Link from "next/link";

import { useAuth } from "../context/AuthContext";
import UserMenu from "./auth/UserMenu";

export default function Navbar() {
    const { user } = useAuth();
    return (
        <nav className="w-full flex items-center justify-between px-8 py-6 bg-black border-b-4 border-green-600 shadow-lg"
             style={{
                 boxShadow: '0 0 20px rgba(57, 255, 20, 0.3), inset 0 1px 0 rgba(57, 255, 20, 0.2)',
             }}>
            <div className="flex items-center gap-8">
                <Link href="/" className="text-4xl font-black text-green-400 hover:text-green-300 transition-all"
                      style={{
                          textShadow: '0 0 10px rgba(57, 255, 20, 0.8), 2px 2px 0 #0d3b1a',
                          fontFamily: 'Arial Black, sans-serif',
                          letterSpacing: '2px',
                      }}>
                    YOUR<span style={{ color: '#00ffff' }}>SPACE</span>
                </Link>
                <Link href="/feed" className="text-1xl font-bold text-green-400 hover:text-green-300 transition-all uppercase"
                      style={{
                          textShadow: '0 0 5px rgba(57, 255, 20, 0.6)',
                          letterSpacing: '1px',
                      }}>
                    Feed
                </Link>
                <Link href="/profiles" className="text-1xl font-bold text-green-400 hover:text-green-300 transition-all uppercase"
                      style={{
                          textShadow: '0 0 5px rgba(57, 255, 20, 0.6)',
                          letterSpacing: '1px',
                      }}>
                    Profiles
                </Link>
                {user && (
                    <Link href="/messages" className="text-1xl font-bold text-green-400 hover:text-green-300 transition-all uppercase"
                          style={{
                              textShadow: '0 0 5px rgba(57, 255, 20, 0.6)',
                              letterSpacing: '1px',
                          }}>
                        Messages
                    </Link>
                )}
            </div>
            <div className="flex items-center gap-6">
                {!user && (
                    <>
                        <Link href="/auth/login" className="font-bold text-green-400 hover:text-green-300 transition-all uppercase border-2 border-green-600 px-4 py-2"
                              style={{
                                  textShadow: '0 0 5px rgba(57, 255, 20, 0.6)',
                                  letterSpacing: '1px',
                                  boxShadow: '0 0 10px rgba(57, 255, 20, 0.3)',
                              }}>
                            Login
                        </Link>
                        <Link href="/auth/register" className="font-bold text-green-400 hover:text-green-300 transition-all uppercase border-2 border-cyan-400 px-4 py-2"
                              style={{
                                  textShadow: '0 0 5px rgba(0, 255, 255, 0.6)',
                                  letterSpacing: '1px',
                                  boxShadow: '0 0 10px rgba(0, 255, 255, 0.3)',
                              }}>
                            Register
                        </Link>
                    </>
                )}
                {user && (
                    <>
                        <Link
                            href={`/profile/${user.id}`}
                            className="font-bold text-green-400 hover:text-green-300 transition-all uppercase border-2 border-green-600 px-4 py-2"
                            aria-label="My Profile"
                            style={{
                                textShadow: '0 0 5px rgba(57, 255, 20, 0.6)',
                                letterSpacing: '1px',
                                boxShadow: '0 0 10px rgba(57, 255, 20, 0.3)',
                            }}
                        >
                            My Profile
                        </Link>
                        <UserMenu />
                    </>
                )}
            </div>
        </nav>
    );
}
