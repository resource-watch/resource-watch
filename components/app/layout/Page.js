import React from 'react';
import User from 'components/user';
import isEmpty from 'lodash/isEmpty';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

class Page extends React.Component {

  // Expose session to all pages
  static async getInitialProps({ req }) {
    this.user = new User({ req });

    return {
      user: await this.user.getUser()
    };
  }

  componentDidMount() {
    if (isEmpty(this.props.user)) {
      try {
        localStorage.removeItem('user');
      } catch (err) {
        console.info(err);
      }
    }
  }
}

Page.propTypes = {
  user: React.PropTypes.object
};

export default withRedux(initStore, mapDispatchToProps)(Page);
