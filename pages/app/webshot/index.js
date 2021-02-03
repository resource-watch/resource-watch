import { PureComponent } from 'react';

// utils
import WRISerializer from 'wri-json-api-serializer';
import { WRIAPI } from 'utils/axios';

class Webshot extends PureComponent {
  static async getInitialProps(props) {
    const { query, res } = props;
    const { id } = query;

    await WRIAPI.get(`/widget/${id}`, {
      headers: { 'Upgrade-Insecure-Requests': 1 },
      params: { application: process.env.APPLICATIONS },
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

    return {};
  }
}

export default Webshot;
