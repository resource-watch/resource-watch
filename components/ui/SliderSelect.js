import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Autobind } from 'es-decorators';

// Components
import Icon from 'components/ui/Icon';


// Types
/**
 * Item of the selector
 * The "as" attribute is an alternate label displayed when the
 * option is selected and the dropdown is closed as the placeholder
 * of the component
 * @typedef {{ label: string, value: string, as?: string, items?: Item[] }} Item
 */

export default class SliderSelect extends React.Component {

  constructor(props) {
    super(props);

    // If the parent component asked for the method to reset
    // the component, we give it
    if (props.getResetCallback) {
      props.getResetCallback(this.reset.bind(this));
    }

    this.state = {
      /** @type {Item} */
      selectedItem: props.options
        ? props.options.find(item => item.value === props.value)
        : null,
      closed: true,
      fullList: props.options || [], // Original list of options
      filteredOptions: props.options || [], // Filtered list of options
      pathToCurrentItemsList: [], // List of all of the items leading to the current list
      pathToSelectedItem: [], // Same as pathToCurrentItemsList but for the selected item
      selectedIndex: 0 // Index of the selected option (via the keyboard)
    };
  }

  componentWillReceiveProps(newProps) {
    // If we get the list of options asynchronously...
    if (newProps.options.length && !this.state.fullList.length) {
      this.setState({
        fullList: newProps.options || [],
        filteredOptions: newProps.options || []
      });
    }

    // If we get new options...
    if (newProps.options !== this.props.options) {
      const selectedIndex = (newProps.options && newProps.value)
        ? newProps.options.findIndex(item => item.value === newProps.value)
        : -1;

      const selectedItem = selectedIndex !== -1
        ? newProps.options[selectedIndex]
        : null;

      this.setState({
        fullList: newProps.options || [],
        filteredOptions: newProps.options || [],
        selectedItem,
        selectedIndex: selectedIndex !== -1 ? selectedIndex : 0,
        pathToCurrentItemsList: [],
        pathToSelectedItem: []
      });
    }

    // If the callback to get the reset method changes...
    if (this.props.getResetCallback !== newProps.getResetCallback && newProps.getResetCallback) {
      newProps.getResetCallback(this.reset.bind(this));
    }
  }

  componentWillUnmount() {
    // We remove the handler that is used to close the
    // dropdown when the user clicks outside
    window.removeEventListener('click', this.onScreenClick);
  }

  /**
   * Event handler executed when the user types in the
   * search input
   * @param {KeyboardEvent} evt
   */
  @Autobind
  onType(evt) {
    switch (evt.keyCode) {

      // key up
      case 38: {
        const index = this.state.selectedIndex > 0
          ? this.state.selectedIndex - 1
          : this.state.filteredOptions.length - 1;
        this.setSelectedIndex(index);
        break;
      }

      // key down
      case 40: {
        const index = (this.state.selectedIndex < this.state.filteredOptions.length - 1)
          ? this.state.selectedIndex + 1
          : 0;
        this.setSelectedIndex(index);
        break;
      }

      // enter key
      case 13: {
        if (this.state.selectedIndex !== -1 && this.state.filteredOptions.length) {
          const selectedItem = this.state.filteredOptions[this.state.selectedIndex];
          this.selectItem(selectedItem);
        }
        break;
      }

      // esc key
      case 27: {
        this.close();
        break;
      }

      // Typing text
      default: {
        const target = evt.currentTarget;

        // We can't get the value of the input before
        // the input gets updated
        setTimeout(() => {
          /** @type {string} */
          const value = target.value;
          const listTofilter = this.getItemsListAtCurrentLevel(this.state.pathToCurrentItemsList);
          const filteredOptions = listTofilter
            .filter(item => item.label.toLowerCase().match(value.toLowerCase()));
          this.setState({ filteredOptions });
        }, 0);
        break;
      }
    }
  }

  /**
   * Event handler executed when the user places the
   * focus on the search input
   */
  @Autobind
  onEnterSearch() {
    if (this.state.closed) this.open();
  }

