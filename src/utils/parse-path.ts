export function parsePath(url: string): string {
  if (!url) {
    return "";
  }
  if (/\/song\//i.test(url)) {
    return url.replace(/^https?:\/\/(?:www\.)?(?:jio)?saavn\.com\/song\/[^/]+\//i, "/song/");
  }
  if (/\/album\//i.test(url)) {
    return url.replace(/^https?:\/\/(?:www\.)?(?:jio)?saavn\.com\/album\/[^/]+\//i, "/album/");
  }
  if (/\/featured\//i.test(url)) {
    return url.replace(
      /^https?:\/\/(?:www\.)?(?:jio)?saavn\.com\/featured\/[^/]+\//i,
      "/playlist/",
    );
  }
  if (/\/s\/mix\//i.test(url)) {
    return url.replace(/^https?:\/\/(?:www\.)?(?:jio)?saavn\.com\/s\/mix\/[^/]+/i, "/mix");
  }
  if (/\/artist\//i.test(url)) {
    return url.replace(/^https?:\/\/(?:www\.)?(?:jio)?saavn\.com\/artist\/[^/]+\//i, "/artist/");
  }
  return url;
}
