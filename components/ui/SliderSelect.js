import React from 'react';
import Icon from 'components/ui/Icon';

export default class SliderSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItem: props.options ? props.options.find(item => item.value === props.value) : null,
      closed: true,
      fullList: props.options || [],
      filteredOptions: this.filterItemsList(props.options) || [],
      selectedLevels: [],
      selectedIndex: 0
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
    this.clearSearch = this.clearSearch.bind(this);
    this.onSliderPrev = this.onSliderPrev.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.options.length && !this.state.fullList.length) {
      this.setState({
        fullList: newProps.options || [],
        filteredOptions: this.filterItemsList(newProps.options) || []
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.onScreenClick);
  }

  filterItemsList(items) {
    return items.map(it => ({
      label: it.label, value: it.value, hasItems: !!it.items
    }));
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
        const listTofilter = this.searchItems(this.state.selectedLevels);
        const foundItems = listTofilter.filter(item => item.label.toLowerCase()
          .match(value.toLowerCase()));
        const filteredOptions = foundItems.map(it => ({
          value: it.value,
          label: it.label,
          hasItems: it.items && !!it.items.length
        }));
        this.setState({ filteredOptions });
        break;
      }
    }
  }

  resetSelectedIndex() {
    this.setSelectedIndex(0);
  }

  setSelectedIndex(index) {
    this.setState({ selectedIndex: index });
  }

  // Event handler for enter event on search input
  onEnterSearch() {
    this.setState({ closed: false });
  }

  // Event handler for mouseup event on options list item
  selectItem(item) {
    const levels = this.state.selectedLevels.map(lev => lev.value);
    this.setState({ selectedItem: item });
    this.close();
    this.props.onValueChange && this.props.onValueChange(item, levels, 'vocabulary');
  }

  onScreenClick(evt) {
    if (this.el.contains && !this.el.contains(evt.target)) {
      this.resetSelect();
      this.close();
      window.removeEventListener('click', this.onScreenClick);
    }
  }

  toggle(e) {
    e.stopPropagation();
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
  close() {
    window.removeEventListener('click', this.onScreenClick);

    this.setState({
      closed: true
    }, this.resetSelectedIndex);
    if (this.input) {
      this.input.value = '';
    }
  }

  searchItems(selectedLevels) {
    let list = this.state.fullList;

    if (selectedLevels.length) {
      for (let i = 0; i < selectedLevels.length; i++) {
        list = list.find(it => it.value === selectedLevels[i].value).items;
      }
    }

    return list;
  }

  onSliderNext(e, item) {
    e.stopPropagation();
    const newSelectedLevels = this.state.selectedLevels.slice();
    newSelectedLevels.push({ value: item.value, label: item.label });
    const items = this.searchItems(newSelectedLevels);

    this.setState({
      selectedLevels: newSelectedLevels,
      filteredOptions: this.filterItemsList(items)
    });
  }

  onSliderPrev(e) {
    e.stopPropagation();
    const newSelectedLevels = this.state.selectedLevels.slice();
    newSelectedLevels.pop();
    const items = this.searchItems(newSelectedLevels);

    this.setState({
      selectedLevels: newSelectedLevels,
      filteredOptions: this.filterItemsList(items)
    });
  }

  resetSelect() {
    this.setState({
      selectedLevels: [],
      filteredOptions: this.filterItemsList(this.state.fullList)
    });
  }

  clearSearch(e) {
    e.stopPropagation();
    this.setState({ selectedItem: null, closed: true });
    this.props.onValueChange && this.props.onValueChange();
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
            <span>{this.state.selectedItem ? this.state.selectedItem.label : this.props.placeholder}</span>
            {!this.state.selectedItem && this.state.closed &&
              <button className="icon-btn" onClick={this.toggle}>
                <Icon name="icon-arrow-down" className="-small icon-arrow-down" />
              </button>
            }
            {this.state.selectedItem &&
              <button className="icon-btn" onClick={this.clearSearch}>
                <Icon name="icon-cross" className="-small icon-cross" />
              </button>
            }
          </div>
          <input
            ref={(node) => { this.input = node; }}
            className="custom-select-search"
            type="search"
            onFocus={this.onEnterSearch}
            onKeyDown={this.onType}
          />
        </span>
        {noResults &&
          <span className="no-results">No results</span>
        }
        {this.state.closed ||
          <ul className="custom-select-options">
            {this.state.selectedLevels.length > 0 &&
              <li className="title" onClick={this.onSliderPrev}>
                <div>
                  <Icon name="icon-arrow-left" className="-small icon-arrow-left" />
                  <span>{this.state.selectedLevels[this.state.selectedLevels.length - 1].label}</span>
                </div>
              </li>
            }
            {this.state.filteredOptions.map((item, index) => {
              const cName = (index === this.state.selectedIndex) ? '-selected' : '';

              return (
                <li className={cName} key={index}>
                  <span
                    className="label"
                    onMouseEnter={() => { this.setSelectedIndex(index); }}
                    onMouseDown={() => this.selectItem(item)}
                  >
                    {item.label}
                  </span>

                  {item.hasItems &&
                    <div className="next" onClick={e => this.onSliderNext(e, item)}>
                      <Icon name="icon-arrow-right" className="-small icon-arrow-right" />
                    </div>
                  }
                </li>
              );
            })}
          </ul>
        }
      </div>
    );
  }
}

SliderSelect.propTypes = {
  options: React.PropTypes.array,
  onValueChange: React.PropTypes.func,
  value: React.PropTypes.string,
  className: React.PropTypes.string,
  placeholder: React.PropTypes.string
};
