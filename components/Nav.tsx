"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { segoePR } from '@/app/fonts'
import { useSectionNav } from '@/app/hooks/useSectionNav'

export default function Nav() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const { goToInicio, scrollToSection } = useSectionNav();

    const handleNavClick = () => {
        setMenuOpen(false);
    };

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 9);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const handleGoToInicio = () => {
        setMenuOpen(false);
        goToInicio();
    };

    const handleScrollToSection = (id: string) => {
        setMenuOpen(false);
        scrollToSection(id);
    };

    return (
        <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#000B1D]/95 backdrop-blur-md border-b border-white/10' : 'bg-[#000B1D]'}`}>
            <section id="inicio" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-20 transition-all duration-300">
                    {/* Logo */}
                    <button className="flex items-center gap-2 md:gap-3 shrink-0" onClick={handleGoToInicio}>
                        <div className="relative w-14 h-14 md:w-16 md:h-16 transition-all duration-300 shrink-0">
                            <Image
                                src="/logo_02.png"
                                alt="Digital Ceramic"
                                fill
                                priority
                                sizes="64px"
                                className="object-contain"
                            />
                        </div>
                        <div className="min-w-0">
                            <div className={`hidden sm:flex text-xl md:text-2xl font-bold transition-all duration-300 ${scrolled ? 'opacity-100' : 'opacity-100'}`}>
                                <span className="text-white">Digital</span>
                                <span className="text-[#1D98EC]">Ceramic</span>
                            </div>
                            <div className={`hidden sm:flex ${segoePR.className} text-white text-[11px] sm:text-sm whitespace-nowrap`}>
                                simplemente odontología digital
                            </div>
                        </div>
                    </button>

                    {/* Menú Desktop */}
                    <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
                        <ul className="flex items-center gap-1 xl:gap-2 font-medium text-white text-sm xl:text-base">
                            <li key="link_01">
                                <button
                                    onClick={handleGoToInicio}
                                    className="px-3 xl:px-4 py-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                                >
                                    Inicio
                                </button>
                            </li>
                            <li key="link_02">
                                <button
                                    onClick={() => handleScrollToSection('club')}
                                    className="px-3 xl:px-4 py-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                                >
                                    Club de beneficios
                                </button>
                            </li>
                            <li key="link_03">
                                <button
                                    onClick={() => handleScrollToSection('servicios')}
                                    className="px-3 xl:px-4 py-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                                >
                                    Servicio
                                </button>
                            </li>
                            <li key="link_05">
                                <Link href="/somos" className="px-3 xl:px-4 py-2 rounded-lg hover:bg-white/10 transition-colors">
                                    Quienes somos
                                </Link>
                            </li>
                            <li key="link_06">
                                <Link href="/contacto" className="px-3 xl:px-4 py-2 rounded-lg hover:bg-white/10 transition-colors">
                                    Contacto
                                </Link>
                            </li>
                        </ul>
                    </nav>

                    {/* Acceso doctor: solo visible junto al menú desktop (lg+) para no competir por espacio con el hamburguesa en mobile/tablet */}
                    <div className="hidden lg:block shrink-0">
                        <Link href="/login" className="px-4 xl:px-6 py-3 xl:py-4 rounded-xl bg-white text-[#16213E] font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap">
                            Acceso doctor
                        </Link>
                    </div>

                    {/* Botón Hamburguesa */}
                    <button
                        className="lg:hidden flex flex-col gap-1.5 p-2 relative z-50 shrink-0"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                    >
                        <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}></span>
                        <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}></span>
                        <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}></span>
                    </button>
                </div>
            </section>

            {/* Menú Mobile */}
            <div className={`lg:hidden fixed inset-0 top-16 md:top-20 bg-[#000B1D]/95 backdrop-blur-md transition-all duration-300 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                <nav className="h-full overflow-y-auto px-4 py-8">
                    <ul className="flex flex-col gap-2 max-w-sm mx-auto">
                        <li>
                            <button
                                onClick={handleGoToInicio}
                                className="w-full text-left px-4 py-3 text-white text-lg font-medium hover:bg-white/10 rounded-lg transition-colors"
                            >
                                Inicio
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => handleScrollToSection('club')}
                                className="w-full text-left px-4 py-3 text-white text-lg font-medium hover:bg-white/10 rounded-lg transition-colors"
                            >
                                Club de beneficios
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => handleScrollToSection('servicios')}
                                className="w-full text-left px-4 py-3 text-white text-lg font-medium hover:bg-white/10 rounded-lg transition-colors"
                            >
                                Servicio
                            </button>
                        </li>
                        <li>
                            <Link href="/somos" className="block px-4 py-3 text-white text-lg font-medium hover:bg-white/10 rounded-lg transition-colors" onClick={handleNavClick}>
                                Quienes somos
                            </Link>
                        </li>
                        <li>
                            <Link href="/contacto" className="block px-4 py-3 text-white text-lg font-medium hover:bg-white/10 rounded-lg transition-colors" onClick={handleNavClick}>
                                Contacto
                            </Link>
                        </li>
                        <li className="mt-4 pt-4 border-t border-white/10">
                            <Link href="/login" className="block px-4 py-3 text-center text-[#16213E] bg-white rounded-xl font-semibold hover:bg-gray-100 transition-colors" onClick={handleNavClick}>
                                Acceso doctor
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
