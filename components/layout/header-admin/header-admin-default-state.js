export default {
  admin: true,
  dropdownOpened: {
    myrw: false
  },
  items: [
    {
      id: 'data',
      label: 'Data',
      route: 'admin_data',
      pathnames: ['/admin/Data', '/admin/DataDetail']
    },
    {
      id: 'topics',
      label: 'Topics',
      route: 'admin_topics',
      pathnames: ['/admin/Topics', '/admin/TopicsDetail']
    },
    {
      id: 'dashboards',
      label: 'Dashboards',
      route: 'admin_dashboards',
      pathnames: ['/admin/Dashboards', '/admin/DashboardsDetail']
    },
    {
      id: 'partners',
      label: 'Partners',
      route: 'admin_partners',
      pathnames: ['/admin/Partners', '/admin/PartnersDetail']
    },
    {
      id: 'tools',
      label: 'Tools',
      route: 'admin_tools',
      pathnames: ['/admin/Tools', '/admin/ToolsDetail']
    },
    {
      id: 'faqs',
      label: 'FAQs',
      route: 'admin_faqs',
      pathnames: ['/admin/Faqs', '/admin/FaqsDetail']
    },
    {
      id: 'pages',
      label: 'Pages',
      route: 'admin_pages',
      pathnames: ['/admin/Pages', '/admin/PagesDetail']
    },
    {
      id: 'myrw',
      label: 'Personal Area',
      route: 'myrw'
    }
  ]
};
