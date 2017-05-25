import React from 'react';
import isEqual from 'lodash/isEqual';

export default class SearchSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItem: props.options ? props.options.find(item => item.value === props.value) : null,
      closed: true,
      filteredOptions: props.options || [],
      selectedIndex: 0,
      value: null
    };

    // Bindings
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.toggle = this.toggle.bind(this);
    this.selectItem = this.selectItem.bind(this);
    this.onType = this.onType.bind(this);
    this.onEnterSearch = this.onEnterSearch.bind(this);
    this.onScreenClick = this.onScreenClick.bind(this);
    this.resetSelectedIndex = this.resetSelectedIndex.bind(this);
  }

  componentWillReceiveProps({ options, value }) {
    if (!isEqual(this.props.options, options)) {
      this.setState({
        filteredOptions: options,
        selectedItem: options.find(item => item.value === value)
      });
    }
    if (this.props.value !== value) {
      this.setState({ selectedItem: this.props.options.find(item => item.value === value) });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.onScreenClick);
  }

  // Event handler for event keyup on search input
  onType(evt) {
    switch (evt.keyCode) {
      // key up
      case 38: {
        const index = this.state.selectedIndex > 0 ?
          this.state.selectedIndex - 1 :
          this.state.filteredOptions.length - 1;
        this.setSelectedIndex(index);
        break;
      }
      // key down
      case 40: {
        const index = (this.state.selectedIndex < this.state.filteredOptions.length - 1) ?
          this.state.selectedIndex + 1 :
          0;
        this.setSelectedIndex(index);
        break;
      }
      // enter key
      case 13: {
        if (this.state.selectedIndex !== -1 && this.state.filteredOptions.length) {
          const selectedItem = this.state.filteredOptions[this.state.selectedIndex];
          this.resetSelectedIndex();
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
        const value = evt.currentTarget.value;
        const filteredOptions = this.props.options.filter(item => item.label
          .toLowerCase().match(value.toLowerCase()));
        this.setState({ filteredOptions }, () => {
          this.props.onKeyPressed && this.props.onKeyPressed({ value }, [], 'name');
        });
        break;
      }
    }
  }

  // Event handler for enter event on search input
  onEnterSearch() {
    this.setState({ closed: false });
  }

  onScreenClick(evt) {
    if (this.el.contains && !this.el.contains(evt.target)) {
      this.close();
      window.removeEventListener('click', this.onScreenClick);
    }
  }

  setSelectedIndex(index) {
    this.setState({ selectedIndex: index });
  }

  resetSelectedIndex() {
    this.setSelectedIndex(0);
  }

  // Event handler for mouseup event on options list item
  selectItem(item) {
    this.setState({ selectedItem: item });
    this.close();
    this.props.onValueChange && this.props.onValueChange(item);
  }

  toggle() {
    return this.state.closed ? this.open() : this.close();
  }

  // Method than shows the option list
  open() {
    // Close select when clicking outside it
    window.addEventListener('click', this.onScreenClick);

    this.setState({ closed: false }, () => {
      this.input && this.input.focus();
    });
  }

  // Method that closes the options list
  close(e) {
    window.removeEventListener('click', this.onScreenClick);

    this.setState({
      closed: true,
      filteredOptions: this.props.options,
      value: e.currentTarget.value
    }, this.resetSelectedIndex);
  }

  render() {
    // Class names
    const cNames = ['c-custom-select -search'];
    this.props.className && cNames.push(this.props.className);
    this.state.closed && cNames.push('-closed');

    const noResults = !!(this.props.options.length && !this.state.filteredOptions.length);

    return (
      <div ref={(node) => { this.el = node; }} className={cNames.join(' ')}>
        <span className="custom-select-text" onClick={this.toggle}>
          <div>
            <span>{this.state.value ?
              this.state.value :
              this.props.placeholder}
            </span>
          </div>
          <input
            ref={(node) => { this.input = node; }}
            className="custom-select-search"
            type="search"
            onBlur={this.close}
            onFocus={this.onEnterSearch}
            onChange={this.onType}
          />
        </span>
        {noResults &&
          <span className="no-results">No results</span>
        }
        {!this.state.closed && !this.props.hideList &&
          <ul className="custom-select-options">
            {this.state.filteredOptions.map((item, index) => {
              const cName = (index === this.state.selectedIndex) ? '-selected' : '';
              return (
                <li
                  className={cName}
                  key={index}
                  onMouseEnter={() => { this.setSelectedIndex(index); }}
                  onMouseDown={() => this.selectItem(item)}
                >
                  <span className="label">{item.label}</span>
                </li>
              );
            })}
          </ul>
        }
      </div>
    );
  }
}

SearchSelect.propTypes = {
  options: React.PropTypes.array,
  hideList: React.PropTypes.bool,
  value: React.PropTypes.string,
  className: React.PropTypes.string,
  placeholder: React.PropTypes.string,
  onValueChange: React.PropTypes.func,
  onKeyPressed: React.PropTypes.func
};
