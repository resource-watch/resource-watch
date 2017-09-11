import React from 'react';
import PropTypes from 'prop-types';

import { toastr } from 'react-redux-toastr';

// Services
import WidgetsService from 'services/WidgetsService';

// Components
import TetherComponent from 'react-tether';

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

  componentWillUnmount() {
    window.removeEventListener('click', this.onScreenClick);
  }

  /**
   * UI EVENTS
   * - onChange
   * - onToggleDropdown
   * - onScreenClick
  */
  onChange = (id) => {
    const { quill } = this.props;
    // Focus on the editor
    quill.focus();

    // Add widget embed
    const cursorPosition = (quill.getSelection()) ? quill.getSelection().index : 0;

    // { src: `/embed/widget/${id}`, height: 410, width: 500 }

    quill.insertEmbed(cursorPosition, 'iframe', {
      src: `/embed/widget/${id}`,
      width: 500,
      height: 500
    });

    quill.setSelection(cursorPosition + 1);

    // Hide dropdown
    this.onToggleDropdown(false);
  }

  // This function is debounced. If you don't do that insane things will happen
  onToggleDropdown = (to) => {
    this.setState({
      active: to
    });

    requestAnimationFrame(() => {
      if (to) {
        window.addEventListener('click', this.onScreenClick);
      } else {
        window.removeEventListener('click', this.onScreenClick);
      }
    });
  }

  onScreenClick = (e) => {
    const el = document.querySelector('.c-tooltip');
    const clickOutside = el && el.contains && !el.contains(e.target);

    if (clickOutside) {
      this.onToggleDropdown(false);
    }
  }

  render() {
    return (
      <TetherComponent
        attachment="top center"
        constraints={[{
          to: 'window'
        }]}
        targetOffset="10px 0"
        classes={{
          element: 'c-tooltip -arrow-top'
        }}
      >
        {/* First child: This is what the item will be tethered to */}
        <span
          className="c-button -secondary -compressed"
          onClick={() => this.onToggleDropdown(true)}
        >
          Add widget
        </span>

        {/* Second child: If present, this item will be tethered to the the first child */}
        {this.state.active &&
          <div className="c-widget-tooltip-list">
            <div className="tooltip-content">
              <ul className="tooltip-list">
                {this.state.widgets.map(w =>
                  (
                    <li
                      key={w.id}
                    >
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => { this.onChange(w.id); }}
                      >
                        {w.name}
                      </div>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
        }
      </TetherComponent>
    );
  }
}

ToolbarWidgetBtn.propTypes = {
  quill: PropTypes.any // ???
};


export default ToolbarWidgetBtn;
