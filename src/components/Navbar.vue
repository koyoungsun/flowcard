<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>LinkNest | 링크를 지갑처럼 정리하세요</title>

    <!-- 🔹 기본 메타 -->
    <meta name="description" content="링크를 깔끔하게 모아두는 스마트 링크지갑, LinkNest." />
    <meta name="keywords" content="링크 관리, 북마크, LinkNest, 링크월넛, link wallet, 링크 지갑" />
    <meta name="author" content="LUNEST / SeedNest" />

    <!-- 🔹 Open Graph (SNS 미리보기) -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content="LinkNest | 링크를 지갑처럼 정리하세요" />
    <meta property="og:description" content="자주 쓰는 링크를 한 곳에 — LinkNest에서 깔끔하게 정리해보세요." />
    <meta property="og:image" content="https://linknest.app/og-image.png" />
    <meta property="og:url" content="https://linknest.app" />
    <meta property="og:site_name" content="LinkNest" />

    <!-- 🔹 Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="LinkNest | 링크를 지갑처럼 정리하세요" />
    <meta name="twitter:description" content="링크를 깔끔하게 모아두는 스마트 링크지갑." />
    <meta name="twitter:image" content="https://linknest.app/og-image.png" />

    <!-- 🔹 PWA / iOS -->
    <meta name="theme-color" content="#EAF6F5" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

    <!-- 🔹 스타일 / 아이콘 -->
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css"
    />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
  </head>

  <body>
    <!--  Splash (Vue 마운트 전 표시) -->
    <div id="splash">
      <div class="logo">
        <span class="link">LINK</span><span class="nest">NEST</span>
      </div>
      <div class="loader"></div>
    </div>

    <!--  Vue App -->
    <div id="app"></div>

    <!--  Splash 스타일 -->
    <style>
      #splash {
        position: fixed;
        inset: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #f8f9fb 0%, #ffffff 100%);
        font-family: 'Inter', system-ui, sans-serif;
        color: #333;
        letter-spacing: 0.5px;
        z-index: 9999;
        transition: opacity 0.5s ease, transform 0.4s ease;
      }

      .logo {
        font-size: 1.8rem;
        font-weight: 700;
        margin-bottom: 16px;
        letter-spacing: 1px;
      }
      .logo .link {
        color: #60a5fa;
        animation: fadeIn 1s ease-in-out;
      }
      .logo .nest {
        color: #6b5bff;
        animation: fadeIn 1.2s ease-in-out;
      }

      .loader {
        width: 120px;
        height: 4px;
        border-radius: 2px;
        background: linear-gradient(90deg, #60a5fa, #a78bfa, #60a5fa);
        background-size: 200% 100%;
        animation: loadingBar 1.6s linear infinite;
      }

      @keyframes loadingBar {
        0% {
          background-position: 200% 0;
        }
        100% {
          background-position: -200% 0;
        }
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(5px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .splash-hide {
        opacity: 0;
        transform: translateY(-10px);
        pointer-events: none;
      }
    </style>

    <!--  Vue 진입 스크립트 -->
    <script type="module" src="/src/main.ts"></script>

    <!--  Splash 제거 스크립트 -->
    <script>
      window.addEventListener('load', () => {
        const splash = document.getElementById('splash');
        if (splash) {
          splash.classList.add('splash-hide');
          setTimeout(() => splash.remove(), 600);
        }
      });
    </script>
  </body>
</html>