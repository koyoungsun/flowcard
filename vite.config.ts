import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  appType: "spa", // ✅ SPA 새로고침 에러 방지
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    port: 5173,
    fs: { strict: false },
    hmr: {
      protocol: "ws",
      host: "localhost",
      port: 5173,
      overlay: false, // ✅ 에러 오버레이 완전 비활성화
    },
    watch: {
      usePolling: true, // ✅ macOS fs 이벤트 문제 해결
      interval: 300,
    },
  },
  optimizeDeps: {
    exclude: ["fsevents"], // ✅ Mac 파일시스템 전용 모듈 제외
  },
});