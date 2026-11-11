// 화면에 보여줄 값을 사람이 읽기 좋게 바꾸는 함수들

// 15000 → "15,000원", 0 → "나눔"
export function formatPrice(price: number) {
  if (price === 0) return "나눔";
  return `${price.toLocaleString("ko-KR")}원`;
}

// 작성 시각 → "방금 전", "3분 전", "2일 전" …
export function timeAgo(iso: string) {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return "방금 전";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}일 전`;
  return new Date(iso).toLocaleDateString("ko-KR");
}
