import React from 'react';
import PropTypes from 'prop-types';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

// Components
import WidgetForm from 'components/admin/widget/form/WidgetForm';

class WidgetShow extends React.Component {

  render() {
    return (
      <WidgetForm
        application={[process.env.APPLICATIONS]}
        authorization={this.props.user.token}
        widget={this.props.id}
      />
    );
  }

}

WidgetShow.propTypes = {
  id: PropTypes.string,
  // Store
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

export default withRedux(initStore, mapStateToProps, null)(WidgetShow);
