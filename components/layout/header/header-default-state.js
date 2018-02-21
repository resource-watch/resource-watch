export default {
  dropdownOpened: {
    data: false,
    about: false,
    myrw: false
  },
  mobileOpened: false,
  searchOpened: false,
  items: [
    {
      id: 'data',
      label: 'Data',
      route: 'data',
      pathnames: ['/app/Explore', '/app/ExploreDetail', '/app/Pulse'],
      children: [
        { label: 'Explore Datasets', route: 'explore' },
        { label: 'Dashboards', route: 'dashboards' },
        { label: 'Planet Pulse', href: '/data/pulse' },
        { label: 'App Gallery', route: 'get_involved_detail', params: { id: 'apps' } }
      ]
    },
    {
      id: 'blog',
      label: 'Blog',
      route: 'insights',
      pathnames: ['/app/Insights']
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
        { label: 'Contact us', route: 'about_contact-us' }
      ]
    },
    {
      id: 'get_involved',
      label: 'Get Involved',
      route: 'get_involved',
      pathnames: ['/app/GetInvolved']
    },
    {
      id: 'search',
      label: 'Search'
    },
    {
      id: 'myrw',
      label: 'Personal Area',
      route: 'myrw'
    }
  ]
};
