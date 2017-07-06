import React from 'react';
import PropTypes from 'prop-types';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

// Components
import Layout from 'components/admin/layout/Layout';
import PagesTable from 'components/admin/pages/table/PagesTable';
import ButtonContainer from 'components/ui/ButtonContainer';
import Title from 'components/ui/Title';

class PagesIndex extends React.Component {

  render() {
    return (
      <Layout
        title="Pages"
        description="Pages description..."
      >
        <div className="row">
          <div className="column small-12">
            <Title className="-huge -p-primary">
              Pages
            </Title>
            <ButtonContainer
              className="-j-end"
              buttons={[{
                label: 'New +',
                path: '/admin/insights/new',
                className: ''
              }]}
            />
            <PagesTable
              application={['rw']}
              authorization={this.props.user.token}
            />
          </div>
        </div>
      </Layout>
    );
  }
}

PagesIndex.propTypes = {
  // Store
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

export default withRedux(initStore, mapStateToProps, null)(PagesIndex);
