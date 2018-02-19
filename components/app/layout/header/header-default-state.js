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
      label: 'Data',
      route: 'data',
      pathnames: ['/app/Explore', '/app/ExploreDetail', '/app/Pulse'],
      children: [
        { label: 'Explore Datasets', route: 'explore' },
        { label: 'Dashboards', route: 'dashboards' },
        { label: 'Planet Pulse', href: '/data/pulse' },
        { label: 'Planet Pulse', route: 'get_involved_detail', params: { id: 'apps' } }
      ]
    },
    {
      label: 'Blog',
      route: 'insights',
      pathnames: ['/app/Insights']
    },
    {
      label: 'About',
      route: 'about',
      pathnames: ['/app/About'],
      children: [
        { label: 'Partners', route: 'about_partners' },
        { label: 'FAQs', route: 'about_faqs' },
        { label: 'How to', route: 'about_howto' },
        { label: 'Contact us', route: 'about_contact-us' }
      ]
    },
    {
      label: 'Get Involved',
      route: 'get_involved',
      pathnames: ['/app/GetInvolved']
    },
    {
      label: 'Search'
    },
    {
      label: 'Personal Area',
      route: 'myrw'
    }
  ]
};
