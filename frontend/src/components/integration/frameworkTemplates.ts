/**
 * Framework Integration Templates
 * Her framework için entegrasyon kodu template'leri
 */

// ============================================
// Types
// ============================================

export interface FrameworkInfo {
    id: string;
    name: string;
    icon: string;
    file: string;
    language: string;
}

export interface FrameworkTemplate {
    id: string;
    info: FrameworkInfo;
    getCode: (clientId: string, apiUrl: string) => string;
}

// ============================================
// Framework Configurations
// ============================================

export const FRAMEWORKS: FrameworkInfo[] = [
    { id: 'html', name: 'HTML', icon: '🌐', file: 'index.html', language: 'html' },
    { id: 'react', name: 'React', icon: '⚛️', file: 'public/index.html', language: 'html' },
    { id: 'vue', name: 'Vue', icon: '🟢', file: 'public/index.html', language: 'html' },
    { id: 'nextjs', name: 'Next.js', icon: '▲', file: 'app/layout.tsx', language: 'tsx' },
    { id: 'angular', name: 'Angular', icon: '🅰️', file: 'src/index.html', language: 'html' },
    { id: 'nuxt', name: 'Nuxt', icon: '💚', file: 'nuxt.config.ts', language: 'typescript' },
];

// ============================================
// Template Generators
// ============================================

export const getScriptTag = (clientId: string, apiUrl: string): string =>
    `<script 
    src="${apiUrl}/pulse.js" 
    data-client-id="${clientId}"
    async>
</script>`;

const templates: Record<string, (clientId: string, apiUrl: string) => string> = {
    html: (clientId, apiUrl) =>
        `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Website</title>
    
    <!-- PulseMetric Analytics -->
    ${getScriptTag(clientId, apiUrl)}
</head>
<body>
    <!-- Your content -->
</body>
</html>`,

    react: (clientId, apiUrl) =>
        `<!-- public/index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>React App</title>
    
    <!-- PulseMetric Analytics -->
    ${getScriptTag(clientId, apiUrl)}
</head>
<body>
    <div id="root"></div>
</body>
</html>`,

    vue: (clientId, apiUrl) =>
        `<!-- public/index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vue App</title>
    
    <!-- PulseMetric Analytics -->
    ${getScriptTag(clientId, apiUrl)}
</head>
<body>
    <div id="app"></div>
</body>
</html>`,

    nextjs: (clientId, apiUrl) =>
        `// app/layout.tsx
import Script from 'next/script';

export default function RootLayout({ 
    children 
}: { 
    children: React.ReactNode 
}) {
    return (
        <html lang="en">
            <head>
                <Script 
                    src="${apiUrl}/pulse.js"
                    data-client-id="${clientId}"
                    strategy="afterInteractive"
                />
            </head>
            <body>{children}</body>
        </html>
    );
}`,

    angular: (clientId, apiUrl) =>
        `<!-- src/index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Angular App</title>
    <base href="/">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    
    <!-- PulseMetric Analytics -->
    ${getScriptTag(clientId, apiUrl)}
</head>
<body>
    <app-root></app-root>
</body>
</html>`,

    nuxt: (clientId, apiUrl) =>
        `// nuxt.config.ts
export default defineNuxtConfig({
    app: {
        head: {
            script: [
                {
                    src: '${apiUrl}/pulse.js',
                    'data-client-id': '${clientId}',
                    async: true
                }
            ]
        }
    }
});`,
};

// ============================================
// Exports
// ============================================

export const getFrameworkCode = (
    frameworkId: string,
    clientId: string,
    apiUrl: string = 'https://api.pulsemetric.com'
): string => {
    const template = templates[frameworkId];
    if (!template) {
        return templates.html(clientId, apiUrl);
    }
    return template(clientId, apiUrl);
};

export const getFrameworkById = (id: string): FrameworkInfo | undefined =>
    FRAMEWORKS.find(f => f.id === id);
