"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Nav() {
    const [scrolled, setScrolled] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100 transition-all duration-300">
            <div className={`max-w-7xl mx-auto flex items-center justify-between px-4 transition-all duration-300 ${scrolled ? "py-2" : "py-6"}`}>
                <div className="flex items-center gap-3 transition-all duration-300">
                    <img src="/logo.png" alt="Logo" className={scrolled ? "h-10 w-auto transition-all duration-300" : "h-16 w-auto transition-all duration-300"} />
                    {!scrolled && (
                        <img src="/titulo_minimo.png" alt="Título" className="h-5 md:h-7 w-auto transition-all duration-300" style={{marginLeft: 8}} />
                    )}
                </div>
                <nav>
                    <ul className="flex gap-8 font-semibold text-[#1C4880] text-lg">
                        <li><Link href="/" className="hover:text-[#269FD0] transition">Inicio</Link></li>
                        <li><a href="#quienes-somos" className="hover:text-[#269FD0] transition">Quiénes somos</a></li>
                        <li><Link href="/contact" className="hover:text-[#269FD0] transition">Contacto</Link></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}