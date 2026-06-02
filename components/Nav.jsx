"use client"

import { useEffect, useState } from "react";
import Link from "next/link";

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

    return (
        <header className="fixed w-full top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100 transition-all duration-300">
            <div className={`max-w-7xl mx-auto flex items-center justify-between px-4 transition-all duration-300 ${scrolled ? "py-2" : "py-6"}`}>
                <div className="flex items-center gap-3 transition-all duration-300">
                    <img src="/logo.png" alt="Logo" className={scrolled ? "h-10 w-auto transition-all duration-300" : "h-16 w-auto transition-all duration-300"} />
                    {!scrolled && (
                        <img src="/titulo_minimo.png" alt="Título" className="h-5 md:h-7 w-auto transition-all duration-300" style={{marginLeft: 8}} />
                    )}
                </div>
                
                {/* Menú Desktop */}
                <nav className="hidden md:block">
                    <ul className="flex gap-8 font-semibold text-[#1C4880] text-lg">
                        <li><Link href="/" className="hover:text-[#269FD0] transition">Inicio</Link></li>
                        <li><Link href="/quienes-somos" className="hover:text-[#269FD0] transition">Quiénes somos</Link></li>
                        <li><Link href="/new-account" className="hover:text-[#269FD0] transition">Inscribete aquí</Link></li>
                        <li><Link href="/contact" className="hover:text-[#269FD0] transition">Contacto</Link></li>
                    </ul>
                </nav>

                {/* Botón Hamburguesa Mobile */}
                <button 
                    className="md:hidden flex flex-col gap-1.5 p-2"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    <span className={`w-6 h-0.5 bg-[#1C4880] transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}></span>
                    <span className={`w-6 h-0.5 bg-[#1C4880] transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}></span>
                    <span className={`w-6 h-0.5 bg-[#1C4880] transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}></span>
                </button>
            </div>

            {/* Menú Mobile Desplegable */}
            {menuOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white">
                    <nav className="max-w-7xl mx-auto px-4 py-4">
                        <ul className="flex flex-col gap-4 font-semibold text-[#1C4880] text-base">
                            <li><Link href="/" className="hover:text-[#269FD0] transition block py-2" onClick={handleNavClick}>Inicio</Link></li>
                            <li><Link href="/quienes-somos" className="hover:text-[#269FD0] transition block py-2" onClick={handleNavClick}>Quiénes somos</Link></li>
                            <li><Link href="/new-account" className="hover:text-[#269FD0] transition block py-2" onClick={handleNavClick}>Inscribete aquí</Link></li>
                            <li><Link href="/contact" className="hover:text-[#269FD0] transition block py-2" onClick={handleNavClick}>Contacto</Link></li>
                        </ul>
                    </nav>
                </div>
            )}
        </header>
    );
}