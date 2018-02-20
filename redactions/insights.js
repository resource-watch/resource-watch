// import 'isomorphic-fetch';
import find from 'lodash/find';

/**
 * CONSTANTS
*/
const INSIGHTS_DATA = [
  {
    tag: 'Spotlight',
    date: 'Spotlight',
    title: 'Welcome to Resource Watch',
    slug: 'welcome-to-resource-watch',
    source: { name: 'Resource Watch', path: 'http://www.wri.org/', img: 'https://vizzuality.github.io/WRW-Prototype/img/avatar-wri.png' },
    background: 'url(/static/tempImages/backgrounds/rw_welcome.jpg) top',
    body: ''
  },
  {
    tag: 'April 11, 2018',
    date: 'April 11, 2018',
    title: 'Experience a bleached coral reef in 360°',
    slug: 'experience-a-bleached-coral-reef-in-360',
    link: '/splash/coral',
    source: { name: 'Resource Watch', path: 'http://www.wri.org/', img: 'https://vizzuality.github.io/WRW-Prototype/img/avatar-wri.png' },
    background: 'url(/static/tempImages/backgrounds/BLEACHED-American-Samoa-2-February-2015.jpg)',
    body: ''
  },
  {
    tag: 'April 11, 2018',
    date: 'April 11, 2018',
    title: "We mapped the world's power plants. Here's what we learned.",
    slug: 'we-mapped-the-worlds-power-plants-heres-what-we-learned',
    source: { name: 'Resource Watch', path: 'http://www.wri.org/', img: 'https://vizzuality.github.io/WRW-Prototype/img/avatar-wri.png' },
    background: 'url(/static/tempImages/backgrounds/rw_powerwatch.jpg)',
    body: ''
  }
];

const GET_INSIGHTS_SUCCESS = 'insights/GET_INSIGHTS_SUCCESS';
const GET_INSIGHTS_ERROR = 'insights/GET_INSIGHTS_ERROR';
const GET_INSIGHTS_LOADING = 'insights/GET_INSIGHTS_LOADING';

const GET_INSIGHT_DETAIL_SUCCESS = 'insights/GET_INSIGHT_DETAIL_SUCCESS';
const GET_INSIGHT_DETAIL_ERROR = 'insights/GET_INSIGHT_DETAIL_ERROR';
const GET_INSIGHT_DETAIL_LOADING = 'insights/GET_INSIGHT_DETAIL_LOADING';

/**
 * REDUCER
*/
const initialState = {
  list: [],
  loading: false,
  error: false
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_INSIGHTS_SUCCESS: {
      return Object.assign({}, state, {
        list: action.payload,
        loading: false,
        error: false
      });
    }

    case GET_INSIGHTS_ERROR: {
      return Object.assign({}, state, {
        loading: false,
        error: true
      });
    }

    case GET_INSIGHTS_LOADING: {
      return Object.assign({}, state, {
        loading: true,
        error: false
      });
    }

    case GET_INSIGHT_DETAIL_SUCCESS: {
      return Object.assign({}, state, {
        data: action.payload,
        loading: false,
        error: false
      });
    }

    case GET_INSIGHT_DETAIL_ERROR: {
      return Object.assign({}, state, {
        loading: false,
        error: true
      });
    }

    case GET_INSIGHT_DETAIL_LOADING: {
      return Object.assign({}, state, {
        loading: true,
        error: false
      });
    }

    default:
      return state;
  }
}

/**
 * ACTIONS
 * - getInsights
*/
export function getInsights() {
  return (dispatch) => {
    // Waiting for fetch from server -> Dispatch loading
    dispatch({ type: GET_INSIGHTS_LOADING });

    // Temporal data
    dispatch({
      type: GET_INSIGHTS_SUCCESS,
      payload: INSIGHTS_DATA
    });
    // fetch(new Request(`${process.env.API_URL}/partners`))
    //   .then((response) => {
    //     if (response.ok) return response.json();
    //     throw new Error(response.statusText);
    //   })
    //   .then((response) => {
    //     // TODO: filter by those who are featured
    //     const partners = response.data;

    //     dispatch({
    //       type: GET_INSIGHTS_SUCCESS,
    //       payload: partners
    //     });
    //   })
    //   .catch((err) => {
    //     // Fetch from server ko -> Dispatch error
    //     dispatch({
    //       type: GET_INSIGHTS_ERROR,
    //       payload: err.message
    //     });
    //   });
  };
}

export function getInsightBySlug(slug) {
  return (dispatch) => {
    // Waiting for fetch from server -> Dispatch loading
    dispatch({ type: GET_INSIGHT_DETAIL_LOADING });
    // Temporal data
    dispatch({
      type: GET_INSIGHT_DETAIL_SUCCESS,
      payload: find(INSIGHTS_DATA, { slug })
    });
  };
}
