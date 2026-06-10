"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaUserShield } from "react-icons/fa";

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
        <header className="fixed w-full top-0 z-50 bg-[#000B1D] backdrop-blur border-b transition-all duration-300">
            <div className={`max-w-7xl mx-auto flex items-center justify-between px-4 transition-all duration-300 ${scrolled ? "py-2" : "py-6"}`}>
                <div className="flex items-center gap-3 transition-all duration-300">
                    <img src="/logo.png" alt="Logo" className={scrolled ? "h-10 w-auto transition-all duration-300" : "h-16 w-auto transition-all duration-300"} />                    
                    {!scrolled && <div>
                        <p className="text-white text-2xl font-bold">DigitalCeramic</p>
                        <p className="text-[#1D98EC]">ODONTOLOGIA DIGITAL</p>
                    </div>}
                </div>
                
                {/* Menú Desktop */}
                <nav className="hidden md:block">
                    <ul className="flex gap-8 font-semibold text-white text-lg">
                        <li><Link href="/" className="border-[#2A6294] hover:border-b-3 transition">Inicio</Link></li>
                        <li><Link href="/quienes-somos" className="border-[#2A6294] hover:border-b-3 transition">Club de beneficios 🔥</Link></li>
                        <li><Link href="/new-account" className="border-[#2A6294] hover:border-b-3 transition">Servicio</Link></li>
                        <li><Link href="/contact" className="border-[#2A6294] hover:border-b-3 transition">Casos clinicos</Link></li>
                        <li><Link href="/contact" className="border-[#2A6294] hover:border-b-3 transition">Contacto</Link></li>
                        <li><Link href="/contact" className="flex bg-linear-to-b from-[#7C31CF] to-[#731BD1] px-6 py-2 rounded-xl -mt-2 gap-2">
                            INSCRIBETE
                            <FaUserShield className="mt-1" />
                        </Link></li>
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
                            <li><Link href="/" className="border-[#2A6294] hover:border-b-3 transition block py-2" onClick={handleNavClick}>Inicio</Link></li>
                            <li><Link href="/quienes-somos" className="border-[#2A6294] hover:border-b-3 transition block py-2" onClick={handleNavClick}>Quiénes somos</Link></li>
                            <li><Link href="/new-account" className="border-[#2A6294] hover:border-b-3 transition block py-2" onClick={handleNavClick}>Inscribete aquí</Link></li>
                            <li><Link href="/contact" className="border-[#2A6294] hover:border-b-3 transition block py-2" onClick={handleNavClick}>Contacto</Link></li>
                        </ul>
                    </nav>
                </div>
            )}
        </header>
    );
}