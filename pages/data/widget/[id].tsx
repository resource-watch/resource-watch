import { GetServerSideProps } from 'next';

// components
import LayoutWidgetDetail from 'layout/app/widget-detail';

export interface WidgetDetailPageProps {
  widgetId: string;
  queryParams?: Record<string, string | number>;
}

const WidgetDetailPage = (props: WidgetDetailPageProps): JSX.Element => {
  return <LayoutWidgetDetail {...props} />;
};

export default WidgetDetailPage;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { id: widgetId, ...queryParams } = query;

  if (!widgetId) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      widgetId,
      queryParams,
    },
  };
};
