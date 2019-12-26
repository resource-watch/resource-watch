import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Components
import Icon from 'components/ui/icon';
import Spinner from 'components/ui/Spinner';


// Types
/**
 * Item of the selector
 * The "as" attribute is an alternate label displayed when the
 * option is selected and the dropdown is closed as the placeholder
 * of the component
 * @typedef {{ label: string, value: string, as?: string, items?: Item[] }} Item
 */

export default class SliderSelect extends React.Component {
  static propTypes = {
    /** @type {Item[]} */
    options: PropTypes.array, // List of the options (see the type Item)
    // Callback exectued when the selected option changes
    // If waitForChangeConfirmation is set to true, then the component
    // waits for this callback to return either true or false to confirm
    // if the choice can be made
    // A promise can be returned for asynchronous confirmation
    /** @type {(item: Item, path?: string[]) => (void|boolean|Promise<boolean>)} */
    onValueChange: PropTypes.func,
    /** @type {string} */
    value: PropTypes.string, // Initial selected value (value of an Item)
    className: PropTypes.string,
    placeholder: PropTypes.string,
    clearable: PropTypes.bool,
    // Whether the user can select an intermediate node (not a leaf)
    allowNonLeafSelection: PropTypes.bool,
    // Whether the component should wait for the onValueChange callback to
    // return true before confirming the user's choice; if false, then
    // nothing would happen
    waitForChangeConfirmation: PropTypes.bool
  };

  static defaultProps = {
    onValueChange: () => { },
    clearable: true,
    allowNonLeafSelection: true,
    waitForChangeConfirmation: false
  };

  constructor(props) {
    super(props);

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
      selectedIndex: 0, // Index of the selected option (via the keyboard)
      waitingConfirmation: false // Whether we're waiting a selection confirmation
    };

    // -------------------- BINDINGS -----------------------
    this.onType = this.onType.bind(this);
    this.onEnterSearch = this.onEnterSearch.bind(this);
    this.onSliderPrev = this.onSliderPrev.bind(this);
    this.onScreenClick = this.onScreenClick.bind(this);
    this.onMouseDownOption = this.onMouseDownOption.bind(this);
    this.toggle = this.toggle.bind(this);
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.selectItem = this.selectItem.bind(this);
    this.clearSelectedItem = this.clearSelectedItem.bind(this);
    // --------------------------------------------------------
  }

  UNSAFE_componentWillReceiveProps(newProps) {
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
    } else if (newProps.value !== this.props.value) {
      // If the value of the select is changed via the props, we update
      // the select item in the component
      const selectedItem = this.props.options
        && this.props.options.find(item => item.value === newProps.value);

      if (selectedItem) {
        this.setState({ selectedItem });
      }
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
  async onType(evt) {
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
          await this.selectItem(selectedItem);
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
  async onMouseDownOption(e, item) {
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
    await this.selectItem(item);
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
  toggle(e) {
    if (e.target === this.input) return;

    e.stopPropagation();
    if (this.state.closed) this.open();
    else this.close();
  }

  /**
   * Expand the dropdown
   */
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
   * NOTE: this is an asynchronous method
   * @param {Item} item
   */
  async selectItem(item) {
    const path = this.state.pathToCurrentItemsList;

    // We wait for the confirmation to select this option
    return new Promise(async (resolve, reject) => {
      this.setState({ waitingConfirmation: true });
      const res = await this.props.onValueChange(item, path.map(it => it.value), 'vocabulary');
      this.setState({ waitingConfirmation: false });
      if (!this.props.waitForChangeConfirmation || !!res) resolve();
      else reject();
    })
      // If we've the confirmation the user can select this option, then we set it
      .then(() => {
        this.setState({
          selectedItem: item,
          pathToSelectedItem: path
        }, () => this.close());
      })
      // If that's denied, we don't care, we just don't do anything
      .catch(() => {});
  }

  /**
   * Reset the selected item
   * @param {MouseEvent} e
   */
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
    const { className, options, placeholder, clearable } = this.props;
    const {
      closed,
      filteredOptions,
      selectedItem,
      pathToCurrentItemsList,
      selectedIndex,
      waitingConfirmation
    } = this.state;

    const cNames = classnames({
      'c-custom-select -search': true,
      '-closed': closed
    }, className);

    const noResults = !!(options.length && !filteredOptions.length);

    let selectText = placeholder;
    if (waitingConfirmation) selectText = <span><Spinner isLoading className="-light -small -inline" /> Waiting for action</span>;
    else if (selectedItem) selectText = selectedItem.as || selectedItem.label;

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
            {selectText}
            {/*! selectedItem && closed &&
              <button className="icon-btn" onClick={this.toggle}>
                <Icon name="icon-arrow-down" className="-small icon-arrow-down" />
              </button>
            */}
            { selectedItem && clearable &&
              <button className="icon-btn clear-button" onClick={this.clearSelectedItem}>
                <Icon name="icon-cross" className="-smaller icon-cross" />
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
                  <Icon name="icon-arrow-left-2" className="-small icon-arrow-left-2" />
                  <span>{pathToCurrentItemsList[pathToCurrentItemsList.length - 1].label}</span>
                </div>
              </li>
            }
            {filteredOptions.map((item, index) => (
              <li
                role="option"
                aria-selected={item === selectedItem}
                className={classnames({ '-selected': index === selectedIndex })}
                key={item.id || item.value}
                onMouseEnter={() => { this.setSelectedIndex(index); }}
                onMouseDown={e => this.onMouseDownOption(e, item)}
              >
                <span className="label">{item.label}</span>
                {item.items && item.items.length &&
                  <button className="next" onClick={e => this.onSliderNext(e, item)}>
                    <Icon name="icon-arrow-right-2" className="-small icon-arrow-right-2" />
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
