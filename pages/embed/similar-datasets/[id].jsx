// actions
import { setEmbed, setWebshotMode } from 'redactions/common';

// components
import LayoutEmbedSimilarDatasets from 'layout/embed/similar-datasets';

export default function EmbedSimilarDatasetsPage(props) {
  return (<LayoutEmbedSimilarDatasets {...props} />);
}

EmbedSimilarDatasetsPage.getInitialProps = ({ store, query }) => {
  const { dispatch } = store;
  const {
    id,
    webshot,
  } = query;

  dispatch(setEmbed(true));
  if (webshot) dispatch(setWebshotMode(true));

  return ({
    id: [id],
  });
};
