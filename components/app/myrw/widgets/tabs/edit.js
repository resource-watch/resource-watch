import React from 'react';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';

// Redux
import { connect } from 'react-redux';

// Services
import {
  fetchWidget,
  updateWidget
} from 'services/widget';

// Widget Editor
import WidgetEditor from '@widget-editor/widget-editor';
import RwAdapter from '@widget-editor/rw-adapter';

// Utils
import DefaultTheme from 'utils/widgets/theme';

// Components
import Spinner from 'components/ui/Spinner';

class WidgetsEdit extends React.Component {
  state = {
    loading: true,
    widget: null
  };

  UNSAFE_componentWillMount() {
    const { id } = this.props;
    fetchWidget(id)
      .then((data) => {
        this.setState({
          widget: data,
          loading: false
        });
      })
      .catch(err => {
        toastr.error('Error loading widget');
        console.error('Error loading widget', err);
      })
  }

  onSaveWidget = (widgetData) => {

    this.setState({ loading: true });
    const { widget } = this.state;
    const { user } = this.props;

    const widgetObj = {
      ...widget,
      ...widgetData.attributes
    };

    updateWidget(widgetObj, user.token)
      .then(() => {
        this.setState({ loading: false });
        toastr.success('Success', 'Widget updated successfully!');
      }).catch((err) => {
        this.setState({ loading: false });
        toastr.error('Error', err);
      });
  }

  render() {
    const { loading, widget } = this.state;
    return (
      <div className="c-myrw-widgets-edit">
        <Spinner
          className="-light"
          isLoading={loading}
        />
        {widget &&
          <div>
            <WidgetEditor
              datasetId={widget.dataset}
              widgetId={widget.id}
              application="rw"
              onSave={this.onSaveWidget}
              theme={DefaultTheme}
              adapter={RwAdapter}
            />
          </div>
        }
      </div>
    );
  }
}

WidgetsEdit.propTypes = {
  id: PropTypes.string.isRequired,
  // Store
  user: PropTypes.object.isRequired,
  locale: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  user: state.user,
  locale: state.common.locale
});

export default connect(mapStateToProps, null)(WidgetsEdit);
