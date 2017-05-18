import React from 'react';
import PropTypes from 'prop-types';
import Session from '../session';
import Header from 'components/layout/header';
import Footer from 'components/layout/footer';
import Head from 'components/layout/head';
import Icons from 'components/layout/icons';

export default class Page extends React.Component {

  // Expose session to all pages
  static async getInitialProps({ req }) {
    const session = new Session({ req });
    return { session: await session.getSession() };
  }

  render() {
    const { title, description } = this.props;
    return (
      <div>
        <Head
          title={title}
          description={description}
        />
        <Icons />
        <Header session={this.props.session} />
        <div className="container">
          { this.props.children }
        </div>
        <Footer />
      </div>
    );
  }

}

Page.propTypes = {
  session: PropTypes.object.isRequired,
  children: PropTypes.any.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
};
