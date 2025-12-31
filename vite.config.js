import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "164.90.205.5",
    port: 4174,
    // host: "10.10.7.47",
    // port: 3000,
  },
});
