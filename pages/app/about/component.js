import React, { PureComponent } from 'react';

// actions
import { getStaticPage } from 'modules/static-pages/actions';

// components
import AboutLayout from 'layout/app/about';

class AboutPage extends PureComponent {
  static async getInitialProps({ store }) {
    // fetchs static data for about page
    await store.dispatch(getStaticPage('about'));

    return {};
  }

  render() {
    return (<AboutLayout />);
  }
}

export default AboutPage;
