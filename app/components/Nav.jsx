export default function Nav() {
    return <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2">
            <div className="flex items-center gap-2">
                <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
            </div>
            <nav>
                <ul className="flex gap-8 font-semibold text-[#1C4880] text-lg">
                    <li><a href="#" className="hover:text-[#269FD0] transition">Inicio</a></li>
                    <li><a href="#quienes-somos" className="hover:text-[#269FD0] transition">Quiénes somos</a></li>
                    <li><a href="#contacto" className="hover:text-[#269FD0] transition">Contacto</a></li>
                </ul>
            </nav>
        </div>
    </header>;
}