export const FOOTER_LINKS = [
  {
    id: 'data',
    label: 'Data',
    route: 'data',
    pathnames: ['/app/explore', '/app/explore-detail', '/app/pulse'],
    children: [
      { label: 'Explore Datasets', route: 'explore' },
      { label: 'Near Real-Time Data', href: '/data/pulse' },
      {
        label: 'App Gallery',
        route: 'get_involved_detail',
        params: { id: 'apps' },
        logEvent: true
      }
    ]
  },
  {
    id: 'dashboards',
    label: 'Dashboards',
    route: 'dashboards',
    pathnames: ['/app/dashboards', '/app/dashboards-detail'],
    children: []
  },
  {
    id: 'blog',
    label: 'Blog',
    href: 'https://blog.resourcewatch.org'
  },
  {
    id: 'about',
    label: 'About',
    route: 'about',
    pathnames: ['/app/About', '/app/Partners'],
    children: [
      { label: 'Partners', route: 'about_partners' },
      { label: 'FAQs', route: 'about_faqs' },
      { label: 'How to', route: 'about_howto' },
      { label: 'Contact us', route: 'about_contact-us' },
      { label: 'Terms of service', route: 'terms-of-service' },
      { label: 'Privacy Policy', route: 'privacy-policy' },
      { label: 'Attribution requirements', route: 'attribution-requirements' }
    ]
  },
  {
    id: 'get_involved',
    label: 'Get Involved',
    route: 'get_involved',
    pathnames: ['/app/get-involved', '/app/get-involved-detail'],
    children: [
      {
        label: 'Suggest a story',
        route: 'get_involved_detail',
        params: { id: 'suggest-a-story' }
      },
      {
        label: 'Contribute data',
        route: 'get_involved_detail',
        params: { id: 'contribute-data' }
      },
      {
        label: 'Join the community',
        route: 'get_involved_detail',
        params: { id: 'join-the-community' }
      },
      {
        label: 'Develop your app',
        route: 'get_involved_detail',
        params: { id: 'develop-your-app' }
      },
      {
        label: 'Sign up',
        route: 'sign-in',
        params: {}
      }
    ]
  },
  {
    id: 'search',
    label: 'Search'
  },
  {
    user: false,
    id: 'myrw',
    label: 'Log in'
  },
  {
    user: true,
    id: 'myrw',
    route: 'myrw',
    label: 'My Resource Watch',
    children: [
      { label: 'Profile', route: 'myrw', params: { tab: 'profile' } },
      { label: 'Admin', route: 'admin_home', admin: true },
      { label: 'Logout', id: 'logout' }
    ]
  }
];

export default { FOOTER_LINKS };
