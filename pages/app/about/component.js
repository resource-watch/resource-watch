import React, { PureComponent } from 'react';

// actions
import { getStaticData } from 'redactions/static_pages';

// components
import AboutLayout from 'layout/app/about';

class AboutPage extends PureComponent {
  static async getInitialProps({ store }) {
    // fetchs static data for about page
    await store.dispatch(getStaticData('about'));

    return {};
  }

  render() {
    return (<AboutLayout />);
  }
}

export default AboutPage;
