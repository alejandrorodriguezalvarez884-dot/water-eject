# Water Eject

App móvil (iOS y Android) que expulsa el agua del altavoz con un tono grave de 165 Hz, la misma técnica que usa el bloqueo por agua del Apple Watch. Español e inglés según el idioma del dispositivo.

## Modos

| Modo | Sonido | Archivo |
|---|---|---|
| Tono | 165 Hz continuo | `assets/sounds/tone-165.wav` |
| Pulsos | Ráfagas de 165 Hz (0,6 s sonando, 0,25 s en silencio) | `assets/sounds/pulse-165.wav` |
| Barrido | 100 → 300 → 100 Hz en ciclos de 4 s | `assets/sounds/sweep.wav` |

Cada sesión dura 30 s. Los WAV se generan con `node scripts/generate-tones.mjs`. Si cambias la duración, actualiza también `DURATION_S` en `src/modes.ts`.

## Desarrollo

```bash
npm install
npx expo start          # escanea el QR con Expo Go
npx expo start --web    # vista rápida en el navegador
npx tsc --noEmit && npx expo lint
```

## Estructura

- `App.tsx`: pantalla principal
- `src/useWaterEject.ts`: reproducción, temporizador, vibración y pantalla siempre encendida
- `src/EjectButton.tsx`: botón con ondas animadas
- `src/i18n.ts`: textos en español e inglés
- `docs/privacy.html`: política de privacidad (para GitHub Pages)

## Publicación

Las builds se compilan en la nube con EAS (`npx eas-cli@latest build`), así que no hace falta un Mac para iOS. El identificador del paquete es `com.alejandrorodriguez.watereject`; cámbialo en `app.json` antes de la primera build si quieres otro.
