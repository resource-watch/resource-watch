// actions
import axios from 'axios';
import { setEmbed, setWebshotMode } from 'redactions/common';

// hoc
import {
  withRedux,
  withUserServerSide,
} from 'hoc/auth';

// components
import LayoutEmbedTable from 'layout/embed/table';

export default function EmbedTablePage(props) {
  return (<LayoutEmbedTable {...props} />);
}

export const getServerSideProps = withRedux(withUserServerSide(async ({
  store,
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

  dispatch(setEmbed(true));
  if (webshot) dispatch(setWebshotMode(true));

  const { data: { data } } = await axios.get(queryUrl);

  return ({
    props: ({
      referer: req.headers.referer,
      tableData: data,
    }),
  });
}));
