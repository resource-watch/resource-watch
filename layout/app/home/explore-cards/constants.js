export const EXPLORE_CARDS = [
  {
    tag: 'Planet Pulse',
    title: 'View near-real-time data on the planet',
    intro: '',
    buttons: [
      {
        text: 'Launch Planet Pulse',
        path: '/data/pulse',
        anchor: true,
        className: '-primary'
      }
    ],
    background: 'url(/static/images/homepage/home-data-bg4.png) 67% center'
  },
  {
    tag: 'Explore Data',
    title: 'Access data on the map',
    intro: 'Identify patterns between data sets on the map or download data for analysis.',
    buttons: [
      {
        text: 'Explore data',
        path: 'explore',
        className: '-primary'
      }
    ],
    background: 'url(/static/images/homepage/home-data-bg1.png)'
  },
  {
    tag: 'Dashboards',
    title: 'Create and share visualizations',
    intro: 'Create and share custom visualizations or craft your own personal monitoring system.',
    buttons: [
      {
        text: 'Create a dashboard',
        path: '/myrw/dashboards',
        anchor: true,
        loginRequired: 'Log in to create a dashboard',
        className: '-primary'
      }
    ],
    background: 'url(/static/images/homepage/home-data-bg2.png)'
  },
  {
    tag: 'Alerts',
    title: 'Track data in near-real-time',
    intro: 'Get updates on world events as they unfold.',
    buttons: [
      {
        text: 'Sign up for alerts',
        path: '/myrw/areas',
        anchor: true,
        loginRequired: 'Log in to sign up for alerts',
        className: '-primary'
      }
    ],
    background: 'url(/static/images/homepage/home-data-bg3.png) 67% center'
  }
];

export default { EXPLORE_CARDS };
