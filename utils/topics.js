export const TOPICS_CONNECTIONS = [
  {
    topic: 'cities',
    appId: '7'
  },
  {
    topic: 'cities',
    appId: '13'
  },
  {
    topic: 'cities',
    appId: '11'
  },
  {
    topic: 'climate',
    appId: '8'
  },
  {
    topic: 'climate',
    appId: '11'
  },
  {
    topic: 'climate',
    appId: '25'
  },
  {
    topic: 'energy',
    appId: '32'
  },
  {
    topic: 'energy',
    appId: '22'
  },
  {
    topic: 'energy',
    appId: '23'
  },
  {
    topic: 'food-and-agriculture',
    appId: '10'
  },
  {
    topic: 'food-and-agriculture',
    appId: '24'
  },
  {
    topic: 'food-and-agriculture',
    appId: '27'
  },
  {
    topic: 'forests',
    appId: '5'
  },
  {
    topic: 'forests',
    appId: '19'
  },
  {
    topic: 'forests',
    appId: '31'
  },
  {
    topic: 'water',
    appId: '6'
  },
  {
    topic: 'water',
    appId: '7'
  },
  {
    topic: 'water',
    appId: '18'
  },
  {
    topic: 'ocean',
    appId: '28'
  },
  {
    topic: 'ocean',
    appId: '29'
  },
  {
    topic: 'ocean',
    appId: '30'
  }
];

export const filterFunction = (topics, filters) => {
  if (!filters) return topics;
  if (filters && !filters.length) return topics;

  return topics.filter(topic =>
    filters.every((filter) => {
      if (filter.key === 'id') return topic.id === filter.value;
      if (!topic[filter.key]) return false;

      if (typeof filter.value === 'string') {
        return topic[filter.key].toLowerCase().match(filter.value.toLowerCase());
      }

      return topic[filter.key] === filter.value;
    }));
};

export default {
  TOPICS_CONNECTIONS,
  filterFunction
};
