import React from 'react';
import PropTypes from 'prop-types';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

// Components
import Layout from 'components/admin/layout/Layout';
import PartnersTable from 'components/admin/partners/table/PartnersTable';
import ButtonContainer from 'components/ui/ButtonContainer';
import Title from 'components/ui/Title';

class PartnersIndex extends React.Component {

  render() {
    return (
      <Layout
        title="Partners"
        description="Partners description..."
      >
        <div className="row">
          <div className="column small-12">
            <Title className="-huge -p-primary">
              Partners
            </Title>
            <ButtonContainer
              className="-j-end"
              buttons={[{
                label: 'New +',
                path: '/admin/partners/new',
                className: ''
              }]}
            />
            <PartnersTable
              application={['rw']}
              authorization={this.props.user.token}
            />
          </div>
        </div>
      </Layout>
    );
  }
}

PartnersIndex.propTypes = {
  // Store
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

export default withRedux(initStore, mapStateToProps, null)(PartnersIndex);
