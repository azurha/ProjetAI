import { defineConfig, presetUno, presetAttributify, presetIcons } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(), presetAttributify(), presetIcons()
  ],
  content: {
    pipeline: {
      include: [
        'resources/views/**/*.edge',
        'resources/js/**/*.js',
        'resources/js/**/*.ts',
        'resources/css/**/*.css',
      ],
    },
    filesystem: ['resources/views/**/*.edge'],
  },
}) 