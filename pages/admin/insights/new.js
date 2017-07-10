import React from 'react';
import { Router } from 'routes';
import PropTypes from 'prop-types';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

// Components
import InsightForm from 'components/admin/insights/form/InsightForm';
import Title from 'components/ui/Title';
import Layout from 'components/admin/layout/Layout';

class InsightEdit extends React.Component {

  render() {
    return (
      <Layout
        title="New insight"
        description="Edit insight description..."
      >
        <div className="row">
          <div className="column small-12">
            <Title className="-huge -p-primary">
              Create Insight
            </Title>
            <InsightForm
              application={[process.env.APPLICATIONS]}
              authorization={this.props.user.token}
              onSubmit={() => Router.pushRoute('insights')}
              mode="new"
            />
          </div>
        </div>
      </Layout>
    );
  }
}

InsightEdit.propTypes = {
  // Store
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

export default withRedux(initStore, mapStateToProps, null)(InsightEdit);
