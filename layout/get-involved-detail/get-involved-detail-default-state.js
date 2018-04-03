export default {
  staticData: {},
  loading: false,
  error: null,
  // Once insights fetch working need to add to component actions
  insights: [
    {
      tag: 'Spotlight',
      date: 'Spotlight',
      title: 'Welcome to Resource Watch',
      slug: 'welcome-to-resource-watch',
      source: { name: 'Resource Watch', path: 'http://www.resourcewatch.org/', img: '/static/images/logo-no-text.svg' },
      background: 'url(/static/tempImages/backgrounds/rw_welcome.jpg) top',
      body: ''
    },
    {
      tag: 'April 11, 2018',
      date: 'April 11, 2018',
      title: 'Experience a bleached coral reef in 360°',
      slug: 'experience-a-bleached-coral-reef-in-360',
      link: '/splash/coral',
      source: { name: 'Resource Watch', path: 'http://www.resourcewatch.org/', img: '/static/images/logo-no-text.svg' },
      background: 'url(/static/tempImages/backgrounds/BLEACHED-American-Samoa-2-February-2015.jpg)',
      body: ''
    },
    {
      tag: 'April 11, 2018',
      date: 'April 11, 2018',
      title: "We mapped the world's power plants. Here's what we learned.",
      slug: 'we-mapped-the-worlds-power-plants-heres-what-we-learned',
      source: { name: 'Resource Watch', path: 'http://www.resourcewatch.org/', img: '/static/images/logo-no-text.svg' },
      background: 'url(/static/tempImages/backgrounds/rw_powerwatch.jpg)',
      body: ''
    }
  ]
};
