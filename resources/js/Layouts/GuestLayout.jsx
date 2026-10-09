import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-gray-50 flex-col md:flex-row">
            {/* Left side: Branding/Image */}
            <div className="hidden md:flex md:w-1/2 lg:w-3/5 bg-indigo-600 relative overflow-hidden flex-col justify-center items-center">
                {/* Background decorations */}
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
                
                <div className="relative z-10 px-12 text-center">
                    <div className="flex justify-center mb-8">
                        <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                        </svg>
                    </div>
                    <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tight">WorkshopHub</h1>
                    <p className="text-indigo-100 text-lg max-w-md mx-auto leading-relaxed">
                        Join our community of professionals, learn new skills, and accelerate your career with expert-led workshops.
                    </p>
                </div>
            </div>

            {/* Right side: Form */}
            <div className="w-full md:w-1/2 lg:w-2/5 flex flex-col justify-center px-8 sm:px-12 lg:px-20 py-12 bg-white shadow-xl md:shadow-none z-10 rounded-t-3xl md:rounded-none -mt-10 md:mt-0 min-h-screen md:min-h-0">
                <div className="md:hidden flex items-center gap-2 mb-8 justify-center">
                    <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                    <span className="text-2xl font-bold text-gray-900 tracking-tight">WorkshopHub</span>
                </div>
                
                <div className="w-full max-w-md mx-auto">
                    {children}
                </div>
                
                <div className="mt-8 text-center md:hidden">
                    <Link href="/" className="text-sm text-gray-500 hover:text-indigo-600 transition">
                        &larr; Back to home
                    </Link>
                </div>
            </div>
            
            {/* Top left back link on desktop */}
            <Link href="/" className="hidden md:flex absolute top-8 left-8 text-white/80 hover:text-white transition items-center gap-2 z-20">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                Back to home
            </Link>
        </div>
    );
}
