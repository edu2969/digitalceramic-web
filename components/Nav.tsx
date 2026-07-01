"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Nav() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 9);
        };
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const handleNavClick = () => {
        setMenuOpen(false);
    };

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (!element) return;
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        const offset = 120;
        window.scrollTo({
            top: elementPosition - offset,
            behavior: 'smooth'
        });
        setMenuOpen(false);
    };

    return (
        <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#000B1D]/95 backdrop-blur-md border-b border-white/10' : 'bg-[#000B1D]'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-20 transition-all duration-300">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 md:gap-3 shrink-0" onClick={handleNavClick}>
                        <div className="relative w-10 h-10 md:w-14 md:h-14 transition-all duration-300">
                            <Image
                                src="/logo_02.png"
                                alt="Digital Ceramic"
                                fill
                                priority
                                sizes="56px"
                                className="object-contain"
                            />
                        </div>
                        <div className={`hidden sm:flex text-xl md:text-2xl font-bold transition-all duration-300 ${scrolled ? 'opacity-100' : 'opacity-100'}`}>
                            <span className="text-white">Digital</span>
                            <span className="text-[#1D98EC]">Ceramic</span>
                        </div>
                    </Link>

                    {/* Menú Desktop */}
                    <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
                        <ul className="flex items-center gap-1 xl:gap-2 font-medium text-white text-sm xl:text-base">
                            <li key="link_01">
                                <Link href="/" className="px-3 xl:px-4 py-2 rounded-lg hover:bg-white/10 transition-colors">
                                    Inicio
                                </Link>
                            </li>
                            <li key="link_02">
                                <button 
                                    onClick={() => scrollToSection('club')}
                                    className="px-3 xl:px-4 py-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                                >
                                    Club de beneficios
                                </button>
                            </li>
                            <li key="link_03">
                                <button 
                                    onClick={() => scrollToSection('servicios')}
                                    className="px-3 xl:px-4 py-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                                >
                                    Servicio
                                </button>
                            </li>
                            {/*<li>
                                <Link href="/casos-clinicos" className="px-3 xl:px-4 py-2 rounded-lg hover:bg-white/10 transition-colors">
                                    Casos clínicos
                                </Link>
                            </li>*/}
                            <li key="link_05">
                                <Link href="/contacto" className="px-3 xl:px-4 py-2 rounded-lg hover:bg-white/10 transition-colors">
                                    Contacto
                                </Link>
                            </li>
                            <li key="link_06" className="ml-2">
                                <Link href="/login" className="px-4 xl:px-6 py-4 rounded-xl bg-white text-[#16213E] font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap">
                                    Acceso clientes
                                </Link>
                            </li>
                            <li key="link_07">
                                <Link href="/cuenta" className="px-4 xl:px-6 py-4 rounded-xl bg-linear-to-b from-[#7C31CF] to-[#731BD1] text-white font-semibold hover:opacity-90 transition-opacity whitespace-nowrap">
                                    Inscríbete al club
                                </Link>
                            </li>
                        </ul>
                    </nav>

                    {/* Botón Hamburguesa */}
                    <button
                        className="lg:hidden flex flex-col gap-1.5 p-2 relative z-50"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                    >
                        <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}></span>
                        <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}></span>
                        <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}></span>
                    </button>
                </div>
            </div>

            {/* Menú Mobile */}
            <div className={`lg:hidden fixed inset-0 top-16 md:top-20 bg-[#000B1D]/95 backdrop-blur-md transition-all duration-300 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                <nav className="h-full overflow-y-auto px-4 py-8">
                    <ul className="flex flex-col gap-2 max-w-sm mx-auto">
                        <li>
                            <Link href="/" className="block px-4 py-3 text-white text-lg font-medium hover:bg-white/10 rounded-lg transition-colors" onClick={handleNavClick}>
                                Inicio
                            </Link>
                        </li>
                        <li>
                            <button 
                                onClick={() => scrollToSection('club')}
                                className="w-full text-left px-4 py-3 text-white text-lg font-medium hover:bg-white/10 rounded-lg transition-colors"
                            >
                                Club de beneficios
                            </button>
                        </li>
                        <li>
                            <button 
                                onClick={() => scrollToSection('servicios')}
                                className="w-full text-left px-4 py-3 text-white text-lg font-medium hover:bg-white/10 rounded-lg transition-colors"
                            >
                                Servicio
                            </button>
                        </li>
                        {/*<li>
                            <Link href="/casos-clinicos" className="block px-4 py-3 text-white text-lg font-medium hover:bg-white/10 rounded-lg transition-colors" onClick={handleNavClick}>
                                Casos clínicos
                            </Link>
                        </li>*/}
                        <li>
                            <Link href="/contacto" className="block px-4 py-3 text-white text-lg font-medium hover:bg-white/10 rounded-lg transition-colors" onClick={handleNavClick}>
                                Contacto
                            </Link>
                        </li>
                        <li className="mt-4 pt-4 border-t border-white/10">
                            <Link href="/login" className="block px-4 py-3 text-center text-[#16213E] bg-white rounded-xl font-semibold hover:bg-gray-100 transition-colors" onClick={handleNavClick}>
                                Acceso clientes
                            </Link>
                        </li>
                        <li>
                            <Link href="/new-account" className="block px-4 py-3 text-center text-white bg-linear-to-b from-[#7C31CF] to-[#731BD1] rounded-xl font-semibold hover:opacity-90 transition-opacity" onClick={handleNavClick}>
                                Inscríbete al club
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}