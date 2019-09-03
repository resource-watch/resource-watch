import React, { PureComponent } from 'react';

// components
import Layout from 'layout/layout/layout-app';
import LoginModal from 'components/modal/login-modal';

// styles
import './styles.scss';

class SigIn extends PureComponent {
  render() {
    return (
      <Layout
        className="l-log-in"
        title="Resource Watch Sign-in/Register"
        description="Resource Watch Sign-in/Register"
      >
        <div className="l-container">
          <div className="content">
            <LoginModal />
          </div>
        </div>
      </Layout>
    );
  }
}

export default SigIn;
