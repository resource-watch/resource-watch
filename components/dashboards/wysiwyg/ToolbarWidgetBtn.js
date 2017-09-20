import React from 'react';
import PropTypes from 'prop-types';

import { toastr } from 'react-redux-toastr';
import dock from 'services/Dock';

// Services
import WidgetsService from 'services/WidgetsService';

class ToolbarWidgetBtn extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      active: false,
      widgets: [],
      widget: null
    };

    this.widgetsService = new WidgetsService();
  }

  componentDidMount() {
    this.widgetsService.fetchAllData({})
      .then((widgets) => {
        this.setState({ widgets });
      })
      .catch((err) => {
        toastr.error(err);
      });
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

      // Hide dropdown
      this.onToggleDock(false);
    } else {
      toastr.error('Quill is not defined');
    }
  }

  // This function is debounced. If you don't do that insane things will happen
  onToggleDock = (to) => {
    dock.toggleDock(true, {

    });
  }

  render() {
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
  quill: PropTypes.any // ???
};


export default ToolbarWidgetBtn;
