export default function Footer() {
    return (<footer className="bg-[#1C4880] text-white py-4 text-center">
        <p className="text-sm opacity-80">
          © {new Date().getFullYear()} DigitalCeramic. Todos los derechos reservados.
        </p>
      </footer>);
}