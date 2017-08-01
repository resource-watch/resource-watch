import React from 'react';
import PropTypes from 'prop-types';
import { Router } from 'routes';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

// Components
import PageForm from 'components/admin/pages/form/PageForm';
import Title from 'components/ui/Title';
import Layout from 'components/admin/layout/Layout';

function PageNew(props) {
  return (
    <Layout
      title="New page"
      description="Edit page description..."
    >
      <div className="row">
        <div className="column small-12">
          <Title className="-huge -p-primary">
            Create Static Page
          </Title>
          <PageForm
            application={[process.env.APPLICATIONS]}
            authorization={props.user.token}
            onSubmit={() => Router.pushRoute('pages')}
            mode="new"
          />
        </div>
      </div>
    </Layout>
  );
}

PageNew.propTypes = {
  // Store
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

export default withRedux(initStore, mapStateToProps, null)(PageNew);
