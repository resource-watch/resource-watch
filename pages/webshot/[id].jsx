// utils
import WRISerializer from 'wri-json-api-serializer';
import { WRIAPI } from 'utils/axios';

// TO-DO: make API route instead of a page
export default function Webshot() {}

Webshot.getInitialProps = async ({ res, query }) => {
  const {
    id,
  } = query;

  await WRIAPI.get(`/v1/widget/${id}`, {
    headers: { 'Upgrade-Insecure-Requests': 1 },
    params: { application: process.env.NEXT_PUBLIC_APPLICATIONS },
    transformResponse: [].concat(
      WRIAPI.defaults.transformResponse,
      ({ data }) => data,
    ),
  })
    .then((response) => WRISerializer(response))
    .then((widget) => {
      const { widgetConfig } = widget;
      const { type } = widgetConfig;

      // if a widget has no type, it will be redirected to embed/widget page by default
      res.redirect(`/embed/${type || 'widget'}/${id}?webshot=true`);
    });

  return ({});
};
