export default function Hightlights() {
    return (<section className="bg-[#269FD0] text-white py-16 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-6 text-center">
          {/* Coronas fabricadas */}
          <div>
            <div className="flex justify-center mb-2">
              {/* Ícono corona */}
              <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16" fill="none" viewBox="0 0 64 64"><path fill="#fff" d="M8 44l6-24 18 18 18-18 6 24-24 12z"/><circle cx="14" cy="14" r="4" fill="#fff"/><circle cx="50" cy="14" r="4" fill="#fff"/><circle cx="32" cy="8" r="4" fill="#fff"/></svg>
            </div>
            <h3 className="text-3xl font-bold">+5000</h3>
            <p>Coronas fabricadas</p>
          </div>
          {/* Tiempo de entrega */}
          <div>
            <div className="flex justify-center mb-2">
              {/* Ícono reloj */}
              <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16" fill="none" viewBox="0 0 64 64"><circle cx="32" cy="32" r="28" stroke="#fff" strokeWidth="4" fill="none"/><path stroke="#fff" strokeWidth="4" strokeLinecap="round" d="M32 16v18l12 6"/></svg>
            </div>
            <h3 className="text-3xl font-bold">5-7 días</h3>
            <p>Tiempo de entrega</p>
          </div>
          {/* Tecnología avanzada */}
          <div>
            <div className="flex justify-center mb-2">
              {/* Ícono chip */}
              <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16" fill="none" viewBox="0 0 64 64"><rect x="16" y="16" width="32" height="32" rx="6" stroke="#fff" strokeWidth="4"/><rect x="26" y="26" width="12" height="12" rx="2" fill="#fff"/><path stroke="#fff" strokeWidth="3" strokeLinecap="round" d="M32 4v8M32 52v8M4 32h8M52 32h8M12 12l4 4M48 48l4 4M12 52l4-4M48 16l4-4"/></svg>
            </div>
            <h3 className="text-3xl font-bold">CAD/CAM</h3>
            <p>Tecnología avanzada</p>
          </div>
          {/* Atención personalizada */}
          <div>
            <div className="flex justify-center mb-2">
              {/* Ícono corazón */}
              <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16" fill="none" viewBox="0 0 64 64"><path d="M32 56s-20-12.36-20-28A12 12 0 0132 16a12 12 0 0120 12c0 15.64-20 28-20 28z" stroke="#fff" strokeWidth="4" fill="#fff"/></svg>
            </div>
            <h3 className="text-3xl font-bold">Soporte</h3>
            <p>Atención personalizada</p>
          </div>
        </div>
      </section>);
}