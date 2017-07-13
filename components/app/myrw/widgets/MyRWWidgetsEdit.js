import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

// Services
import UserService from 'services/UserService';
import WidgetService from 'services/WidgetService';

// Components
import Spinner from 'components/ui/Spinner';
import WidgetEditor from 'components/widgets/WidgetEditor';

class MyRWWidgetsEdit extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      widget: null
    };

    // User service
    this.userService = new UserService({ apiURL: process.env.CONTROL_TOWER_URL });
    this.widgetService = new WidgetService(this.props.widgetId, { apiURL: process.env.CONTROL_TOWER_URL });
  }

  componentWillMount() {
    this.widgetService.fetchData().then((data) => {
      this.setState({
        widget: data,
        loading: false
      });
    });
  }


  render() {
    const { loading, widget } = this.state;

    return (
      <div className="c-my-widgets-edit">
        <h1 className="c-text -header-normal -thin title">Edit Widget</h1>
        <Spinner
          className="-relative -light"
          isLoading={loading}
        />
        {widget &&
        <WidgetEditor
        />
        }
      </div>
    );
  }
}

MyRWWidgetsEdit.propTypes = {
  widgetId: PropTypes.string.isRequired,
  // Store
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

export default withRedux(initStore, mapStateToProps, null)(MyRWWidgetsEdit);
