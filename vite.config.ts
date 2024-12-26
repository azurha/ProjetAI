import { defineConfig } from 'vite'
import adonisjs from '@adonisjs/vite/client'
import UnoCSS from 'unocss/vite'
import presetUno from '@unocss/preset-uno'

export default defineConfig({
  plugins: [
    adonisjs({
      /**
       * Entrypoints of your application. Each entrypoint will
       * result in a separate bundle.
       */
      entrypoints: ['resources/css/app.css', 'resources/js/app.js'],

      /**
       * Paths to watch and reload the browser on file change
       */
      reload: ['resources/views/**/*.edge'],
    }),
    UnoCSS({
      presets: [
        presetUno()
      ],
    }),
  ],
})
