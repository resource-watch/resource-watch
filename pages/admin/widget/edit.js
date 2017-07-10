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

class WidgetEdit extends React.Component {

  static async getInitialProps({ query }) {
    const datasetID = query.id;
    const widgetID = query.widget_id;
    return { datasetID, widgetID };
  }

  render() {
    const { datasetID, widgetID } = this.props;
    return (
      <Layout
        title="Edit widget"
        description="Edit widget description..."
      >
        <div className="row">
          <div className="column small-12">
            <Title className="-huge -p-primary">
              Edit Widget
            </Title>
            <WidgetForm
              application={[process.env.APPLICATIONS]}
              authorization={this.props.user.token}
              dataset={datasetID}
              widget={widgetID}
              onSubmit={() => Router.pushRoute('dataset_widgets', { id: datasetID })}
            />
          </div>
        </div>
      </Layout>
    );
  }
}

WidgetEdit.propTypes = {
  datasetID: PropTypes.string.isRequired,
  widgetID: PropTypes.string.isRequired,
  // Store
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

export default withRedux(initStore, mapStateToProps, null)(WidgetEdit);
