import React from 'react';
import { Router } from 'routes';
import PropTypes from 'prop-types';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

// Components
import WidgetForm from 'components/admin/widget/form/WidgetForm';
import Title from 'components/ui/Title';
import Layout from 'components/admin/layout/Layout';

class WidgetNew extends React.Component {

  static async getInitialProps({ query }) {
    const datasetID = query.id;
    return { datasetID };
  }

  render() {
    const { datasetID } = this.props;
    return (
      <Layout
        title="Dataset widgets"
        description="Dataset widgets description"
      >
        <div className="row">
          <div className="column small-12">
            <Title className="-huge -p-primary">
              New Widget
            </Title>
            <WidgetForm
              application={[process.env.APPLICATIONS]}
              authorization={this.props.user.token}
              dataset={datasetID}
              onSubmit={() => Router.pushRoute('dataset_widgets', { id: datasetID })}
            />
          </div>
        </div>
      </Layout>
    );
  }
}

WidgetNew.propTypes = {
  datasetID: PropTypes.string.isRequired,
  // Store
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

export default withRedux(initStore, mapStateToProps, null)(WidgetNew);
