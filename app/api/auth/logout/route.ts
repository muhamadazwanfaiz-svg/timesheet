import { NextResponse } from "next/server";

export async function GET() {
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Logged Out - Timesheet</title>
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-slate-50 h-screen flex items-center justify-center font-sans">
        <div class="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 max-w-md w-full text-center space-y-6">
            <div class="h-16 w-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
            </div>
            
            <h1 class="text-2xl font-bold text-slate-900">Signed Out</h1>
            <p class="text-slate-500">You have been successfully logged out of the Tutor Dashboard.</p>
            
            <a href="/" class="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200">
                Return to Home
            </a>
            
            <p class="text-xs text-slate-400 mt-4">
                (If your browser asks for a password again, simply click "Cancel" to finish.)
            </p>
        </div>
    </body>
    </html>
    `;

    return new NextResponse(html, {
        status: 401,
        headers: {
            "WWW-Authenticate": 'Basic realm="Secure Area"',
            "Content-Type": "text/html",
        },
    });
}
