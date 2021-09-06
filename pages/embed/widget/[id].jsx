// actions
import { getWidget } from 'redactions/widget';

// hoc
import {
  withRedux,
} from 'hoc/auth';

// components
import LayoutEmbedWidget from 'layout/embed/widget';

export default function EmbedWidgetPage(props) {
  return (<LayoutEmbedWidget {...props} />);
}

export const getServerSideProps = withRedux(async ({ store, query }) => {
  const { dispatch } = store;
  const {
    id,
    webshot,
  } = query;

  await dispatch(getWidget(id, { includes: ['metadata'].join(',') }));

  return ({
    props: ({
      webshot: Boolean(webshot),
    }),
  });
});
