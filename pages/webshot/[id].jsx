// services
import {
  fetchWidget,
} from 'services/widget';

export default function Webshot() {
  return null;
}

export const getServerSideProps = async ({ query }) => {
  const {
    id,
    type: widgetType,
    ...restQueryParams
  } = query;

  const queryParams = new URLSearchParams(restQueryParams);

  const widget = await fetchWidget(id, {
    application: process.env.NEXT_PUBLIC_APPLICATIONS,
  });
  const { type } = widget?.widgetConfig || {};

  return ({
    props: ({}),
    redirect: {
      destination: `/embed/${type || 'widget'}/${id}${queryParams ? `?webshot=true&${queryParams.toString()}` : '?webshot=true'}`,
      permanent: true,
    },
  });
};
