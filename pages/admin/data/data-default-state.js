export default {
  loading: false,
  error: null,
  tab: 'datasets',
  defaultTab: 'datasets',
  id: null,
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
