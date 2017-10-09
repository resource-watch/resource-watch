import React from 'react';
import PropTypes from 'prop-types';

import dock from 'services/Dock';

// Components
import DockWidget from 'components/dashboards/wysiwyg/DockWidget';

class ToolbarWidgetBtn extends React.Component {
  // This function is debounced. If you don't do that insane things will happen
  onToggleDock = () => {
    dock.toggleDock(true, {
      children: DockWidget,
      childrenProps: {
        quill: this.props.quill
      }
    });
  }

  render() {
    // console.log(this.state.widgets.filter(w => w.widgetConfig.type).map(w => `${w.id} - ${w.widgetConfig.type}`));

    return (
      <span
        className="c-button -secondary -compressed"
        onClick={() => this.onToggleDock(true)}
      >
        Add widget
      </span>
    );
  }
}

ToolbarWidgetBtn.propTypes = {
  quill: PropTypes.any
};


export default ToolbarWidgetBtn;
