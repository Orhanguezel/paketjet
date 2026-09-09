import type {MetadataRoute} from 'next';
import {SITE_URL} from '@/lib/seo';
export default function robots(): MetadataRoute.Robots {
  // Public HTML and rendering assets are crawlable; private areas remain excluded.
  // Login pages can be crawled so their noindex directives can be read.
  const disallow = ['/api/', '/panel', '/admin', '/dashboard', '/ilan-ver', '/*?_rsc=', '/*&_rsc='];
  return {
    rules: [
      {userAgent:'*',allow:'/',disallow},
      {userAgent:['OAI-SearchBot','ChatGPT-User','GPTBot','ClaudeBot','Claude-SearchBot','PerplexityBot','CCBot','Google-Extended'],allow:'/',disallow},
    ],
    sitemap:`${SITE_URL}/sitemap.xml`,
  };
}
