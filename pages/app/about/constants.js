export const USER_CARDS = [
  {
    id: 'government-staff',
    title: 'Government Staff',
    description: 'Use dashboards and alerts to monitor the conditions of the environment and its relevance to citizens.  Find reliable data to inform policies to advance your agenda.'
  },
  {
    id: 'business-analysts',
    title: 'Business Analysts',
    description: 'Track and visualize business risks and opportunities across your global operations for multiple issues or pull data into your own systems for analysis.'
  },
  {
    id: 'journalists',
    title: 'Journalists',
    description: 'Find out what’s happening in the world right now and access trustworthy data to discover new insights and inform stories.'
  },
  {
    id: 'researchers',
    title: 'Researchers',
    description: 'Find robust data for your analysis or share your own data and insights with others who can act on them.'
  },
  {
    id: 'citizens',
    title: 'Citizens',
    description: 'Understand the issues affecting your community, identify sustainable options, and share your findings to inspire action and hold decision-makers accountable.'
  },
  {
    id: 'more',
    title: 'More',
    description: 'Learn what you can do with Resource Watch.',
    link: {
      route: '/about/howto',
      label: 'Learn more',
      className: '-primary',
      external: false
    }
  }
];

export const VALUES_CARDS = [
  {
    id: 'reliability',
    title: 'Reliability',
    description: 'Resource Watch data are curated by World Resources Institute’s independent, nonpartisan experts, drawing from the best peer-reviewed and authoritative sources on the issues that matter the most. Learn more about our data curation process.',
    link: {
      label: 'Data policy',
      route: '/get-involved/data-policy',
      className: '-primary'
    }
  },
  {
    id: 'openness',
    title: 'Openness',
    description: 'We are committed to making information accessible and usable. Whenever possible, our data are made publicly available under open licenses, and the Resource Watch platform is open source for others to use and build upon.',
    link: {
      label: 'Visit our Github',
      route: 'https://github.com/resource-watch',
      className: '-primary',
      external: true
    }
  },
  {
    id: 'community',
    title: 'Community',
    description: 'A sustainable future is only possible when we work together. Resource Watch is a global partnership of public, private, and civil society organizations, supported by a growing community of users, including you. Learn more about how you can help.',
    link: {
      label: 'Get involved',
      route: '/get-involved',
      className: '-primary'
    }
  }
];

export default {
  USER_CARDS,
  VALUES_CARDS
};
