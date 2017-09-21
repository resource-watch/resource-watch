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
import WidgetList from 'components/widgets/WidgetList';

class DockWidget extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      step: 0,
      tab: 'my-widgets',
      widgets: [],
      widgetCollections: []
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
          widgetCollections: response[1]
        });
      })
      .catch((err) => {
        toastr.error(err);
      });
  }

  onChangeTab = (tab) => {
    this.setState({ tab });
  }

  /**
   * UI EVENTS
   * - onChange
   * - onToggleDock
  */
  onChange = (id) => {
    const { quill } = this.props;

    if (quill) {
      // Focus on the editor
      quill.focus();

      // Add widget embed
      const cursorPosition = (quill.getSelection()) ? quill.getSelection().index : 0;

      quill.insertEmbed(cursorPosition, 'iframe', {
        src: `/embed/widget/${id}`,
        width: 500,
        height: 500
      });

      quill.setSelection(cursorPosition + 1);
    } else {
      toastr.error('Quill is not defined');
    }
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

        <div className="c-page-section dock-widget-container">
          {this.state.tab === 'my-widgets' &&
            <div className="row">
              <div className="column">
                My widgets
              </div>
            </div>
            // <WidgetList
            //   widgets={this.state.widgets.filter(w => w.userId === this.props.user.id)}
            // />
          }
          {this.state.tab === 'all-widgets' &&
            <div className="row">
              <div className="column">
                All widgets
              </div>
            </div>
            // <WidgetList
            //   widgets={this.state.widgets.filter(w => w.userId !== this.props.user.id)}
            // />
          }
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
