import Image from "next/image";
import { FaCheck } from "react-icons/fa";
import { LuMoveRight } from "react-icons/lu";

export default function Services() {
  return (<section className="px-6 text-[#24335D]" id="servicios">
    <div className="mx-auto text-center">      
      <div className="grid md:grid-cols-5 gap-8 mt-6">
        <div className="w-full grid grid-cols-3 col-span-3 gap-4">
          <div className="text-left ml-12 col-span-3">
            <h2 className="text-3xl font-bold">SOLUCIONES DIGITALES</h2>
            <p className="text-lg">
              Todo lo que necesitar para trabajar digital
            </p>
          </div>
          <div className="bg-[#F0F1F3] border-gray-300 border-2 rounded-xl py-6">
            <Image src="/tool_b_01.png" width={90} height={90} className="mx-auto" />
            <p className="font-bold">Estaneo intraoral</p>
            <p className="text-xs">Captura digital precisa sin impresiones tradicionales</p>
          </div>
          <div className="bg-[#F0F1F3] border-gray-300 border-2 rounded-xl py-6">
            <Image src="/tool_b_02.png" width={90} height={90} className="mx-auto" />
            <p className="font-bold">Estaneo intraoral</p>
            <p className="text-xs">Captura digital precisa sin impresiones tradicionales</p>
          </div>
          <div className="bg-[#F0F1F3] border-gray-300 border-2 rounded-xl py-6">
            <Image src="/tool_b_03.png" width={90} height={90} className="mx-auto" />
            <p className="font-bold">Estaneo intraoral</p>
            <p className="text-xs">Captura digital precisa sin impresiones tradicionales</p>
          </div>
          <div className="bg-[#F0F1F3] border-gray-300 border-2 rounded-xl py-6">
            <Image src="/tool_b_04.png" width={90} height={90} className="mx-auto" />
            <p className="font-bold">Estaneo intraoral</p>
            <p className="text-xs">Captura digital precisa sin impresiones tradicionales</p>
          </div>
          <div className="bg-[#F0F1F3] border-gray-300 border-2 rounded-xl py-6">
            <Image src="/tool_b_05.png" width={90} height={90} className="mx-auto" />
            <p className="font-bold">Estaneo intraoral</p>
            <p className="text-xs">Captura digital precisa sin impresiones tradicionales</p>
          </div>
          <div className="bg-[#F0F1F3] border-gray-300 border-2 rounded-xl py-6">
            <Image src="/tool_b_06.png" width={90} height={90} className="mx-auto" />
            <p className="font-bold">Estaneo intraoral</p>
            <p className="text-xs">Captura digital precisa sin impresiones tradicionales</p>
          </div>
        </div>

        <div className="col-span-2 w-full bg-linear-to-r from-[#0B1036] to-80% to-[#130E54] rounded-2xl h-full p-6 text-left">
          <p className="text-[#7E3EDA] text-2xl font-bold">PLAN BIENVENIDA</p>
          <p className="text-white text-3xl font-bold">10 CORONAS</p>
          <p className="text-white text-2xl font-bold -mt-1">DIGITALES</p>
          <div className="w-full text-left mt-2">
            <span className="bg-[#7E3EDA] text-white px-3 py-1.5 text-xs">PRECIO PREFERENCIAL PARA NUEVOS INSCRITOS</span>
          </div>
          <div className="grid grid-cols-5">
            <div className="col-span-3 space-y-2 mt-4 text-white">
              <p className="flex"><FaCheck className="bg-[#7E3EDA] p-0.5 rounded-sm mr-3 mt-1" />Sin inversion inicial</p>
              <p className="flex"><FaCheck className="bg-[#7E3EDA] p-0.5 rounded-sm mr-3 mt-1" />Flujo digital completo</p>
              <p className="flex"><FaCheck className="bg-[#7E3EDA] p-0.5 rounded-sm mr-3 mt-1" />Diseño CAD/CAM incluído</p>
              <p className="flex"><FaCheck className="bg-[#7E3EDA] p-0.5 rounded-sm mr-3 mt-1" />Materiales de alta calidad</p>
              <p className="flex"><FaCheck className="bg-[#7E3EDA] p-0.5 rounded-sm mr-3 mt-1" />Soporte técnico y clínico</p>
              <p className="flex"><FaCheck className="bg-[#7E3EDA] p-0.5 rounded-sm mr-3 mt-1" />Cupos limitados</p>
            </div>
            <div className="col-span-2">
              <Image src="/molar-plat.png" width={160} height={160} className="mt-16" />
            </div>
          </div>
          <div className="col-span-10">
            <button className="w-full bg-[#F1C71D] py-3 text-black font-bold rounded-md mt-6 flex justify-center">
              <div className="flex">
                QUIERO MIS 10 CORONAS
                <LuMoveRight size="24" className="ml-6"/>
              </div>
            </button>
          </div>
        </div>

      </div>
    </div>
  </section>);
}