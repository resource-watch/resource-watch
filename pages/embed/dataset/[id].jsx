// actions
import { setEmbed } from 'redactions/common';

// components
import LayoutEmbedDataset from 'layout/embed/dataset';

// services
import { fetchDataset } from 'services/dataset';

export default function EmbedDatasetPage(props) {
  return (<LayoutEmbedDataset {...props} />);
}

EmbedDatasetPage.getInitialProps = async ({ store, query }) => {
  const { dispatch } = store;
  const {
    id,
  } = query;

  dispatch(setEmbed(true));

  const dataset = await fetchDataset(id, { includes: 'widget, metadata' });

  return ({
    dataset,
  });
};
