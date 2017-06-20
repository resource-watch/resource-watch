import React from 'react';
import PropTypes from 'prop-types';
import Header from 'components/admin/layout/header';
import Head from 'components/admin/layout/head';
import Icons from 'components/admin/layout/icons';
import Tooltip from 'components/ui/Tooltip';

export default class Page extends React.Component {

  // Expose session to all pages
  static async getInitialProps({ req }) {
    const session = new Session({ req });
    return { session: await session.getSession() };
  }

  render() {
    const { title, description } = this.props;
    return (
      <div className="c-page">
        <Head
          title={title}
          description={description}
        />
        <Icons />
        <Header session={this.props.session} />
        <div className="container">
          { this.props.children }
        </div>
        <Tooltip />
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
