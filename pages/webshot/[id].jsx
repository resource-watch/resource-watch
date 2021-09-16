// services
import {
  fetchWidget,
} from 'services/widget';

// utils
import {
  getWidgetType,
} from 'utils/widget';

export default function Webshot() {
  return null;
}

export const getServerSideProps = async ({ query }) => {
  const {
    id,
    ...restQueryParams
  } = query;

  const queryParams = new URLSearchParams(restQueryParams);

  const widget = await fetchWidget(id, {
    application: process.env.NEXT_PUBLIC_APPLICATIONS,
  });

  const widgetType = getWidgetType(widget);

  return ({
    props: ({}),
    redirect: {
      destination: `/embed/${widgetType}/${id}${queryParams ? `?webshot=true&${queryParams.toString()}` : '?webshot=true'}`,
      permanent: true,
    },
  });
};
