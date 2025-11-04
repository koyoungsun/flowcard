export function getFavicon(url: string): string {
  if (!url || typeof url !== "string") return "/default-icon.png";

  try {
    // 사용자 업로드 이미지나 data URL 직접 사용
    if (url.startsWith("data:image") || url.startsWith("blob:") || url.includes("firebasestorage")) {
      return url;
    }

    // URL 파싱 및 http → https 변환
    const parsed = new URL(url);
    let domain = parsed.origin.replace("http://", "https://");

    // 구글 favicon API 경로
    return `https://www.google.com/s2/favicons?sz=64&domain_url=${domain}`;
  } catch (e) {
    console.warn("⚠️ favicon 로드 실패:", url, e);
    return "../img/default-icon.png";
  }
}