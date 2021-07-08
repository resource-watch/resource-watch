import { connect } from 'react-redux';

// actions
import * as actions from 'layout/explore/actions';
import { setEmbed } from 'redactions/common';

// hoc
import {
  withRedux,
} from 'hoc/auth';

// components
import Explore from 'layout/explore/embed';

const EmbedExplorePage = () => (<Explore />);

export const getServerSideProps = withRedux(async ({ store, query }) => {
  const { dispatch } = store;
  const {
    zoom,
    lat,
    lng,
    pitch,
    bearing,
    basemap,
    labels,
    boundaries,
    layers,
  } = query;

  // Embed
  dispatch(setEmbed(true));

  // sets map params from URL
  dispatch(actions.setViewport({
    ...zoom && { zoom: +zoom },
    ...(lat && lng) && {
      latitude: +lat,
      longitude: +lng,
    },
    ...pitch && { pitch: +pitch },
    ...bearing && { bearing: +bearing },
  }));
  if (basemap) dispatch(actions.setBasemap(basemap));
  if (labels) dispatch(actions.setLabels(labels));
  if (boundaries) dispatch(actions.setBoundaries(!!boundaries));

  // Fetch layers
  if (layers) await dispatch(actions.fetchMapLayerGroups(JSON.parse(decodeURIComponent(layers))));

  return ({
    props: ({}),
  });
});

export default connect(
  (state) => ({
    explore: state.explore,
  }),
  actions,
)(EmbedExplorePage);
