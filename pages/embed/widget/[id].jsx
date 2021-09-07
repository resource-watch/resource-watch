// components
import LayoutEmbedWidget from 'layout/embed/widget';

export default function EmbedWidgetPage(props) {
  return (<LayoutEmbedWidget {...props} />);
}

export const getServerSideProps = async ({ query }) => {
  const {
    id: widgetId,
    webshot,
    type,
  } = query;

  // the webshot endpoint in the WRI API works with this page to render different
  // types of widgets so we redirect from here, according to the widget type to
  // render the widget and take the snapshot

  if (type === 'map') {
    return {
      redirect: {
        destination: `/embed/map/${widgetId}`,
        permanent: false,
      },
    };
  }

  return ({
    props: ({
      isWebshot: Boolean(webshot),
      widgetId,
    }),
  });
};
