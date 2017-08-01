import React from 'react';
import PropTypes from 'prop-types';
import { Router } from 'routes';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

// Components
import PartnerForm from 'components/admin/partners/form/PartnerForm';
import Title from 'components/ui/Title';
import Layout from 'components/admin/layout/Layout';

function PartnerNew(props) {
  return (
    <Layout
      title="New partner"
      description="Edit partner description..."
    >
      <div className="row">
        <div className="column small-12">
          <Title className="-huge -p-primary">
            Create Partner
          </Title>
          <PartnerForm
            application={[process.env.APPLICATIONS]}
            authorization={props.user.token}
            onSubmit={() => Router.pushRoute('partners')}
            mode="new"
          />
        </div>
      </div>
    </Layout>
  );
}

PartnerNew.propTypes = {
  // Store
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

export default withRedux(initStore, mapStateToProps, null)(PartnerNew);
