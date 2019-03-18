export default {
  admin: true,
  dropdownOpened: { myrw: false },
  items: [
    {
      id: 'data',
      label: 'Data',
      route: 'admin_data',
      pathnames: ['/admin/data', '/admin/DataDetail']
    },
    {
      id: 'topics',
      label: 'Topics',
      route: 'admin_topics',
      pathnames: ['/admin/topics', '/admin/TopicsDetail']
    },
    {
      id: 'dashboards',
      label: 'Dashboards',
      route: 'admin_dashboards',
      pathnames: ['/admin/dashboards', '/admin/DashboardsDetail']
    },
    {
      id: 'partners',
      label: 'Partners',
      route: 'admin_partners',
      pathnames: ['/admin/partners', '/admin/PartnersDetail']
    },
    {
      id: 'tools',
      label: 'Tools',
      route: 'admin_tools',
      pathnames: ['/admin/tools', '/admin/ToolsDetail']
    },
    {
      id: 'faqs',
      label: 'FAQs',
      route: 'admin_faqs',
      pathnames: ['/admin/faqs', '/admin/FaqsDetail']
    },
    {
      id: 'pages',
      label: 'Pages',
      route: 'admin_pages',
      pathnames: ['/admin/pages', '/admin/PagesDetail']
    },
    {
      id: 'myrw',
      label: 'Personal Area',
      route: 'myrw'
    }
  ]
};
