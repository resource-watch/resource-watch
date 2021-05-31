// actions
import { getWidget, checkIfFavorited } from 'redactions/widget';
import { setEmbed, setWebshotMode } from 'redactions/common';

// components
import LayoutEmbedWidget from 'layout/embed/widget';

export default function EmbedWidgetPage(props) {
  return (<LayoutEmbedWidget {...props} />);
}

EmbedWidgetPage.getInitialProps = async ({ store, query }) => {
  const { dispatch, getState } = store;
  const {
    user,
  } = getState();
  const {
    id,
    webshot,
  } = query;

  dispatch(setEmbed(true));
  if (webshot) dispatch(setWebshotMode(true));

  await dispatch(getWidget(id, { includes: ['metadata'].join(',') }));

  if (!webshot) {
    if (user && user.id) dispatch(checkIfFavorited(id));
  }

  return ({});
};
