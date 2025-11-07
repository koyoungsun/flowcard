import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/styles/main.scss";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const auth = getAuth();
let appMounted = false;

/**
 * Firebase 인증 상태 확인 후 Vue mount
 * Splash 제거는 모든 리소스(CSS 포함) 로드 후 처리
 */
onAuthStateChanged(auth, () => {
  if (!appMounted) {
    const app = createApp(App);
    app.use(router);
    app.mount("#app");
    appMounted = true;

    // 모든 리소스 로드 후 Splash 제거
    window.addEventListener("load", () => {
      const splash = document.getElementById("splash");
      if (!splash) return;

      splash.style.transition = "opacity 0.5s ease";
      splash.style.opacity = "0";

      setTimeout(() => {
        splash.remove();
      }, 500);
    });

    // ✅ PWA(Service Worker) 등록
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/service-worker.js")
          .then((reg) => {
            console.log("✅ Service Worker registered:", reg.scope);
          })
          .catch((err) => {
            console.warn("⚠️ Service Worker registration failed:", err);
          });
      });
    }
  }
});