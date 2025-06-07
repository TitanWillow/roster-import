/**
 * @param url
 * @returns
 */
export const getEmbedUrl = (url: string): string => {
  if (!url) return '';
  
  let videoId: string | null = null;

  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const youtubeMatch = url.match(youtubeRegex);
  if (youtubeMatch && youtubeMatch[1]) {
    videoId = youtubeMatch[1];
    return `https://www.youtube.com/embed/${videoId}`;
  }

  const vimeoRegex = /vimeo\.com\/(?:video\/)?(\d+)/;
  const vimeoMatch = url.match(vimeoRegex);
  if (vimeoMatch && vimeoMatch[1]) {
    videoId = vimeoMatch[1];
    return `https://player.vimeo.com/video/${videoId}`;
  }
  
  return '';
};