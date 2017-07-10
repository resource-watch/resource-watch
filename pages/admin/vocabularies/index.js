import React from 'react';
import PropTypes from 'prop-types';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

// Components
import VocabulariesForm from 'components/admin/vocabularies/form/VocabulariesForm';
import Layout from 'components/admin/layout/Layout';

class VocabulariesIndex extends React.Component {

  render() {
    return (
      <Layout
        title="Vocabularies"
        description="Vocabularies description..."
      >
        <div className="row">
          <div className="column small-12">
            <VocabulariesForm
              application={process.env.APPLICATIONS}
              authorization={this.props.user.token}
              language="en"
            />
          </div>
        </div>
      </Layout>
    );
  }
}

VocabulariesIndex.propTypes = {
  // Store
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

export default withRedux(initStore, mapStateToProps, null)(VocabulariesIndex);
