import Image from "next/image";
import Link from "next/link";
import {
    FaBullseye,
    FaMedal,
    FaTooth,
    FaHandshake,
    FaSackDollar,
    FaMountain,
    FaEye,
    FaShieldHalved,
    FaUserGroup,
    FaRegClock,
    FaLock,
    FaArrowRight,
    FaQuoteLeft,
} from "react-icons/fa6";

// Reemplaza estas rutas por tus imágenes reales dentro de /public/images
const IMAGES = {
    hero: "/who-we-are/hero-molde-dental.png",
    history: "/who-we-are/tecnico-escaneando.png",
    cta: "/who-we-are/sonrisa-cta.png",
};

const DEFINE_CARDS = [
    {
        icon: FaBullseye,
        title: "Precisión",
        description: "Resultados exactos con tecnología de última generación.",
    },
    {
        icon: FaMedal,
        title: "Calidad",
        description:
            "Materiales de alta gama y procesos digitalizados bajo estándares internacionales.",
    },
    {
        icon: FaTooth,
        title: "Estética",
        description: "Realismo en color y diseño de sonrisa que supera expectativas.",
    },
    {
        icon: FaHandshake,
        title: "Acompañamiento",
        description: "Asesoría personalizada en cada caso, de principio a fin.",
    },
    {
        icon: FaSackDollar,
        title: "Accesibilidad",
        description: "Tecnología de vanguardia con precios competitivos para todos.",
    },
];

const TRUST_ITEMS = [
    {
        icon: FaShieldHalved,
        title: "15 años de experiencia",
        description: "Respaldados por nuestra trayectoria y resultados.",
    },
    {
        icon: FaUserGroup,
        title: "Expertos a tu servicio",
        description: "Laboratoristas y especialistas comprometidos contigo.",
    },
    {
        icon: FaRegClock,
        title: "Tiempos confiables",
        description: "Cumplimos plazos sin comprometer calidad.",
    },
    {
        icon: FaLock,
        title: "Confidencialidad",
        description: "Manejamos tu información con total seguridad.",
    },
];

