// import 'isomorphic-fetch';
import find from 'lodash/find';

/**
 * CONSTANTS
*/
const INSIGHTS_DATA = [
  {
    tag: 'Signal of the week',
    title: '10 true facts you won’t believe!',
    slug: 'slideshow-peru',
    source: { name: 'World Resources Institute', path: 'http://www.wri.org/', img: 'https://vizzuality.github.io/WRW-Prototype/img/avatar-wri.png'},
    background: 'url(/static/tempImages/backgrounds/graph.png) center',
    body: 'https://resource-watch.github.io/insights/slideshow-peru.html'
  },
  {
    tag: 'Sept 2, 2017',
    title: 'A factory is built in your neighborhood. Can you do anything about it?',
    slug: 'interactive-edi',
    source: { name: 'World Resources Institute', path: 'http://www.wri.org/', img: 'https://vizzuality.github.io/WRW-Prototype/img/avatar-wri.png' },
    background: 'url(/static/tempImages/backgrounds/discovery_insights_image.jpg) center',
    body: '/static/insights/interactive-edi.html'
  },
  {
    tag: 'Sept 1, 2017',
    title: 'Farms to feel squeeze as competition for water increases',
    slug: 'interactive-map',
    source: { name: 'World Resources Institute', path: 'http://www.wri.org/', img: 'https://vizzuality.github.io/WRW-Prototype/img/avatar-wri.png' },
    background: 'url(/static/tempImages/backgrounds/world_farms.jpg)',
    body: '/static/insights/interactive-map.html'
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
