/**
 * middleware.ts — Proteção de rotas via cookie server-side
 * 
 * Executa ANTES de qualquer renderização, eliminando race conditions client-side.
 * - Rotas sem cookie → redirect para /login (independente da URL)
 * - Rota /login ou / com cookie válido → redirect para /admin
 */

import { NextRequest, NextResponse } from "next/server";

const AUTH_COOKIE = "trax_token";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get(AUTH_COOKIE)?.value;

    const isLoginPage = pathname === "/login";

    // Sem token e tentando acessar algo que não seja o login → vai para login
    if (!token && !isLoginPage) {
        const loginUrl = new URL("/login", request.url);
        if (pathname !== "/") {
            loginUrl.searchParams.set("next", pathname); // preserva a rota original
        }
        return NextResponse.redirect(loginUrl);
    }

    // Já autenticado tentando acessar login ou a home (/) → vai para admin
    if (token && (pathname === "/login" || pathname === "/")) {
        return NextResponse.redirect(new URL("/admin", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Aplica middleware em todas as rotas EXCETO:
         * - Arquivos estáticos (_next/static, _next/image, favicon, public/)
         * - API routes
         * - brand assets
         */
        "/((?!_next/static|_next/image|favicon.ico|brand/|api/).*)",
    ],
};
