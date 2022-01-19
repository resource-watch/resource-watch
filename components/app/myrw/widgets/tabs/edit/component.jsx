import React from 'react';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';
import WidgetEditor from '@widget-editor/widget-editor';

// components
import Spinner from 'components/ui/Spinner';

// cervices
import {
  fetchWidget,
  updateWidget,
  createWidgetMetadata,
  updateWidgetMetadata,
} from 'services/widget';

// constants
import {
  WIDGET_EDITOR_DEFAULT_THEME,
  WIDGET_EDITOR_COLOUR_SCHEMES,
  WIDGET_EDITOR_MAPBOX_PROPS,
} from 'constants/widget-editor';

class MyRWWidgetEditTab extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      widget: null,
    };
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillMount() {
    const { id } = this.props;
    fetchWidget(id, { includes: 'metadata' })
      .then((data) => {
        this.setState({
          widget: data,
          loading: false,
        });
      })
      .catch(() => {
        toastr.error('Error loading widget');
      });
  }

  onSaveWidget = (widgetData) => {
    this.setState({ loading: true });
    const { widget } = this.state;
    const { user } = this.props;

    const widgetObj = {
      ...widget,
      name: widgetData.name,
      description: widgetData.description,
      widgetConfig: widgetData.widgetConfig,
    };

    updateWidget(widgetObj, user.token)
      .then(() => {
        const widgetHasMetadata = widget.metadata && widget.metadata.length > 0;
        if (widgetHasMetadata) {
          updateWidgetMetadata(
            widget.id,
            widget.dataset,
            {
              ...widget.metadata[0],
              info: {
                ...widget.metadata[0].info,
                caption: widgetData.metadata.caption,
              },
            },
            user.token,
          ).then(() => {
            this.setState({ loading: false });
            toastr.success('Success', 'Widget updated successfully!');
          });
        } else {
          createWidgetMetadata(
            widget.id,
            widget.dataset,
            {
              language: 'en',
              info: {
                caption: widgetData.metadata.caption,
              },
            },
            user.token,
          ).then(() => {
            this.setState({ loading: false });
            toastr.success('Success', 'Widget updated successfully!');
          });
        }
      })
      .catch((err) => {
        this.setState({ loading: false });
        toastr.error('Error', err);
      });
  };

  render() {
    const { RWAdapter } = this.props;
    const { loading, widget } = this.state;

    return (
      <div className="c-myrw-widgets-edit">
        <Spinner className="-light" isLoading={loading} />
        {widget && (
          <WidgetEditor
            datasetId={widget.dataset}
            widgetId={widget.id}
            onSave={this.onSaveWidget}
            theme={WIDGET_EDITOR_DEFAULT_THEME}
            adapter={RWAdapter}
            map={WIDGET_EDITOR_MAPBOX_PROPS}
            schemes={WIDGET_EDITOR_COLOUR_SCHEMES}
          />
        )}
      </div>
    );
  }
}

MyRWWidgetEditTab.propTypes = {
  id: PropTypes.string.isRequired,
  user: PropTypes.shape({
    token: PropTypes.string.isRequired,
  }).isRequired,
  RWAdapter: PropTypes.func.isRequired,
};

export default MyRWWidgetEditTab;
