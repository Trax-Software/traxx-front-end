import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const token = req.cookies.getAll().find((c) => c.name === "trax_token")?.value;

    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
    const isLoginRoute = req.nextUrl.pathname.startsWith("/login");

    if (isAdminRoute && !token) {
        const url = req.nextUrl.clone();
        url.pathname = "/login";
        return NextResponse.redirect(url);
    }

    if (isLoginRoute && token) {
        const url = req.nextUrl.clone();
        url.pathname = "/admin";
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/login"],
};
