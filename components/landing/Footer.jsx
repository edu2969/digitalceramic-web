export default function Footer() {
  return (<footer className="bg-linear-to-br from-[#031529] to-[#020E29] text-white py-4 text-center">
    <div className="grid grid-6">
      <div className="col-span-2">
        <div className="relative z-20 ml-12 mx-auto text-left max-w-1/2">
          <div className="flex text-5xl font-bold">
            <p>Digital</p>
            <p className="text-[#1F9CE7]">Ceramic</p>
          </div>          
        </div>
      </div>
    </div>
    <p className="text-xs opacity-80 border-t-2 border-white/20 pt-2">
      © {new Date().getFullYear()} DigitalCeramic. Todos los derechos reservados
    </p>
  </footer>);
}