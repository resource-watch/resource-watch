import React from 'react';
import { Router } from 'routes';
import PropTypes from 'prop-types';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

// Components
import PartnerForm from 'components/admin/partners/form/PartnerForm';
import Title from 'components/ui/Title';
import Layout from 'components/admin/layout/Layout';

class PartnerEdit extends React.Component {

  static async getInitialProps({ query }) {
    const partnerID = query.id;
    return { partnerID };
  }

  render() {
    const { partnerID } = this.props;
    return (
      <Layout
        title="Edit partner"
        description="Edit partner description..."
      >
        <div className="row">
          <div className="column small-12">
            <Title className="-huge -p-primary">
              Edit Partner
            </Title>
            <PartnerForm
              application={[process.env.APPLICATIONS]}
              authorization={this.props.user.token}
              partner={partnerID}
              onSubmit={() => Router.pushRoute('partners')}
              mode="edit"
            />
          </div>
        </div>
      </Layout>
    );
  }
}

PartnerEdit.propTypes = {
  partnerID: PropTypes.string,
  // Store
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

export default withRedux(initStore, mapStateToProps, null)(PartnerEdit);