  /**
   * Event handler executed when the user clicks on the right
   * arrow of an options (meaning the options has sub-items)
   * @param {MouseEvent} e Event object
   * @param {Item} item Item that is clicked
   */
  onSliderNext(e, item) {
    e.stopPropagation();

    const newPath = this.state.pathToCurrentItemsList.slice();
    newPath.push(item);
    const items = this.getItemsListAtCurrentLevel(newPath);

    this.setState({
      pathToCurrentItemsList: newPath,
      filteredOptions: items
    });
  }

  /**
   * Event handler executed when the user returns to a previous
   * level
   * @param {MouseEvent} e Event object
   */
  @Autobind
  onSliderPrev(e) {
    e.stopPropagation();

    const newPath = this.state.pathToCurrentItemsList.slice();
    newPath.pop();
    const items = this.getItemsListAtCurrentLevel(newPath);

    this.setState({
      pathToCurrentItemsList: newPath,
      filteredOptions: items
    });
  }

  /**
   * Event handler executed when the user clicks somewhere
   * This handler is used to close the dropdown if the user
   * clicks outside of it
   * @param {MouseEvent} evt
   */
  @Autobind
  onScreenClick(evt) {
    if (this.el.contains && !this.el.contains(evt.target)) {
      this.close();

      // We remove the now useless hander
      window.removeEventListener('click', this.onScreenClick);
    }
  }

  /**
   * Event handler executed when the user clicks on
   * an option
   * @param {MouseEvent} e Event object
   * @param {Item} item Associated item
   */
  @Autobind
  onMouseDownOption(e, item) {
    // If the element is not the option itself but
    // the button to go a level deeper then we
    // don't do anything
    if (e.target instanceof HTMLButtonElement) return;

    // If the user must select a leaf node, then if the
    // option they clicked is not a leaf, we display
    // the nested items of that item
    if (!this.props.allowNonLeafSelection && item.items && item.items.length) {
      this.onSliderNext(e, item);
      return;
    }

    e.stopPropagation();
    this.selectItem(item);
  }

  /**
   * Set the selected options (via keyboard)
   * @param {number} index
   */
  setSelectedIndex(index) {
    this.setState({ selectedIndex: index });
  }

  /**
   * Return the list of items that are located at the branch
   * designated by the list of items passed as argument
   * @param {Item[]} path List of items
   * @returns {Item[]}
   */
  getItemsListAtCurrentLevel(path) {
    let list = this.state.fullList;

    if (path.length) {
      for (let i = 0; i < path.length; i++) {
        const item = list.find(it => it.value === path[i].value);
        if (item.items) list = item.items;
        else break;
      }
    }

    return list;
  }

  /**
   * Toggle the dropdown
   * @param {MouseEvent} e
   */
  @Autobind
  toggle(e) {
    if (e.target === this.input) return;

    e.stopPropagation();
    if (this.state.closed) this.open();
    else this.close();
  }

  /**
   * Expand the dropdown
   */
  @Autobind
  open() {
    // This listener is used to close the dropdown
    // when the user clicks outside of it
    window.addEventListener('click', this.onScreenClick);

    this.setState({ closed: false }, () => {
      if (this.input) this.input.focus();
    });
  }

  /**
   * Close the dropdown
   */
  @Autobind
  close() {
    // We remove the handler that is used to close the
    // dropdown when the user clicks outside
    window.removeEventListener('click', this.onScreenClick);

    // We close the dropdown and reset the selected index
    this.setState({ closed: true });

    // If there's is no selected item, then we completely reset
    // the state of the dropdown
    if (!this.state.selectedItem) {
      this.setState({
        pathToCurrentItemsList: [],
        pathToSelectedItem: [],
        filteredOptions: this.state.fullList,
        selectedIndex: 0
      });
    } else {
      // If there's a selected option then we restore the
      // dropdown to the state where the option is
      const filteredOptions = this.getItemsListAtCurrentLevel(this.state.pathToSelectedItem);
      this.setState({
        pathToCurrentItemsList: this.state.pathToSelectedItem,
        filteredOptions,
        selectedIndex: filteredOptions.findIndex(item => item === this.state.selectedItem)
      });
    }

    if (this.input) {
      this.input.value = '';
    }
  }

