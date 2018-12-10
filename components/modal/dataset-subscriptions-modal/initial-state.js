export default {
  // user subscriptions
  list: [],
  loading: true,
  error: null,
  userSelection: {
    area: null,
    frequency: null,
    datasets: []
  },
  areas: {
    list: [],
    loading: false,
    error: null
  },
  userAreas: {
    list: [],
    loading: false,
    error: null
  },
  subscriptionCreation: {
    success: false,
    loading: false,
    error: null
  },
  datasets: {
    list: [],
    loading: false,
    error: null
  },
  preview: {
    list: [],
    loading: false,
    error: null
  }
};
