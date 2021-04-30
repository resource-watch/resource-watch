// actions
import { setEmbed, setWebshotMode } from 'redactions/common';
import {
  getWidget,
  checkIfFavorited,
} from 'redactions/widget';

// components
import LayoutEmbedEmbed from 'layout/embed/embed';

export default function EmbedEmbedPage(props) {
  return (<LayoutEmbedEmbed {...props} />);
}

EmbedEmbedPage.getInitialProps = async ({
  store,
  isServer,
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
  const referer = isServer ? req.headers.referer : window.location.href;

  dispatch(setEmbed(true));
  if (webshot) dispatch(setWebshotMode(true));

  await dispatch(getWidget(id));
  if (user.id) dispatch(checkIfFavorited(id));

  return ({
    referer,
  });
};
