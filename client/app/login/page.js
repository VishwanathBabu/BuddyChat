'use client';

import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LoginPage() {
    const { login, user, loading } = useAuth();
    const router = useRouter();
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        setIsAnimating(true);
        if (!loading && user) {
            router.push('/');
        }
    }, [user, loading, router]);

    const responseMessage = async (response) => {
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/google`, {
                credential: response.credential,
            });
            login(res.data.user, res.data.token);
        } catch (error) {
            console.error('Login Failed:', error);
        }
    };

    const errorMessage = (error) => {
        console.log('Login Failed:', error);
    };

    if (loading) return (
        <div className="h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-emerald-100">
            <div className="animate-pulse flex flex-col items-center">
                <div className="h-12 w-12 bg-emerald-500/20 rounded-full mb-4"></div>
                <div className="h-4 w-32 bg-gray-300 rounded"></div>
            </div>
        </div>
    );

    return (
        <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#e0c3fc] via-[#8ec5fc] to-[#80d0c7] relative overflow-hidden">
            {/* Abstract shapes */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-300/30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-teal-300/30 rounded-full blur-3xl animate-pulse delay-1000"></div>

            <div className={`bg-white/70 backdrop-blur-lg border border-white/20 shadow-xl p-12 rounded-3xl text-center max-w-sm w-full mx-4 transition-all duration-700 transform ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="mb-8">
                    <div className="w-20 h-20 bg-gradient-to-tr from-emerald-400 to-teal-600 rounded-2xl mx-auto shadow-lg flex items-center justify-center mb-6 transform rotate-3 hover:rotate-6 transition-transform duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-white">
                            <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-800 mb-2 tracking-tight">Welcome Back</h1>
                    <p className="text-gray-500 text-sm">Connect with your friends smoothly.</p>
                </div>

                <div className="flex justify-center transform hover:scale-105 transition-transform duration-200">
                    <GoogleLogin onSuccess={responseMessage} onError={errorMessage} theme="filled_blue" shape="pill" />
                </div>

                <div className="mt-8 text-xs text-gray-400">
                    Secure & Fast Messaging
                </div>
            </div>
        </div>
    );
}
