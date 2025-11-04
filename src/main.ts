// src/main.ts
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/styles/main.scss";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const auth = getAuth();
let appMounted = false;

/**
 * Vue는 Firebase 인증 상태 확인 후에만 mount
 *  Splash 제거는 'window.load' (CSS 완전 로드 후) 시점으로 이동
 */
onAuthStateChanged(auth, () => {
  if (!appMounted) {
    const app = createApp(App);
    app.use(router);
    app.mount("#app");
    appMounted = true;

    //  모든 리소스(CSS 포함) 로드 후 Splash 제거
    window.addEventListener("load", () => {
      const splash = document.getElementById("splash");
      if (!splash) return;

      splash.style.transition = "opacity 0.5s ease";
      splash.style.opacity = "0";

      // CSS transition 종료 후 DOM 제거
      setTimeout(() => {
        splash.remove();
      }, 500);
    });
  }
});