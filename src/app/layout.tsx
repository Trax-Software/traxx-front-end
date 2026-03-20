import './globals.css'
import {ReactNode} from 'react'
import {AuthProvider} from "@/context/AuthContext";
import {ThemeProvider} from "@/contexts/theme-context";


export default function RootLayout({children}: { children: ReactNode }) {
    return (
        <>
            <html lang="pt-BR" data-theme="light">
            <body className="min-h-screen">
            <ThemeProvider>
                <AuthProvider>
                    <main>
                        {children}
                    </main>
                </AuthProvider>
            </ThemeProvider>
            </body>
            </html>
        </>
    )
}
