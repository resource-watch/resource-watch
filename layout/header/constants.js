export const APP_HEADER_ITEMS = [
  {
    id: 'data',
    label: 'Data',
    href: '/data/explore',
    pages: [
      '/app/explore',
      '/app/explore-detail',
      '/app/pulse',
    ],
    children: [
      {
        label: 'Explore Datasets',
        href: '/data/explore',
      },
      {
        label: 'Near Real-Time Data',
        href: '/data/pulse',
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
    pages: [
      '/app/dashboards',
      '/app/dashboards-detail',
    ],
    children: [],
  },
  {
    id: 'blog',
    label: 'Blog',
    href: 'https://blog.resourcewatch.org',
    external: true,
  },
  {
    id: 'about',
    label: 'About',
    href: '/about',
    pages: [
      '/app/about',
      '/app/partners',
      '/app/faqs',
      '/app/how-to',
      '/app/contact-us',
    ],
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
    ],
  },
  {
    id: 'get-involved',
    label: 'Get Involved',
    href: '/get-involved',
    pages: [
      '/app/get-involved',
      '/app/get-involved-detail',
    ],
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
        href: '/get-involved/develop-your-app',
      },
      {
        label: 'Sign up',
        href: '/sign-in',
      },
    ],
  },
  {
    id: 'azavea-test',
    label: 'Azavea Test',
    href: '/azavea-test',
    pages: [
      '/azavea-test',
    ],
  },
  {
    id: 'search',
    label: 'Search',
  },
  {
    user: false,
    id: 'user',
    label: 'Log in',
  },
  {
    user: true,
    id: 'user',
    href: '/myrw',
    label: 'My Resource Watch',
    children: [
      {
        label: 'Profile',
        href: '/myrw/profile',
      },
      {
        label: 'Admin',
        href: '/admin',
        admin: true,
      },
      {
        label: 'Logout',
        id: 'logout',
      },
    ],
  },
];

export default { APP_HEADER_ITEMS };
