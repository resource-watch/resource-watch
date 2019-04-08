import React, { PureComponent } from 'react';

// actions
import { getFaqs } from 'redactions/admin/faqs';

// components
import LayoutFaqs from 'layout/app/faqs';

class FaqsPage extends PureComponent {
  static async getInitialProps({ store }) {
    const { getState, dispatch } = store;
    const { faqs: { list } } = getState();

    if (!list.length) await dispatch(getFaqs());

    return {};
  }

  render() {
    return (<LayoutFaqs />);
  }
}

export default FaqsPage;
