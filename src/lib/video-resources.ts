export const videoResources = [
  { subject: 'mathematics', title: 'Single Variable Calculus', url: 'https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/' },
  { subject: 'physics', title: 'Classical Mechanics', url: 'https://ocw.mit.edu/courses/8-01sc-classical-mechanics-fall-2016/' },
  { subject: 'informatics', title: 'Introduction to Algorithms', url: 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/' },
  { subject: 'biology', title: 'Fundamentals of Biology', url: 'https://ocw.mit.edu/courses/7-01sc-fundamentals-of-biology-fall-2011/' },
];

export function youtubeEmbed(value: string): string | null {
  try {
    const url = new URL(value);
    const id = url.hostname === 'youtu.be' ? url.pathname.slice(1) : ['youtube.com', 'www.youtube.com'].includes(url.hostname) && url.pathname === '/watch' ? url.searchParams.get('v') : null;
    return id && /^[\w-]{11}$/.test(id) ? `https://www.youtube-nocookie.com/embed/${id}` : null;
  } catch { return null; }
}
