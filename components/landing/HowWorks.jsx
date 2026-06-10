import Image from "next/image";
import { LuMoveRight } from "react-icons/lu";

export default function HowWorks() {
    return (<section className="py-6 px-6 max-w-7xl mx-auto text-center border-2 border-gray-100 mt-4 bg-[#F3F2F5]">
        <h2 className="text-3xl font-bold">¿POR QUÉ ELEGIR DIGITAL CERAMIC?</h2>
        <p>Más de 15 años impulsando la odontología en Chile.</p>

        <div className="grid md:grid-cols-4 gap-8 mt-10">
          <div className="w-full text-center border-gray-200 border-r-2 px-4">
            <Image src="/tool_3_01.png" width={90} height={90} className="mx-auto"/>
            <p className="text-gray-600 mt-2 font-bold">
              15 años de experiencia
            </p>
            <p className="text-sm">Miles de casos y odontólogos respaldan nuestro trabajo</p>
          </div>
          <div className="w-full text-center border-gray-200 border-r-2 px-4">
            <Image src="/tool_3_02.png" width={90} height={90} className="mx-auto my-5"/>
            <p className="text-gray-600 mt-2 font-bold">
              FLujo 100% digital
            </p>
            <p className="text-sm">Tecnología de última generación en cada etapa del proceso</p>
          </div>
          <div className="w-full text-center border-gray-200 border-r-2 px-4 mt-5">
            <Image src="/tool_3_03.png" width={90} height={90} className="mx-auto mb-4"/>
            <p className="text-gray-600 mt-2 font-bold">
              Escaner intraoral disponible
            </p>
            <p className="text-sm">Para odontólogos que no cuentan con esta tecnología</p>
          </div>
          <div className="w-full text-center border-gray-200 border-r-2 px-4">
            <Image src="/tool_3_04.png" width={90} height={90} className="mx-auto my-3"/>
            <p className="text-gray-600 mt-2 font-bold">
              Más de 5.000 restauraciones
            </p>
            <p className="text-sm">Resultados comprobados en todo tipo de casos</p>
          </div>
        </div>
        <div className="mt-8 relative p-6 h-36 bg-linear-to-br from-[#051C70] to-[#040E28] z-10 rounded-2xl
                grid grid-cols-10 shadow-lg">
                  <Image
                    src="/molar-design.png"
                    alt="Descripción"
                    fill
                    className="object-contain"
                    sizes="auto"
                  />                  
                  <div className="w-full absolute top-0 left-0 col-span-10 p-6">                    
                    <div className="w-full flex">
                      <div className="text-white text-left w-1/2">
                        <p className="text-2xl">La odontología digital</p>
                        <p className="text-2xl">al alcance de todos los odontólogos.</p>
                        <p>Menos impresiones, más precisión.</p>
                      </div>
                      <div className="w-1/2 text-right">
                      <button className="flex bg-linear-to-b from-[#7C31CF] to-[#731BD1] px-6 py-2 mx-auto text-white rounded-xl mt-3 justify-end mr-8">
                        <div className="text-left">
                          <p className="font-bold">INCRÍBETE AL CLUB</p>
                          <p>y comienza hoy</p>
                        </div>
                        <LuMoveRight size="24" className="ml-6 mt-3"/>
                      </button>
                      </div>
                    </div>
                    
                  </div>
              </div>
      </section>);    
}