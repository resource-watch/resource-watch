import React from 'react';
import PropTypes from 'prop-types';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

// Components
import Layout from 'components/admin/layout/Layout';
import InsightsTable from 'components/admin/insights/table/InsightsTable';
import ButtonContainer from 'components/ui/ButtonContainer';
import Title from 'components/ui/Title';

class InsightsIndex extends React.Component {

  render() {
    return (
      <Layout
        title="Insights"
        description="Insights description..."
      >
        <div className="row">
          <div className="column small-12">
            <Title className="-huge -p-primary">
              Insights
            </Title>
            <ButtonContainer
              className="-j-end"
              buttons={[{
                label: 'New +',
                path: '/admin/insights/new',
                className: ''
              }]}
            />
            <InsightsTable
              application={[process.env.APPLICATIONS]}
              authorization={this.props.user.token}
            />
          </div>
        </div>
      </Layout>
    );
  }
}

InsightsIndex.propTypes = {
  // Store
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

export default withRedux(initStore, mapStateToProps, null)(InsightsIndex);
