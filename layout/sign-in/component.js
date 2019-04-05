import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// components
import Layout from 'layout/layout/layout-app';
import LoginModal from 'components/modal/login-modal';

class SigIn extends PureComponent {
  static propTypes = { text: PropTypes.string }

  static defaultProps = { text: '' }

  render() {
    const { text } = this.props;
    return (
      <Layout
        className="l-log-in-layout"
        title="Resource Watch Sign-in/Register"
        description="Resource Watch Sign-in/Register"
      >
        <div className="l-container">
          <div className="content">
            <LoginModal text={text || ' '} />
          </div>
        </div>
      </Layout>
    );
  }
}

export default SigIn;
