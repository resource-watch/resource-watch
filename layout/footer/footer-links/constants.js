export const FOOTER_LINKS = [
  {
    id: 'data',
    label: 'Data',
    href: '/data/explore',
    children: [
      {
        label: 'Explore Datasets',
        href: '/data/explore',
      },
      {
        label: 'Near Real-Time Data',
        href: '/data/explore?section=Near%20Real-Time',
      },
      {
        label: 'App Gallery',
        href: '/get-involved/apps',
        logEvent: true,
      },
    ],
  },
  {
    id: 'dashboards',
    label: 'Dashboards',
    href: '/dashboards',
    children: [],
  },
  {
    id: 'blog',
    label: 'Blog',
    href: 'https://blog.resourcewatch.org',
    isExternalLink: true,
  },
  {
    id: 'about',
    label: 'About',
    href: '/about',
    children: [
      {
        label: 'Partners',
        href: '/about/partners',
      },
      {
        label: 'FAQs',
        href: '/about/faqs',
      },
      {
        label: 'How to',
        href: '/about/howto',
      },
      {
        label: 'Contact us',
        href: '/about/contact-us',
      },
      {
        label: 'Terms of service',
        href: '/terms-of-service',
      },
      {
        label: 'Privacy Policy',
        href: '/privacy-policy',
      },
      {
        label: 'Attribution requirements',
        href: '/api-attribution-requirements',
      },
    ],
  },
  {
    id: 'get_involved',
    label: 'Get Involved',
    href: '/get-involved',
    children: [
      {
        label: 'Suggest a story',
        href: '/get-involved/suggest-a-story',
      },
      {
        label: 'Contribute data',
        href: '/get-involved/contribute-data',
      },
      {
        label: 'Join the community',
        href: '/get-involved/join-the-community',
      },
      {
        label: 'Develop your app',
        route: 'get_involved_detail',
        href: '/get-involved/develop-your-app',
      },
      {
        label: 'Sign up',
        href: '/sign-in',
      },
    ],
  },
];

export default { FOOTER_LINKS };
