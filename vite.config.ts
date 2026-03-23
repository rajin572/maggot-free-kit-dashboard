import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// const BACKEND_URL = "http://10.10.10.32:8010";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // server: {
  //   proxy: {
  //     "/api": {
  //       target: BACKEND_URL,
  //       changeOrigin: true,
  //     },
  //     "/uploads": {
  //       target: BACKEND_URL,
  //       changeOrigin: true,
  //     },
  //   },
  // },
  esbuild: {
    drop: ["console", "debugger"],
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-redux": ["@reduxjs/toolkit", "react-redux"],
          "vendor-recharts": ["recharts"],
          "vendor-lucide": ["lucide-react"],
          "vendor-form": ["react-hook-form", "@hookform/resolvers", "zod"],
          "vendor-radix": [
            "@radix-ui/react-dialog",
            "@radix-ui/react-tooltip",
            "@radix-ui/react-select",
            "@radix-ui/react-collapsible",
            "@radix-ui/react-separator",
          ],
          "vendor-misc": ["dayjs", "sonner", "js-cookie"],
          "vendor-socket": ["socket.io-client"],
          "vendor-swiper": ["swiper"],
          "vendor-icons": ["react-icons"],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
});
