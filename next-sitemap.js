const sitemap = require('nextjs-sitemap-generator');

// after generating the sitemap, remove manually the following URLs:
// https://resourcewatch.org/attribution-requirements
// https://resourcewatch.org/contact-us
// https://resourcewatch.org/explore
// https://resourcewatch.org/faqs
// https://resourcewatch.org/how-to
// https://resourcewatch.org/newsletter
// https://resourcewatch.org/partners
// https://resourcewatch.org/policy
// https://resourcewatch.org/pulse

sitemap({
  baseUrl: 'https://resourcewatch.org',
  ignoredPaths: [
    'admin',
    'dashboards-detail',
    'embed',
    'get-involved-detail',
    'home',
    'newsletter-thank-you',
    'partner-detail',
    'reset-password',
    'webshot',
    'widget-detail',
  ],
  pagesDirectory: `${__dirname}/pages/app`,
  targetDirectory: `${__dirname}/public`,
  nextConfigPath: `${__dirname}/next.config.js`,
  ignoreIndexFiles: true,
  ignoredExtensions: [
    'png',
    'jpg',
    'json',
  ],
});

// eslint-disable-next-line no-console
console.log('✅ sitemap.xml generated!');
