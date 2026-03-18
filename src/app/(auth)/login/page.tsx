import { LoginForm } from "@/components/auth/LoginForm";
import Image from "next/image";

export default function LoginPage() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-[#0F0F14] p-6 relative overflow-hidden">
            
            {/* Orb Laranja - Topo Esquerdo */}
            <div className="absolute top-[-15%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-40 mix-blend-screen pointer-events-none animate-pulse-ring"
                 style={{
                     background: "radial-gradient(circle, rgba(253,143,6,0.2) 0%, transparent 60%)",
                     filter: "blur(80px)"
                 }} 
            />
            
            {/* Orb Magenta - Fundo Direito */}
            <div className="absolute bottom-[-20%] right-[-10%] w-[700px] h-[700px] rounded-full opacity-30 mix-blend-screen pointer-events-none"
                 style={{
                     background: "radial-gradient(circle, rgba(153,0,153,0.2) 0%, transparent 60%)",
                     filter: "blur(90px)"
                 }} 
            />

            {/* Container Central (Glassmorphism) */}
            <section className="animate-scale w-full max-w-[420px] relative z-10">
                <div className="bg-[#1C1C25]/80 backdrop-blur-xl border border-white/5 shadow-2xl rounded-3xl p-10 flex flex-col items-center">
                    
                    {/* Logo Branca */}
                    <div className="mb-8 w-full flex justify-center">
                        <Image
                            src="/brand/Logo_Trax_horizontal-branco.png"
                            alt="TRAX Soluções de Marketing"
                            width={160}
                            height={50}
                            className="object-contain"
                            priority
                        />
                    </div>

                    {/* Títulos */}
                    <div className="text-center w-full mb-8">
                        <h1 className="font-title text-2xl text-white font-bold mb-1 tracking-tight">
                            Bem-vindo(a) de volta
                        </h1>
                        <p className="text-[14px] text-white/50">
                            Acesse o seu painel de marketing com IA
                        </p>
                    </div>

                    {/* Formulário (LoginComponent) */}
                    <div className="w-full">
                        <LoginForm />
                    </div>

                </div>

                {/* Footer Discreto fora do card */}
                <footer className="mt-8 text-center text-xs text-white/30 font-medium tracking-wide">
                    © {new Date().getFullYear()} TRAX Soluções de Marketing
                </footer>
            </section>
        </main>
    );
}
