import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>

            <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#FDFDFC] px-6 text-[#1b1b18] dark:bg-[#0a0a0a] dark:text-[#EDEDEC]">
               <div className="text-center max-w-2xl w-full relative z-10">
                    <h1 className="text-3xl sm:text-5xl font-semibold leading-tight tracking-tight mb-4">
                        Laravel + React Starter Kit
                    </h1>
                    <p className="text-lg sm:text-xl text-[#5A5A57] dark:text-[#A9A9A3] mb-8">
                        A modern, production-ready starter kit built with Laravel, React, Inertia, Tailwind, and RBAC. Designed with developer experience and best practices in mind.
                    </p>

                    {auth.user ? (
                        <Link
                            href={route('dashboard')}
                            className="inline-block rounded-lg bg-black text-white dark:bg-white dark:text-black px-6 py-3 text-base font-medium shadow hover:opacity-90 transition"
                        >
                            Go to Dashboard
                        </Link>
                    ) : (
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href={route('register')}
                                className="inline-block rounded-lg bg-black text-white dark:bg-white dark:text-black px-6 py-3 text-base font-medium shadow hover:opacity-90 transition"
                            >
                                Get Started
                            </Link>
                            <Link
                                href={route('login')}
                                className="inline-block rounded-lg border border-[#19140035] px-6 py-3 text-base font-medium text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                            >
                                Log In
                            </Link>
                        </div>
                    )}

                    <footer className="mt-12 text-sm text-[#9D9D97] dark:text-[#6C6C6C]">
                        &copy; {new Date().getFullYear()} YourStarterKit. All rights reserved.
                    </footer>
                </div>
            </div>
        </>
    );
}
