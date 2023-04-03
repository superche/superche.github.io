import rss, { pagesGlobToRssItems } from '@astrojs/rss';
import { settings } from '../../data/settings';

export async function get(context) {
  return rss({
    // `<title>` field in output xml
    title: settings.title,
    // `<description>` field in output xml
    description: settings.description,
    // Pull in your project "site" from the endpoint context
    // https://docs.astro.build/en/reference/api-reference/#contextsite
    site: context.site,
    // Array of `<item>`s in output xml
    // See "Generating items" section for examples using content collections and glob imports
    items: await pagesGlobToRssItems(
      import.meta.glob('../posts/*.{md,mdx}'),
    )
  });
}