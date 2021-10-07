// actions
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
  query,
}) => {
  const {
    dispatch,
    getState,
  } = store;
  const { user } = getState();
  const {
    id,
  } = query;

  await dispatch(getWidget(id));
  if (user.id) dispatch(checkIfFavorited(id));

  return ({
    props: ({}),
  });
}));
