export default {
  dropdownOpened: {
    data: false,
    about: false,
    myrw: false,
    topics: false
  },
  mobileOpened: false,
  searchOpened: false,
  items: [
    {
      id: 'data',
      label: 'Data',
      route: 'data',
      pathnames: ['/app/explore', '/app/explore-detail', '/app/pulse'],
      children: [
        { label: 'Explore Datasets', route: 'explore' },
        { label: 'Planet Pulse', href: '/data/pulse' },
        { label: 'App Gallery', route: 'get_involved_detail', params: { id: 'apps' } }
      ]
    },
    {
      id: 'topics',
      label: 'Topics',
      route: 'topics',
      pathnames: ['/app/topics', '/app/topics-detail'],
      children: [
        { label: 'Biodiversity', route: 'topics_detail', params: { id: 'biodiversity' } },
        { label: 'Cities', route: 'topics_detail', params: { id: 'cities' } },
        { label: 'Climate', route: 'topics_detail', params: { id: 'climate' } },
        { label: 'Commerce', route: 'topics_detail', params: { id: 'commerce' } },
        { label: 'Energy', route: 'topics_detail', params: { id: 'energy' } },
        { label: 'Food and Agriculture', route: 'topics_detail', params: { id: 'food-and-agriculture' } },
        { label: 'Forests', route: 'topics_detail', params: { id: 'forest' } },
        { label: 'Water', route: 'topics_detail', params: { id: 'water' } }
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
