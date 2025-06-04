import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react(), tailwindcss()],
    define: {
      "process.env.VITE_SECURE_LOCAL_STORAGE_HASH_KEY": JSON.stringify(
        env.VITE_SECURE_LOCAL_STORAGE_HASH_KEY
      ),
      "process.env.VITE_SECURE_LOCAL_STORAGE_PREFIX": JSON.stringify(
        env.VITE_SECURE_LOCAL_STORAGE_PREFIX
      ),
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
