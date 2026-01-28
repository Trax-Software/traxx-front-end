import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
    return (
        <main
            style={{
                minHeight: "100vh",
                display: "grid",
                placeItems: "center",
                background: "linear-gradient(135deg, #FD8F06, #990099)",
                padding: 24,
            }}
        >
            <section
                style={{
                    width: "100%",
                    maxWidth: 420,
                    background: "rgba(255,255,255,0.92)",
                    borderRadius: 20,
                    padding: "40px 32px",
                    boxShadow: "0 24px 48px -12px rgba(0,0,0,.18)",
                }}
            >
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                    <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.5 }}>TRAX</div>
                    <h1 style={{ marginTop: 12, fontSize: 22, fontWeight: 800 }}>Bem-vindo(a) de volta</h1>
                    <p style={{ marginTop: 6, opacity: 0.8 }}>Acesse o painel administrativo</p>
                </div>

                <LoginForm />

                <footer style={{ marginTop: 24, textAlign: "center", fontSize: 12, opacity: 0.6 }}>
                    © TRAX Marketing Solutions
                </footer>
            </section>
        </main>
    );
}