export default function WhoWeAre() {
    return (
        <main className="pt-16 md:pt-20 bg-white">
            {/* HERO: ¿Quiénes somos? */}
            <section className="relative overflow-hidden bg-[#000A13] text-white min-h-120 md:h-[55vh]">
    {/* Imagen de fondo: mitad derecha en desktop, fondo completo en móvil */}
    <div className="absolute inset-0 md:inset-y-0 md:left-1/2 md:right-0">
        <div className="relative w-full h-full">
            <Image
                src={IMAGES.hero}
                alt="Molde dental digital de alta precisión bajo escaneo"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                style={{
                    objectPosition: "center 35%", // ajustable según el foco de tu foto
                }}
                priority
            />

            {/* Degradado lateral: fino, solo cubre el primer 1/8 (12.5%) del ancho */}
            <div className="absolute inset-0 bg-linear-to-r from-[#000A13] from-0% via-[#000A13]/70 via-6% to-transparent to-[12.5%] pointer-events-none" />

            {/* Degradado inferior: oscurece la base de la imagen */}
            <div className="absolute inset-0 bg-linear-to-b from-transparent via-[#000A13]/20 to-[#000A13]/60 pointer-events-none" />
        </div>
    </div>

    {/* Contenido de texto */}
    <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center py-16 md:py-0">
        <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                <span className="block text-white">¿Quiénes</span>
                <span className="block text-[#17C3BE]">somos?</span>
            </h1>
            <span className="mt-4 block h-1 w-16 rounded-full bg-[#17C3BE]" />
            <p className="mt-6 max-w-md text-sm md:text-base text-white/70 leading-relaxed">
                Somos un laboratorio dental digital que combina experiencia,
                tecnología y pasión por la excelencia para entregar soluciones de
                alta precisión, estética y funcionalidad.
            </p>
        </div>
    </div>

    {/* Línea decorativa inferior, igual estilo que en el resto del sitio */}
    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-[#17C3BE]/20 via-[#17C3BE]/50 to-transparent" />
</section>

            {/* NUESTRA HISTORIA */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                <div>
                    <span className="text-xs font-bold tracking-widest text-[#17BEB6]">
                        NUESTRA HISTORIA
                    </span>
                    <h2 className="mt-3 text-3xl md:text-4xl font-extrabold text-[#16213E] leading-snug">
                        15 años de experiencia
                        <br />
                        en el ámbito laboral
                    </h2>
                    <p className="mt-6 text-sm md:text-base text-slate-500 leading-relaxed">
                        Hemos digitalizado nuestros procesos gracias a una alianza
                        estratégica con laboratoristas con más de 10 años de experiencia,
                        lo que nos permite entregar resultados de alta precisión, calidad
                        de realismo en color y un diseño de sonrisa que transforma vidas.
                    </p>
                    <p className="mt-4 text-sm md:text-base text-slate-500 leading-relaxed">
                        Nuestros cimientos están en permitir el acceso a estas nuevas
                        tecnologías, con precios competitivos y soluciones acompañadas y
                        asesoradas en cada etapa del proceso.
                    </p>

                    <Link
                        href="/#servicios"
                        className="mt-8 inline-flex items-center gap-2 rounded-full border border-[#16213E]/20 px-6 py-3 text-xs font-bold tracking-wide text-[#16213E] hover:bg-[#16213E] hover:text-white transition-colors"
                    >
                        CONOCE NUESTROS SERVICIOS
                        <FaArrowRight className="text-xs" />
                    </Link>
                </div>

                <div className="relative w-full aspect-4/3 rounded-2xl overflow-hidden shadow-lg">
                    <Image
                        src={IMAGES.history}
                        alt="Técnico dental escaneando un modelo 3D en pantalla"
                        fill
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        className="object-cover"
                    />
                </div>
            </section>

            {/* LO QUE NOS DEFINE */}
            <section className="bg-[#F6F8FB] py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto">
                        <span className="text-xs font-bold tracking-widest text-[#17BEB6]">
                            LO QUE NOS DEFINE
                        </span>
                        <h2 className="mt-3 text-3xl md:text-4xl font-extrabold text-[#16213E]">
                            Tecnología, precisión y acompañamiento
                        </h2>
                    </div>

                    <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                        {DEFINE_CARDS.map(({ icon: Icon, title, description }) => (
                            <div
                                key={title}
                                className="bg-white rounded-2xl px-6 py-8 text-center shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#E7F1FE]">
                                    <Icon className="text-xl text-[#16213E]" />
                                </div>
                                <h3 className="mt-5 font-bold text-[#16213E]">{title}</h3>
                                <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                                    {description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* NUESTRO PROPÓSITO: Misión y Visión */}
            <section className="py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto">
                        <span className="text-xs font-bold tracking-widest text-[#17BEB6]">
                            NUESTRO PROPÓSITO
                        </span>
                        <h2 className="mt-3 text-3xl md:text-4xl font-extrabold text-[#16213E]">
                            Misión y Visión
                        </h2>
                    </div>

                    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Misión */}
                        <div className="rounded-2xl bg-[#EEF2FC] p-8 md:p-10">
                            <div className="flex items-center gap-4">
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#DCE6FB]">
                                    <FaMountain className="text-xl text-[#3A5AE0]" />
                                </div>
                                <span className="text-sm font-bold tracking-widest text-[#3A5AE0]">
                                    MISIÓN
                                </span>
                            </div>
                            <FaQuoteLeft className="mt-6 text-3xl text-[#C6D2F5]" />
                            <p className="mt-4 text-[#16213E] leading-relaxed">
                                Dar acceso a las personas a mejorar su vida a través de una
                                dentadura sana y conformes a las espectativas de ellas.
                            </p>
                        </div>

                        {/* Visión */}
                        <div className="rounded-2xl bg-[#E9F8F1] p-8 md:p-10">
                            <div className="flex items-center gap-4">
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#D3F0E1]">
                                    <FaEye className="text-xl text-[#1FA971]" />
                                </div>
                                <span className="text-sm font-bold tracking-widest text-[#1FA971]">
                                    VISIÓN
                                </span>
                            </div>
                            <FaQuoteLeft className="mt-6 text-3xl text-[#BFE9D6]" />
                            <p className="mt-4 text-[#16213E] leading-relaxed">
                                Ser referentes en tecnología y asesoría odontológica, invertir
                                en tecnologías para serlas accesible a las personas.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA: Transformamos sonrisas */}
            {/* CTA: Transformamos sonrisas */}
<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24">
    <div className="relative overflow-hidden rounded-2xl bg-[#0A1730] grid grid-cols-1 md:grid-cols-2">
        <div className="relative z-10 p-8 md:p-12 flex flex-col justify-center">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-snug">
                Transformamos sonrisas
                <br />
                con tecnología y pasión
            </h2>
            <span className="mt-4 h-1 w-16 rounded-full bg-[#17C3BE]" />
            <p className="mt-5 max-w-md text-sm text-white/70 leading-relaxed">
                Trabajamos cada día para entregar soluciones dentales que
                combinan arte, ciencia y tecnología, siempre con el foco en
                mejorar la calidad de vida de nuestros pacientes.
            </p>
            <Link
                href="/contacto"
                className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-[#17C3BE] px-6 py-3 text-xs font-bold tracking-wide text-[#0A1730] hover:opacity-90 transition-opacity"
            >
                HABLEMOS DE TU CASO
                <FaArrowRight className="text-xs" />
            </Link>
        </div>

        <div className="relative min-h-65 md:min-h-full">
            <Image
                src={IMAGES.cta}
                alt="Sonrisa con dentadura sana y natural"
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
            />
            {/* Degradado lateral fino: solo cubre 1/8 del ancho, se une hacia el texto */}
            <div className="absolute inset-0 bg-linear-to-r from-[#0A1730] from-0% via-[#0A1730]/70 via-6% to-transparent to-[12.5%] pointer-events-none" />
        </div>
    </div>
</section>

            {/* TRUST BAR */}
            <section className="border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {TRUST_ITEMS.map(({ icon: Icon, title, description }) => (
                        <div key={title} className="flex items-start gap-3">
                            <Icon className="mt-1 text-xl text-[#16213E] shrink-0" />
                            <div>
                                <h3 className="font-bold text-[#16213E] text-sm">{title}</h3>
                                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                                    {description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}
