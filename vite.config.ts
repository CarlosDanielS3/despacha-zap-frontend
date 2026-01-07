import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    allowedHosts: [
      "e4ae70ae22e4.ngrok-free.app",
      ".ngrok-free.app",
      ".ngrok.io",
      "localhost"
    ],
    proxy: {
      '/api': {
        target: `https://${import.meta.env.VITE_API_DOMAIN || 'your-api-gateway.execute-api.region.amazonaws.com'}/production`,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            // Add x-api-key header from environment variable (hidden from browser)
            const apiKey = import.meta.env.VITE_API_KEY;
            if (apiKey) {
              proxyReq.setHeader('x-api-key', apiKey);
            }
          });
        },
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
