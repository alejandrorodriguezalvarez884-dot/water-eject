# Ficha de App Store, lista para copiar

App en App Store Connect: **PulseTone: Speaker Cleaner** (ID 6823346991). Los textos salen de `fastlane/metadata/`; las capturas, de `fastlane/screenshots/`.

## 1. Información de la app (General → App Information)

- **Subtítulo (en-US):** `Clear water & dust with sound`
- **Categoría principal:** Utilidades (Utilities). Secundaria: ninguna.
- **Derechos de contenido:** «No, no contiene, muestra ni accede a contenido de terceros».
- **URL de la política de privacidad:** `https://alejandrorodriguezalvarez884-dot.github.io/water-eject/privacy.html`
- Guarda (Save).

## 2. Precio y disponibilidad (Pricing and Availability)

- Precio: **0 (Gratis)**, todos los países. Guarda.

## 3. Privacidad de la app (App Privacy)

- Get Started → «¿Recopilas datos de esta app?» → **No, no recopilamos datos**. Guarda y pulsa **Publish**.

## 4. Clasificación por edad (App Information → Age Rating → Edit)

- Responde **Ninguno / No** a todo (sin violencia, sin contenido sexual, sin web abierta, sin chat, sin funciones de redes sociales, sin compras). Resultado: **4+**.

## 5. Versión 1.0 (Distribution → iOS App → 1.0 Prepare for Submission)

- **Versión:** cámbiala de `1.0` a **`1.0.0`** (tiene que coincidir con el build).
- **Copyright:** `2026 Alejandro Rodríguez Álvarez`
- **Build:** cuando termine de procesarse (10-30 min tras subirlo, te llega un correo), pulsa «Add Build» y elige `1.0.0 (1)`. Cifrado: ya está declarado en el binario (`ITSAppUsesNonExemptEncryption = NO`).
- **Capturas iPhone 6,9":** arrastra las 4 `*_iphone69.jpg` de `fastlane/screenshots/en-US/` en orden (1_water, 2_running, 3_dust, 4_done). App Store Connect genera el resto de tamaños a partir de estas; si te pide 6,5", usa las `*_iphone65.jpg`.
- **Información para la revisión (App Review Information):** sin inicio de sesión (desmarca «Sign-in required»), tu nombre, teléfono y correo de contacto, y en Notas:
```
Speaker Cleaner plays bundled, pre-generated audio files (low-frequency tones, 30 seconds each). It needs no account, no network access and no permissions. To test: tap the round Start button; a 30-second countdown runs while the selected sound plays. Switch between Water and Dust modes and between programs with the chips under the button. The vibration toggle is the phone icon in the top-right corner. The app does not claim to repair liquid damage; the in-app disclaimer and the description say so.
```
- **Publicación:** «Manually release» o «Automatically release», como prefieras.

### Textos en inglés (en-US, idioma principal)

**Nombre**
```
PulseTone: Speaker Cleaner
```
**Subtítulo**
```
Clear water & dust with sound
```
**Texto promocional**
```
Splashed your phone? Play a low 165 Hz tone to help push water out of the speaker grille, or use bass hits to loosen surface dust.
```
**Palabras clave**
```
eject,water eject,165 hz,tone,wet,splash,muffled,audio,bass,low frequency,droplet,grille,clean
```
**URL de soporte**
```
https://alejandrorodriguezalvarez884-dot.github.io/water-eject/
```
**Descripción**
```
Speaker Cleaner plays low-frequency sounds that make your phone's speaker vibrate. That vibration can help push out water droplets after a splash and shake loose surface dust from the speaker grille.

WATER MODE
• Tone: a steady 165 Hz tone.
• Pulses: 165 Hz bursts with short pauses that help release stuck droplets.
• Sweep: moves between 100 and 300 Hz to find your speaker's resonance.

DUST MODE
• Shake: short, punchy bass hits that rattle the grille.
• Wide sweep: moves between 60 and 1500 Hz to reach the whole grille.

HOW TO USE IT
1. Turn the volume all the way up.
2. Hold the phone with the speaker facing down.
3. Tap Start. Each session lasts 30 seconds; repeat 2 or 3 times if needed.

FEATURES
• Optional vibration while the sound plays.
• Plays even with the silent switch on and keeps the screen awake during a session.
• Works offline. No account, no ads, no tracking and no data collected.
• Available in English and Spanish.

PLEASE NOTE
Speaker Cleaner can help with small amounts of water after a splash and with loose surface dust. It does not repair liquid damage, it does not dry the inside of your phone and it does not replace a physical clean. If your phone was submerged or still sounds muffled after a few sessions, let it dry and contact the manufacturer or an authorized service provider. Never insert pins, toothpicks or other objects into the speaker grille.
```

## 6. Español

Arriba a la derecha de la página de la versión, en el selector de idioma, añade **Spanish (Spain)** y **Spanish (Mexico)**. En cada uno pega estos textos y arrastra las capturas de `fastlane/screenshots/es-ES/` (sirven para los dos):

### Textos en español (es-ES y es-MX)

**Nombre**
```
PulseTone: Limpiar Altavoz
```
**Subtítulo**
```
Saca agua y polvo con sonido
```
**Texto promocional**
```
¿Se te ha mojado el móvil? Reproduce un tono grave de 165 Hz para ayudar a sacar el agua de la rejilla del altavoz, o usa golpes de graves para soltar el polvo.
```
**Palabras clave**
```
expulsar agua,expulsar,165 hz,tono,mojado,salpicadura,sonido apagado,graves,bajos,gotas,rejilla
```
**URL de soporte**
```
https://alejandrorodriguezalvarez884-dot.github.io/water-eject/
```
**Descripción**
```
Limpiar Altavoz reproduce sonidos graves que hacen vibrar el altavoz del móvil. Esa vibración puede ayudar a expulsar gotas de agua tras una salpicadura y a soltar el polvo superficial de la rejilla.

MODO AGUA
• Tono: un tono continuo de 165 Hz.
• Pulsos: ráfagas de 165 Hz con pausas cortas que ayudan a soltar gotas pegadas.
• Barrido: recorre de 100 a 300 Hz para dar con la resonancia de tu altavoz.

MODO POLVO
• Sacudida: golpes graves y secos que hacen vibrar la rejilla.
• Barrido amplio: recorre de 60 a 1500 Hz para llegar a toda la rejilla.

CÓMO SE USA
1. Sube el volumen al máximo.
2. Pon el móvil con el altavoz mirando hacia abajo.
3. Toca Empezar. Cada sesión dura 30 segundos; repite 2 o 3 veces si hace falta.

FUNCIONES
• Vibración opcional mientras suena el sonido.
• Suena aunque el interruptor de silencio esté activado y mantiene la pantalla encendida durante la sesión.
• Funciona sin conexión. Sin cuenta, sin anuncios, sin rastreo y sin recoger datos.
• En español e inglés.

TEN EN CUENTA
Limpiar Altavoz puede ayudar con un poco de agua tras una salpicadura y con polvo suelto en la superficie. No repara daños por líquidos, no seca el interior del móvil y no sustituye una limpieza física. Si el móvil se ha sumergido o sigue sonando apagado después de varias sesiones, déjalo secar y contacta con el fabricante o con un servicio técnico autorizado. No metas nunca agujas, palillos ni otros objetos en la rejilla del altavoz.
```

## 7. Enviar

Pulsa **Add for Review** → **Submit to App Review**.
