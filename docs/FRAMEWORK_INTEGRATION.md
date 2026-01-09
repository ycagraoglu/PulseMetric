# PulseMetric Framework Entegrasyon Rehberi

## 📍 Genel Kural

pulse.js **tüm framework'lerde aynı mantıkla çalışır**:
- Script bir kere yüklenir
- SPA route değişikliklerini otomatik yakalar (pushState/popstate)
- Manuel event göndermek için `PulseMetric.track()` kullanılır

---

## 🔵 React.js

### Yöntem 1: public/index.html (Önerilen)

```html
<!-- public/index.html -->
<!DOCTYPE html>
<html>
<head>
    <title>My React App</title>
    <!-- PulseMetric - HEAD içinde, diğer script'lerden önce -->
    <script 
        src="https://api.pulsemetric.com/pulse.js" 
        data-client-id="YOUR_TENANT_ID"
        async>
    </script>
</head>
<body>
    <div id="root"></div>
</body>
</html>
```

### Yöntem 2: useEffect Hook

```jsx
// src/App.jsx
import { useEffect } from 'react';

function App() {
    useEffect(() => {
        // Script'i dinamik olarak yükle
        const script = document.createElement('script');
        script.src = 'https://api.pulsemetric.com/pulse.js';
        script.setAttribute('data-client-id', 'YOUR_TENANT_ID');
        script.async = true;
        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, []);

    return <div>...</div>;
}
```

### Custom Event Gönderme

```jsx
// src/components/SignupButton.jsx
function SignupButton() {
    const handleClick = () => {
        // PulseMetric global objesi
        if (window.PulseMetric) {
            window.PulseMetric.track('signup_click', { 
                plan: 'premium' 
            });
        }
    };

    return <button onClick={handleClick}>Sign Up</button>;
}
```

---

## 🟢 Vue.js

### Yöntem 1: public/index.html (Önerilen)

```html
<!-- public/index.html -->
<!DOCTYPE html>
<html>
<head>
    <script 
        src="https://api.pulsemetric.com/pulse.js" 
        data-client-id="YOUR_TENANT_ID"
        async>
    </script>
</head>
<body>
    <div id="app"></div>
</body>
</html>
```

### Yöntem 2: Vue Plugin

```javascript
// src/plugins/pulsemetric.js
export default {
    install(app, options) {
        const script = document.createElement('script');
        script.src = options.src || 'https://api.pulsemetric.com/pulse.js';
        script.setAttribute('data-client-id', options.clientId);
        script.async = true;
        document.head.appendChild(script);

        // Global property olarak ekle
        app.config.globalProperties.$pulse = {
            track: (event, data) => window.PulseMetric?.track(event, data),
            identify: (userId, traits) => window.PulseMetric?.identify(userId, traits)
        };
    }
};

// main.js
import { createApp } from 'vue';
import PulseMetric from './plugins/pulsemetric';

const app = createApp(App);
app.use(PulseMetric, { 
    clientId: 'YOUR_TENANT_ID' 
});
app.mount('#app');
```

### Composable (Vue 3)

```javascript
// src/composables/usePulseMetric.js
export function usePulseMetric() {
    const track = (event, data) => {
        window.PulseMetric?.track(event, data);
    };

    const identify = (userId, traits) => {
        window.PulseMetric?.identify(userId, traits);
    };

    return { track, identify };
}

// Component'te kullanım
<script setup>
import { usePulseMetric } from '@/composables/usePulseMetric';

const { track } = usePulseMetric();

const handleClick = () => {
    track('button_click', { buttonId: 'cta' });
};
</script>
```

---

## ⚫ Next.js

### App Router (Next.js 13+)

```tsx
// app/layout.tsx
import Script from 'next/script';

export default function RootLayout({ children }) {
    return (
        <html>
            <head>
                <Script 
                    src="https://api.pulsemetric.com/pulse.js"
                    data-client-id="YOUR_TENANT_ID"
                    strategy="afterInteractive"
                />
            </head>
            <body>{children}</body>
        </html>
    );
}
```

