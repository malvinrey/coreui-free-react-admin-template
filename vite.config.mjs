import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import autoprefixer from 'autoprefixer'

export default defineConfig(() => {
  return {
    base: '/',
    build: {
      outDir: 'build',
    },
    css: {
      postcss: {
        plugins: [
          autoprefixer({}), // add options if needed
        ],
      },
    },
    esbuild: {
      loader: 'jsx',
      include: /src\/.*\.jsx?$/,
      exclude: [],
    },
    optimizeDeps: {
      force: true,
      esbuildOptions: {
        loader: {
          '.js': 'jsx',
        },
      },
    },
    plugins: [react()],
    resolve: {
      alias: [
        { find: 'src', replacement: '/src' },
        { find: 'components', replacement: '/src/components' },
        { find: 'services', replacement: '/src/services' },
        { find: 'context', replacement: '/src/context' },
        { find: 'views', replacement: '/src/views' },
        { find: 'layout', replacement: '/src/layout' },
        { find: 'assets', replacement: '/src/assets' },
        { find: 'scss', replacement: '/src/scss' },
      ],
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.scss'],
    },
    server: {
      port: 3000,
      proxy: {
        // https://vitejs.dev/config/server-options.html
      },
    },
  }
})
