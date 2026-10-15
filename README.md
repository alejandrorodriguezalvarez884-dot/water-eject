# Speaker Cleaner / Limpiar Altavoz

App móvil (iOS y Android) que limpia el altavoz con sonido: expulsa el **agua** con un tono grave de 165 Hz (la técnica del bloqueo por agua del Apple Watch) y suelta el **polvo** con golpes de graves y barridos de frecuencia. Español e inglés según el idioma del dispositivo, nombre de la app incluido.

## Programas

| Objetivo | Programa | Sonido | Archivo |
|---|---|---|---|
| Agua | Tono | 165 Hz continuo | `assets/sounds/water-tone.wav` |
| Agua | Pulsos | Ráfagas de 165 Hz (0,6 s sonando, 0,25 s en silencio) | `assets/sounds/water-pulse.wav` |
| Agua | Barrido | 100 → 300 → 100 Hz en ciclos de 4 s | `assets/sounds/water-sweep.wav` |
| Polvo | Sacudida | Golpes de 90 / 140 Hz saturados (0,3 s sonando, 0,15 s en silencio) | `assets/sounds/dust-shake.wav` |
| Polvo | Barrido amplio | 60 → 1500 → 60 Hz en ciclos de 6 s | `assets/sounds/dust-sweep.wav` |

Cada sesión dura 30 s. Los WAV se generan con `node scripts/generate-tones.mjs`. Si cambias la duración, actualiza también `DURATION_S` en `src/programs.ts`.

## Desarrollo

```bash
npm install
npx expo start          # escanea el QR con Expo Go
npx expo start --web    # vista rápida en el navegador
npx tsc --noEmit && npx expo lint
```

## Estructura

- `App.tsx`: pantalla principal
- `src/useCleaner.ts`: reproducción, temporizador, vibración y pantalla siempre encendida
- `src/components/`: botón con anillo de progreso, selector de agua/polvo, programas, consejos e iconos SVG
- `src/i18n.ts`: textos en español e inglés
- `src/theme.ts`: colores (azul para agua, ámbar para polvo)
- `languages/`: nombre de la app traducido para iOS y Android
- `scripts/generate-icons.mjs`: genera el icono, el splash y el favicon
- `docs/privacy.html`: política de privacidad (para GitHub Pages)

## Publicación

Las builds se compilan en la nube con EAS (`npx eas-cli@latest build`), así que no hace falta un Mac para iOS. El identificador del paquete es `com.alejandrorodriguez.speakercleaner`; cámbialo en `app.json` antes de la primera build si quieres otro.

## Builds

Los perfiles están en `eas.json`: `development` (development client, instalación interna), `preview` (APK de Android para instalar a mano) y `production` (tiendas; EAS sube el número de build solo en cada build).

```bash
npx eas-cli@latest login
npx eas-cli@latest build --profile preview --platform android      # APK de prueba
npx eas-cli@latest build --profile production --platform android   # AAB para Google Play
npx eas-cli@latest build --profile production --platform ios       # IPA para App Store / TestFlight
npx eas-cli@latest submit --platform android --latest
npx eas-cli@latest submit --platform ios --latest
```

La primera build de cada plataforma pide crear el proyecto en EAS y las credenciales (keystore de Android, certificados de Apple); deja que EAS las gestione. Para iOS hace falta una cuenta de Apple Developer. El perfil `development` necesita antes `npx expo install expo-dev-client`; después `npx expo start` abre la development build en vez de Expo Go.
