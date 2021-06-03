// actions
import axios from 'axios';
import { setEmbed, setWebshotMode } from 'redactions/common';

// components
import LayoutEmbedTable from 'layout/embed/table';

export default function EmbedTablePage(props) {
  return (<LayoutEmbedTable {...props} />);
}

EmbedTablePage.getInitialProps = async ({
  store,
  isServer,
  req,
  query,
}) => {
  const {
    dispatch,
  } = store;
  const {
    webshot,
    queryUrl,
  } = query;
  const referer = isServer ? req.headers.referer : window.location.href;

  dispatch(setEmbed(true));
  if (webshot) dispatch(setWebshotMode(true));

  const { data: { data } } = await axios.get(queryUrl);

  return ({
    referer,
    tableData: data,
  });
};