  /**
   * Set the selected item
   * @param {Item} item
   */
  @Autobind
  selectItem(item) {
    const path = this.state.pathToCurrentItemsList;
    this.setState({
      selectedItem: item,
      pathToSelectedItem: path
    }, () => this.close());
    this.props.onValueChange(item, path.map(it => it.value), 'vocabulary');
  }

  /**
   * Reset the component to its initial state
   */
  reset() {
    this.setState({
      selectedItem: null,
      selectedIndex: 0,
      pathToCurrentItemsList: [],
      pathToSelectedItem: [],
      filteredOptions: this.state.fullList
    });
  }

  /**
   * Reset the selected item
   * @param {MouseEvent} e
   */
  @Autobind
  clearSelectedItem(e) {
    e.stopPropagation();
    this.setState({
      selectedItem: null,
      pathToCurrentItemsList: [],
      pathToSelectedItem: [],
      filteredOptions: this.state.fullList,
      selectedIndex: 0
    });
    this.props.onValueChange();
  }

  render() {
    const { className, options, placeholder } = this.props;
    const {
      closed,
      filteredOptions,
      selectedItem,
      pathToCurrentItemsList,
      selectedIndex
    } = this.state;

    const cNames = classnames({
      'c-custom-select -search': true,
      '-closed': closed
    }, className);

    const noResults = !!(options.length && !filteredOptions.length);

    return (
      <div ref={(node) => { this.el = node; }} className={cNames}>
        <div
          className="custom-select-text"
        >
          <input
            aria-label={placeholder}
            ref={(node) => { this.input = node; }}
            className="custom-select-search"
            type="search"
            onFocus={this.onEnterSearch}
            onKeyDown={this.onType}
          />
          <div>
            <span>{selectedItem ? selectedItem.as || selectedItem.label : placeholder}</span>
            {!selectedItem && closed &&
              <button className="icon-btn" onClick={this.toggle}>
                <Icon name="icon-arrow-down" className="-small icon-arrow-down" />
              </button>
            }
            {selectedItem &&
              <button className="icon-btn clear-button" onClick={this.clearSelectedItem}>
                <Icon name="icon-cross" className="-small icon-cross" />
              </button>
            }
          </div>
        </div>
        {noResults &&
          <span className="no-results">No results</span>
        }
        {this.state.closed ||
          <ul className="custom-select-options" role="listbox" aria-label={placeholder} ref={(node) => { this.options = node; }}>
            {pathToCurrentItemsList.length > 0 &&
              <li
                role="option"
                aria-selected="false"
                aria-label="Go back to the parent options"
                className="title"
                onClick={this.onSliderPrev}
              >
                <div>
                  <Icon name="icon-arrow-left" className="-small icon-arrow-left" />
                  <span>{pathToCurrentItemsList[pathToCurrentItemsList.length - 1].label}</span>
                </div>
              </li>
            }
            {filteredOptions.map((item, index) => (
              <li
                role="option"
                aria-selected={item === selectedItem}
                className={classnames({ '-selected': index === selectedIndex })}
                key={item.label}
                onMouseEnter={() => { this.setSelectedIndex(index); }}
                onMouseDown={e => this.onMouseDownOption(e, item)}
              >
                <span className="label">{item.label}</span>
                {item.items && item.items.length &&
                  <button className="next" onClick={e => this.onSliderNext(e, item)}>
                    <Icon name="icon-arrow-right" className="-small icon-arrow-right" />
                  </button>
                }
              </li>
            ))}
          </ul>
        }
      </div>
    );
  }
}

SliderSelect.propTypes = {
  /** @type {Item[]} */
  options: PropTypes.array, // List of the options (see the type Item)
  /** @type {(item: Item, path: string[]) => void} */
  onValueChange: PropTypes.func, // Callback when the selected option changes
  /** @type {string} */
  value: PropTypes.string, // Initial selected value (value of an Item)
  className: PropTypes.string,
  placeholder: PropTypes.string,
  // Whether the user can select an intermediate node (not a leaf)
  allowNonLeafSelection: PropTypes.bool,
  getResetCallback: PropTypes.func // Callback to execute to pass a function to reset the component
};

SliderSelect.defaultProps = {
  onValueChange: () => {},
  allowNonLeafSelection: true
};
