// actions
import { setEmbed, setWebshotMode } from 'redactions/common';
import {
  getWidget,
  checkIfFavorited,
} from 'redactions/widget';

// hoc
import {
  withRedux,
  withUserServerSide,
} from 'hoc/auth';

// components
import LayoutEmbedEmbed from 'layout/embed/embed';

export default function EmbedEmbedPage(props) {
  return (<LayoutEmbedEmbed {...props} />);
}

export const getServerSideProps = withRedux(withUserServerSide(async ({
  store,
  req,
  query,
}) => {
  const {
    dispatch,
    getState,
  } = store;
  const { user } = getState();
  const {
    id,
    webshot,
  } = query;

  dispatch(setEmbed(true));
  if (webshot) dispatch(setWebshotMode(true));

  await dispatch(getWidget(id));
  if (user.id) dispatch(checkIfFavorited(id));

  return ({
    props: ({
      referer: req.headers.referer,
    }),
  });
}));
