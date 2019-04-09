import React, { PureComponent } from 'react';

// actions
import { getStaticPage } from 'modules/static-pages/actions';

// component
import LayoutHowTo from 'layout/app/how-to';

class HowtoPage extends PureComponent {
  static async getInitialProps({ store }) {
    const { getState, dispatch } = store;
    const { staticPages } = getState();

    if (!Object.keys(staticPages['how-to']).length) await dispatch(getStaticPage('how-to'));

    return {};
  }

  render() {
    return (<LayoutHowTo />);
  }
}

export default HowtoPage;
