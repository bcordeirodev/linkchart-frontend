// This file exists only to prevent build errors
// The project uses App Router (src/app), not Pages Router
// This _document.tsx should not be used and can be removed once build issues are resolved

import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html>
            <Head />
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}
