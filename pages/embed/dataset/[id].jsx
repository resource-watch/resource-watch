// actions
import { setEmbed } from 'redactions/common';

// hoc
import {
  withRedux,
  withUserServerSide,
} from 'hoc/auth';

// components
import LayoutEmbedDataset from 'layout/embed/dataset';

// services
import { fetchDataset } from 'services/dataset';

export default function EmbedDatasetPage(props) {
  return (<LayoutEmbedDataset {...props} />);
}

export const getServerSideProps = withRedux(withUserServerSide(async ({ store, query }) => {
  const { dispatch } = store;
  const {
    id,
  } = query;

  dispatch(setEmbed(true));

  const dataset = await fetchDataset(id, { includes: 'widget, metadata' });

  return ({
    props: ({
      dataset,
    }),
  });
}));
