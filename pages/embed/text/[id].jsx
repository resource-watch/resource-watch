// actions
import { setEmbed, setWebshotMode } from 'redactions/common';
import { getWidget } from 'redactions/widget';

// components
import LayoutEmbedText from 'layout/embed/text';

export default function EmbedTextPage(props) {
  return (<LayoutEmbedText {...props} />);
}

EmbedTextPage.getInitialProps = async ({ store, query }) => {
  const {
    dispatch,
  } = store;
  const {
    id,
    webshot,
  } = query;

  dispatch(setEmbed(true));
  if (webshot) dispatch(setWebshotMode(true));

  const widget = await dispatch(getWidget(id));

  return ({
    widget,
  });
};