### Pages Router (Next.js 12 ve öncesi)

```tsx
// pages/_app.tsx
import Script from 'next/script';

function MyApp({ Component, pageProps }) {
    return (
        <>
            <Script 
                src="https://api.pulsemetric.com/pulse.js"
                data-client-id="YOUR_TENANT_ID"
                strategy="afterInteractive"
            />
            <Component {...pageProps} />
        </>
    );
}

export default MyApp;
```

### TypeScript Declaration

```typescript
// types/pulsemetric.d.ts
declare global {
    interface Window {
        PulseMetric: {
            track: (event: string, data?: Record<string, any>) => void;
            identify: (userId: string, traits?: Record<string, any>) => void;
            getVisitorId: () => string;
            getSessionId: () => string;
            consent: (granted: boolean) => void;
            flush: () => void;
        };
    }
}

export {};
```

---

## 🔴 Angular

### angular.json

```json
{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "options": {
            "scripts": []  // Boş bırak, index.html'e ekle
          }
        }
      }
    }
  }
}
```

### src/index.html (Önerilen)

```html
<!DOCTYPE html>
<html>
<head>
    <script 
        src="https://api.pulsemetric.com/pulse.js" 
        data-client-id="YOUR_TENANT_ID"
        async>
    </script>
</head>
<body>
    <app-root></app-root>
</body>
</html>
```

### Angular Service

```typescript
// src/app/services/pulsemetric.service.ts
import { Injectable } from '@angular/core';

declare global {
    interface Window {
        PulseMetric: any;
    }
}

@Injectable({
    providedIn: 'root'
})
export class PulseMetricService {
    track(event: string, data?: Record<string, any>): void {
        window.PulseMetric?.track(event, data);
    }

    identify(userId: string, traits?: Record<string, any>): void {
        window.PulseMetric?.identify(userId, traits);
    }

    getVisitorId(): string | null {
        return window.PulseMetric?.getVisitorId() || null;
    }
}

// Component'te kullanım
@Component({...})
export class MyComponent {
    constructor(private pulse: PulseMetricService) {}

    onClick() {
        this.pulse.track('button_click', { id: 'cta' });
    }
}
```

---

## 🟣 Nuxt.js

### nuxt.config.ts

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
    app: {
        head: {
            script: [
                {
                    src: 'https://api.pulsemetric.com/pulse.js',
                    'data-client-id': 'YOUR_TENANT_ID',
                    async: true
                }
            ]
        }
    }
});
```

### Plugin (Opsiyonel)

```typescript
// plugins/pulsemetric.client.ts
export default defineNuxtPlugin(() => {
    return {
        provide: {
            pulse: {
                track: (event: string, data?: object) => 
                    window.PulseMetric?.track(event, data),
                identify: (userId: string, traits?: object) => 
                    window.PulseMetric?.identify(userId, traits)
            }
        }
    };
});

// Component'te kullanım
const { $pulse } = useNuxtApp();
$pulse.track('page_view');
```

---

## 📍 Özet: Nereye Eklenmeli?

| Framework | Konum | Dosya |
|-----------|-------|-------|
| **React** | `<head>` içinde | `public/index.html` |
| **Vue** | `<head>` içinde | `public/index.html` |
| **Next.js** | Layout/App | `app/layout.tsx` veya `_app.tsx` |
| **Angular** | `<head>` içinde | `src/index.html` |
| **Nuxt** | Config | `nuxt.config.ts` |

---

## ⚡ SPA Desteği

pulse.js **otomatik olarak** SPA route değişikliklerini yakalar:
- `history.pushState()` - React Router, Vue Router, etc.
- `history.replaceState()` - Soft navigation
- `popstate` event - Geri/ileri butonları

**Hiçbir ekstra kod gerekmez!** 🎉
