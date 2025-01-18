import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

export default defineConfig({
  plugins: [react(), TanStackRouterVite()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

// vite.config.ts
// import { defineConfig } from 'vite'
// import viteReact from '@vitejs/plugin-react'
// import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [
//     TanStackRouterVite(),
//     viteReact(),
//     // ...,
//   ],
// })
