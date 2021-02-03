export const MYRW_TABS = [
  {
    label: 'Profile',
    value: 'profile',
    route: 'myrw',
    params: { tab: 'profile' },
  },
  {
    label: 'Datasets',
    value: 'datasets',
    desktopOnly: true,
    route: 'myrw',
    params: { tab: 'datasets', subtab: 'my_datasets' },
  },
  {
    label: 'Visualizations',
    value: 'widgets',
    route: 'myrw',
    params: { tab: 'widgets', subtab: 'my_widgets' },
  },
  {
    label: 'Dashboards',
    value: 'dashboards',
    route: 'myrw',
    params: { tab: 'dashboards' },
  },
  {
    label: 'Areas of interest',
    value: 'areas',
    route: 'myrw',
    params: { tab: 'areas' },
  },
  {
    label: 'Collections',
    value: 'collections',
    route: 'myrw',
    params: { tab: 'collections' },
  },
];

export default { MYRW_TABS };
