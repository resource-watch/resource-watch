export default {
  staticData: {},
  loading: false,
  error: null,
  cards: [
    // TODO: No action or reducer for cards

    {
      id: 'join',
      title: 'Join the community',
      intro: [
        'Resource Watch is an open platform for everyone to explore data and insights about our planet.',
      ],
      buttons: [
        {
          text: 'Join the community',
          route: '/get-involved/join-the-community',
          // params: { id: 'join-the-community' },
          className: '-primary -alt',
        },
      ],
      className: 'join',
    },
    {
      id: 'data',
      title: 'Contribute data',
      intro: [
        'Extend the reach and impact of your data sets. Upload for private or public use, and see how many are using it.',
      ],
      buttons: [
        {
          text: 'Contribute data',
          route: '/get-involved/contribute-data',
          // params: { id: 'contribute-data' },
          className: '-primary -alt',
        },
      ],
      className: 'contribute',
    },
    {
      id: 'insights',
      title: 'Suggest a story',
      intro: [
        'Have you uncovered an interesting connection in the data we should tell a story about?',
      ],
      buttons: [
        {
          text: 'Suggest a story',
          route: '/get-involved/suggest-a-story',
          // params: { id: 'suggest-a-story' },
          className: '-primary -alt',
        },
      ],
      className: 'insights',
    },
    {
      id: 'app',
      title: 'Develop your app',
      intro: [
        'Power your application with the Resource Watch API, or build on our open source code for your next project.',
      ],
      buttons: [
        {
          text: 'Develop your app',
          route: '/get-involved/develop-your-app',
          // params: { id: 'develop-your-app' },
          className: '-primary -alt',
        },
        {
          text: 'App gallery',
          route: '/get-involved/apps',
          // params: { id: 'apps' },
          className: '-secondary -alt',
        },
      ],
      className: 'develop',
    },
  ],
};
