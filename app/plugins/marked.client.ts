// plugins/marked.client.ts
// marked se importa directamente en el componente,
// este plugin es solo para confirmar que está disponible en cliente.
// Si necesitas configuración global de marked, hazla aquí.

import { marked } from 'marked'

export default defineNuxtPlugin(() => {
  // Configuración global de marked
  marked.setOptions({
    breaks: true,
    gfm: true,
  })
})
