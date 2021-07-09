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
  } = query;

  const widget = await fetchWidget(id, {
    application: process.env.NEXT_PUBLIC_APPLICATIONS,
  });
  const { type } = widget?.widgetConfig || {};

  return ({
    props: ({}),
    redirect: {
      destination: `/embed/${type || 'widget'}/${id}?webshot=true`,
      permanent: true,
    },
  });
};
