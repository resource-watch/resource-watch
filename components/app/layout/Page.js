import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

// Components
import User from 'components/user';
import { Router } from '../../../routes';

Router.onRouteChangeStart = () => {
  document.body.classList.add('-loading');
};

Router.onRouteChangeComplete = () => {
  document.body.classList.remove('-loading');
};

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
  user: PropTypes.object
};

export default Page;
