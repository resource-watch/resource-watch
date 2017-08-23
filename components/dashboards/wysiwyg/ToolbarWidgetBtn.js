import React from 'react';
import PropTypes from 'prop-types';

import { AtomicBlockUtils } from 'draft-js';

import { toastr } from 'react-redux-toastr';

// Services
import WidgetsService from 'services/WidgetsService';

// Components
import TetherComponent from 'react-tether';

class ToolbarWidgetBtn extends React.Component {
  static propTypes = {
    editorState: PropTypes.object,
    onChange: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
      active: false,
      widgets: [],
      widget: null
    };

    this.widgetsService = new WidgetsService();
  }

  componentWillMount() {
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
    const { editorState } = this.props;
    const entityKey = editorState
      .getCurrentContent()
      // If I try to use relative urls draftToHtml library won't parse the src...
      .createEntity('EMBEDDED_LINK', 'MUTABLE', { src: `https://staging.resourcewatch.org/embed/widget/${id}`, height: 410, width: 500 })
      .getLastCreatedEntityKey();

    const newEditorState = AtomicBlockUtils.insertAtomicBlock(
      editorState,
      entityKey,
      ' ',
    );

    this.props.onChange(newEditorState);
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
      <div className="rdw-custom-wrapper">
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
          <button
            type="button"
            className="c-button -secondary -compressed"
            onClick={() => this.onToggleDropdown(true)}
          >
            Add widget
          </button>

          {/* Second child: If present, this item will be tethered to the the first child */}
          {this.state.active &&
            <div className="c-widget-tooltip-list">
              <div className="tooltip-content">
                <ul className="tooltip-list">
                  {this.state.widgets.map((w) => {
                    return (
                      <li
                        key={w.id}
                        onClick={() => { this.onChange(w.id); }}
                      >
                        {w.name}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          }
        </TetherComponent>
      </div>
    );
  }
}

export default ToolbarWidgetBtn;
