import { FaWhatsapp } from "react-icons/fa";

export default function Whatsapp() {
  return (
    <div className="flex flex-col items-center w-full">
            <a
              href="https://wa.me/56994974378"
              target="_blank"
              rel="noopener noreferrer"
              className="flex text-white bg-[#28A75A] rounded-full px-4 py-2 z-50"
              aria-label="Hablar por WhatsApp"
            >
              <div className="flex">
                <FaWhatsapp size={40} />
                <div className="ml-2">
                  <p className="text-sm font-bold">Escríbenos</p>
                  <p className="text-xs">por WhatsApp</p>
                </div>
              </div>
            </a>
            </div>
  );
}
