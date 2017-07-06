import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { setUser } from 'redactions/user';

// Components
import User from 'components/user';

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
    // Save user in the store
    this.props.setUser(this.props.user);
  }
}

Page.propTypes = {
  user: PropTypes.object,
  // Store
  setUser: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  setUser: (user) => { dispatch(setUser(user)); }
});

export default withRedux(initStore, null, mapDispatchToProps)(Page);
