import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
	base: "/moby/",
  server: {
    host:"136.27.55.214",
    port:8080
  },
  plugins: [react()],
})
