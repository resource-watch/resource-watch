export default {
  loading: false,
  error: null,
  tab: 'datasets',
  defaultTab: 'datasets',
  id: null,
  subtab: null,
  datasets: {
    activePage: 1,
    list: [],
    pagination: {
      size: 20,
      total: null,
      limit: 20
    }
  },
  availableTabs: [
    {
      label: 'Datasets',
      value: 'datasets',
      route: 'admin_data',
      params: { tab: 'datasets' }
    },
    {
      label: 'Widgets',
      value: 'widgets',
      route: 'admin_data',
      params: { tab: 'widgets' }
    },
    {
      label: 'Layers',
      value: 'layers',
      route: 'admin_data',
      params: { tab: 'layers' }
    }
  ]
};
