import React from 'react';
import PropTypes from 'prop-types';
import { Router } from '../../../routes';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

// Components
import Title from 'components/ui/Title';
import Layout from 'components/admin/layout/Layout';
import PageForm from 'components/admin/pages/PageForm';

class PageEdit extends React.Component {

  static async getInitialProps({ query }) {
    const pageID = query.id;
    return { pageID };
  }

  render() {
    const { pageID } = this.props;
    return (
      <Layout
        title="Edit page"
        description="Edit page description..."
      >
        <div className="row">
          <div className="column small-12">
            <Title className="-huge -p-primary">
              Edit Page
            </Title>
            <PageForm
              application={['rw']}
              authorization={this.props.user.token}
              page={pageID}
              onSubmit={() => Router.pushRoute('pages')}
              mode="edit"
            />
          </div>
        </div>
      </Layout>
    );
  }
}

PageEdit.propTypes = {
  // Store
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

export default withRedux(initStore, mapStateToProps, null)(PageEdit);
