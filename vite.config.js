import { defineConfig } from 'vite'
import esLintPlugin from 'vite-plugin-eslint'
import { resolve } from 'path'
import fs from 'fs'

export default defineConfig({
	plugins: [esLintPlugin({ cache: false })],
	server: {
		https: {
			key: fs.readFileSync('./key.pem'),
			cert: fs.readFileSync('./cert.pem'),
		},
		host: '0.0.0.0',
		cors: '*',
		port: 3000,
		strictPort: true,
	},
	build: {
		minify: true,
		manifest: false,
		assetsDir: '',
		cssCodeSplit: false,
		rollupOptions: {
			input: {
				main: resolve(__dirname, 'src/scripts/main.js'),
				home: resolve(__dirname, 'src/scripts/home/home.js'),
				global: resolve(__dirname, 'src/scripts/global/index.js'),
			},
			output: {
				entryFileNames: '[name].js',
				chunkFileNames: '[name]-[hash].js',
				assetFileNames: '[name].[ext]',
				format: 'es',
				inlineDynamicImports: false,
			},
			external: ['jquery'],
		},
	},
	publicDir: 'src/assets',
})