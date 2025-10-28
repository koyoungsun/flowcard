// src/utils/.ts
export function getFavicon(url: string): string {
    try {
      const domain = new URL(url).origin
      return `https://www.google.com/s2/favicons?sz=64&domain_url=${domain}`
    } catch {
      return '/default-icon.png' // fallback 이미지
    }
  }