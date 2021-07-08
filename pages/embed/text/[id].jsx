// actions
import { setEmbed, setWebshotMode } from 'redactions/common';
import { getWidget } from 'redactions/widget';

// hoc
import {
  withRedux,
  withUserServerSide,
} from 'hoc/auth';

// components
import LayoutEmbedText from 'layout/embed/text';

export default function EmbedTextPage(props) {
  return (<LayoutEmbedText {...props} />);
}

export const getServerSideProps = withRedux(withUserServerSide(async ({ store, query }) => {
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
    props: ({
      widget,
    }),
  });
}));
