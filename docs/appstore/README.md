# Publicar en App Store

Todo lo que se puede preparar sin tu cuenta de Apple ya está en el repo. Esta lista dice qué hay y qué te toca hacer a ti.

## Lo que ya está listo

| Qué | Dónde |
|---|---|
| Bundle ID `com.alejandrorodriguez.speakercleaner`, versión `1.0.0`, build `1` | `app.json` |
| Icono 1024×1024 sin transparencia (Xcode genera el resto de tamaños) | `assets/icon.png` |
| Launch screen (fondo azul oscuro con el logo) | plugin `expo-splash-screen` en `app.json` |
| `ITSAppUsesNonExemptEncryption = false` (no usa cifrado propio) | `app.json` → `ios.infoPlist` |
| Sin permisos: no usa micrófono, cámara, ubicación ni red | plugin `expo-audio` con `microphonePermission: false` |
| Privacy manifest (`PrivacyInfo.xcprivacy`): sin rastreo, sin datos recogidos, APIs con motivo declarado | `app.json` → `ios.privacyManifests` |
| Arranque con UIScene (obligatorio con el SDK de iOS 27) | `plugins/withSceneDelegate.js` |
| Nombre, subtítulo, descripción, keywords, texto promocional, URLs (en-US, es-ES, es-MX) | `fastlane/metadata/` |
| Notas para el revisor | `fastlane/metadata/review_information/notes.txt` |
| Capturas 6,9" (1320×2868) y 6,5" (1284×2778) en inglés y español | `fastlane/screenshots/` |
| Páginas de soporte y privacidad | `docs/index.html`, `docs/privacy.html` |

Las capturas se sacaron del simulador iPhone 18 Pro (1206×2622) y se escalaron a los tamaños de App Store; la proporción es la misma. es-MX no tiene capturas propias: App Store Connect usa las del idioma principal o puedes subir las de `es-ES`.

## Lo que te toca hacer

1. **Cuenta de Apple Developer** (99 $/año) si aún no la tienes: <https://developer.apple.com/programs/>.
2. **Publicar las páginas de soporte y privacidad.** En GitHub → Settings → Pages, elige la rama `main` y la carpeta `/docs`. Las URL quedan así (son las que ya están en `fastlane/metadata`):
   - Soporte: `https://alejandrorodriguezalvarez884-dot.github.io/water-eject/`
   - Privacidad: `https://alejandrorodriguezalvarez884-dot.github.io/water-eject/privacy.html`
3. **Crear la app en App Store Connect** (Apps → + → Nueva app): plataforma iOS, idioma principal Inglés (EE. UU.), bundle ID `com.alejandrorodriguez.speakercleaner`, SKU p. ej. `speaker-cleaner`. Si el nombre `Speaker Cleaner: Water & Dust` ya está cogido, cámbialo en `fastlane/metadata/*/name.txt` (máx. 30 caracteres).
4. **Compilar y subir el binario.** Dos caminos:
   - **EAS (recomendado, ya configurado en `eas.json`):**
     ```bash
     npx eas-cli@latest login
     npx eas-cli@latest build --profile production --platform ios
     npx eas-cli@latest submit --platform ios --latest
     ```
     EAS te pedirá iniciar sesión con tu Apple ID y creará el certificado de distribución y el perfil de aprovisionamiento.
   - **Xcode local:**
     ```bash
     npx expo prebuild -p ios --clean
     open ios/SpeakerCleaner.xcworkspace
     ```
     En el target SpeakerCleaner → Signing & Capabilities elige tu Team, luego Product → Archive → Distribute App → App Store Connect.
5. **Rellenar en App Store Connect** lo que no va en el binario:
   - **Privacidad de la app:** «No recopilamos datos de esta app» (Data Not Collected).
   - **Clasificación por edad:** responde «Ninguno» a todo → 4+.
   - **Categoría:** Utilidades (`fastlane/metadata/primary_category.txt`).
   - **Precio:** Gratis.
   - Copia textos y capturas de `fastlane/` (o súbelos con `fastlane deliver` si usas fastlane).
6. **Enviar a revisión** cuando el build aparezca en TestFlight.

## Revisión (App Review Guidelines)

La redacción se ha cuidado para no prometer más de lo que hace la app:

- **2.3.1 / 2.3.7 (metadatos exactos):** la descripción dice «puede ayudar» con un poco de agua o polvo suelto y deja claro que no repara daños por líquidos, no seca el interior y no sustituye una limpieza física. Lo mismo dice el aviso dentro de la app.
- **5.2.5 (marcas de Apple):** ni la app ni la ficha mencionan el Apple Watch, el iPhone ni otras marcas de Apple (hay un test que lo comprueba en los textos de la app).
- **4.2 (funcionalidad mínima):** tiene dos modos, cinco programas de sonido, vibración opcional, consejos y está traducida. Si Apple la considerase demasiado simple, la respuesta habitual es añadir valor (p. ej. un test de altavoz o un historial), no cambiar textos.
- **5.1.1 (privacidad):** no recoge datos y no pide permisos; la política de privacidad lo dice.
