import { GetServerSideProps } from 'next';

// components
import LayoutEmbedWidget from 'layout/embed/widget';

export interface EmbedWidgetPageProps {
  isWebshot: boolean;
  widgetId: string;
  params: Record<string, string | number>;
}

const EmbedWidgetPage = (props: EmbedWidgetPageProps): JSX.Element => {
  return <LayoutEmbedWidget {...props} />;
};

export default EmbedWidgetPage;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { id: widgetId, webshot, type, ...restQueryParams } = query;

  const queryParams = new URLSearchParams(restQueryParams as Record<string, string>);

  // the webshot endpoint in the WRI API works with this page to render different
  // types of widgets so we redirect from here, according to the widget type to
  // render the widget and take the snapshot
  if (['map', 'map-swipe'].includes(type as string)) {
    return {
      redirect: {
        destination: `/embed/${type}/${widgetId}${queryParams ? `?${queryParams.toString()}` : ''}`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      isWebshot: Boolean(webshot),
      widgetId,
      params: restQueryParams,
    },
  };
};
