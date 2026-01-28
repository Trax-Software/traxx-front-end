import './globals.css'
import {ReactNode} from 'react'
import {AuthProvider} from "@/context/AuthContext";


export default function RootLayout({children}: { children: ReactNode }) {
    return (
        <>
            <html lang="pt-BR">
            <body className="min-h-screen">
            <AuthProvider>
                <main>
                    {children}
                </main>
            </AuthProvider>
            </body>
            </html>
        </>
    )
}
