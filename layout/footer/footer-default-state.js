export default {
  partners: {
    list: [],
    loading: false,
    error: null
  },
  items: [
    {
      id: 'data',
      label: 'Data',
      route: 'data',
      pathnames: ['/app/explore', '/app/explore-detail', '/app/pulse'],
      children: [
        { label: 'Explore Datasets', route: 'explore' },
        { label: 'Planet Pulse', href: '/data/pulse' },
        {
          label: 'App Gallery',
          route: 'get_involved_detail',
          params: { id: 'apps' },
          logEvent: true
        }
      ]
    },
    {
      id: 'topics',
      label: 'Topics',
      route: 'topics',
      pathnames: ['/app/topics', '/app/topics-detail'],
      children: [
        { label: 'Cities', route: 'topics_detail', params: { id: 'cities' } },
        { label: 'Climate', route: 'topics_detail', params: { id: 'climate' } },

        { label: 'Energy', route: 'topics_detail', params: { id: 'energy' } },
        { label: 'Food', route: 'topics_detail', params: { id: 'food' } },
        { label: 'Forests', route: 'topics_detail', params: { id: 'forests' } },
        { label: 'Society', route: 'topics_detail', params: { id: 'society' } },
        { label: 'Oceans', route: 'topics_detail', params: { id: 'oceans' } },
        { label: 'Water', route: 'topics_detail', params: { id: 'water' } }
      ]
    },
    {
      id: 'blog',
      label: 'Blog',
      href: '/blog'
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
          route: 'log-in',
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
      label: 'Log in',
      children: [
        { label: 'Facebook', href: '/auth/facebook' },
        { label: 'Google', href: '/auth/google' },
        { label: 'Twitter', href: '/auth/twitter' }
      ]
    },
    {
      user: true,
      id: 'myrw',
      route: 'myrw',
      label: 'My Resource Watch',
      children: [
        { label: 'Profile', route: 'myrw' },
        { label: 'Admin', href: '/admin', admin: true },
        { label: 'Logout', id: 'logout' } // It should make an ajax call
      ]
    }
  ]
};
