import React from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';

import { toastr } from 'react-redux-toastr';
import dock from 'services/Dock';

// Services
import WidgetsService from 'services/WidgetsService';

// Components
import Tabs from 'components/ui/Tabs';
import Spinner from 'components/ui/Spinner';
import WidgetsList from './DockWidgetsList';

class DockWidget extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      step: 0,
      tab: 'my-widgets',
      widgetsLoading: true,
      widgets: [],
      widgetCollections: [],
      widgetsSelected: []
    };

    this.widgetsService = new WidgetsService({
      user: props.user
    });
  }

  componentDidMount() {
    const promises = [
      this.widgetsService.fetchAllData({ includes: 'widget' }),
      this.widgetsService.fetchCollections()
    ];

    Promise.all(promises)
      .then((response) => {
        this.setState({
          widgets: response[0],
          widgetCollections: response[1],
          widgetsLoading: false
        });
      })
      .catch((err) => {
        this.setState({
          widgetsLoading: false
        });
        toastr.error(err);
      });
  }

  /**
   * UI EVENTS
   * - onChangeTab
   * - onSelect
   * - onAdd
   * - onCancel
  */

  onChangeTab = (tab) => {
    this.setState({ tab });
  }

  onSelect = (widget) => {
    const widgetsSelected = [...this.state.widgetsSelected];
    const index = widgetsSelected.findIndex(w => w.id === widget.id);

    if (index >= 0) {
      widgetsSelected.splice(index, 1);
    } else if (widgetsSelected.length < 3) {
      widgetsSelected.push({ id: widget.id, type: widget.widgetConfig.type });
    } else {
      toastr.warning('Warning', 'You can only select 3 widgets per line');
    }

    this.setState({
      widgetsSelected
    });
  }

  onAdd = () => {
    const { quill } = this.props;
    const { widgetsSelected } = this.state;

    if (quill) {
      // Focus on the editor
      quill.focus();

      // Add widget embed
      const cursorPosition = (quill.getSelection()) ? quill.getSelection().index : 0;

      quill.insertEmbed(cursorPosition, 'widget-layout', { widgets: widgetsSelected });

      // quill.insertEmbed(cursorPosition, 'iframe', {
      //   src: `/embed/${w.type || 'widget'}/${w.id}`,
      //   width: 500,
      //   height: 500
      // });
      quill.setSelection(cursorPosition + 1);

      dock.toggleDock(false);
    } else {
      toastr.error('Quill is not defined');
    }
  }

  onCancel = () => {
    dock.toggleDock(false);
  }

  render() {
    return (
      <div className="c-dock-widget">
        <div className="c-page-header -admin dock-widget-header">
          <div className="row">
            <div className="column small-12">
              <div className="page-header-content -with-tabs">
                <h1>Select widgets</h1>
                <Tabs
                  options={[
                    { label: 'My widgets', value: 'my-widgets' },
                    { label: 'All widgets', value: 'all-widgets' }
                  ]}
                  defaultSelected={this.state.tab}
                  selected={this.state.tab}
                  onChange={this.onChangeTab}
                />
              </div>
            </div>
          </div>
        </div>

        <Spinner isLoading={this.state.widgetsLoading} className="-light" />

        <div className="c-page-section dock-widget-container">
          {this.state.tab === 'my-widgets' &&
            <WidgetsList
              widgets={this.state.widgets.filter(w => w.userId === this.props.user.id)}
              widgetsSelected={this.state.widgetsSelected.map(w => w.id)}
              onSelect={this.onSelect}
            />
          }
          {this.state.tab === 'all-widgets' &&
            <WidgetsList
              widgets={this.state.widgets.filter(w => w.userId !== this.props.user.id)}
              widgetsSelected={this.state.widgetsSelected.map(w => w.id)}
              onSelect={this.onSelect}
            />
          }
        </div>

        <div className="c-page-section dock-widget-container">
          <div className="c-button-container -j-end">
            <ul>
              <li>
                <button
                  type="button"
                  className="c-button -secondary"
                  onClick={this.onCancel}
                >
                  Cancel
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="c-button -primary"
                  onClick={this.onAdd}
                >
                  Add Widgets
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

DockWidget.propTypes = {
  user: PropTypes.object,
  quill: PropTypes.any // ???
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, null)(DockWidget);
