import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import flatten from 'lodash/flatten';
import groupBy from 'lodash/groupBy';
import omit from 'lodash/omit';
import Fuse from 'fuse.js';

// Components
import Icon from 'components/ui/icon';

class SearchComponent extends React.Component {
  static propTypes = {
    open: PropTypes.bool,
    list: PropTypes.array,
    options: PropTypes.object,
    selected: PropTypes.object,
    tab: PropTypes.string,
    search: PropTypes.string,

    // CALLBACKS
    onChangeOpen: PropTypes.func,
    onChangeTab: PropTypes.func,
    onChangeTextSearch: PropTypes.func,
    onToggleSelected: PropTypes.func,
    onChangeSelected: PropTypes.func,
    onResetSelected: PropTypes.func
  };

  constructor(props) {
    super(props);

    const { list } = props;

    this.fuse = new Fuse(list, {
      keys: [{
        name: 'label',
        weight: 0.6
      }, {
        name: 'synonyms',
        weight: 0.3
      }, {
        name: 'id',
        weight: 0.1
      }],
      threshold: 0.2,
      minMatchCharLength: 2
    });
  }

  state = {
    index: 0,
    value: '',
    filteredList: [],
    groupedFilteredList: {}
  }


  // UI EVENTS:
  // - onScreenClick
  // - onScreenKeyup
  // - onToggleOpen
  // - onKeyArrow
  // - onChangeTab
  // - onChangeSearch
  onScreenClick = (e) => {
    const el = document.querySelector('.c-dataset-search');
    const clickOutside = el && el.contains && !el.contains(e.target);

    if (clickOutside) {
      this.onToggleOpen(false);
    }
  }

  onScreenKeyup = (e) => {
    switch (e.keyCode) {
      case 27:
        this.onToggleOpen(false);
        break;

      // ENTER
      case 13:
        this.onKeyEnter();
        break;

      // ARROWS
      case 38:
        this.onKeyArrow('up');
        break;

      case 40:
        this.onKeyArrow('down');
        break;

      default:
        return true;
    }
  }

  onToggleOpen = (to) => {
    requestAnimationFrame(() => {
      if (to) {
        window.addEventListener('click', this.onScreenClick);
        window.addEventListener('keyup', this.onScreenKeyup);
      } else {
        window.removeEventListener('click', this.onScreenClick);
        window.removeEventListener('keyup', this.onScreenKeyup);
        this.setState({
          index: 0,
          value: '',
          filteredList: [],
          groupedFilteredList: {}
        });
        if (this.input) this.input.blur();
      }
    });

    this.props.onChangeOpen(to);
  }

  onKeyArrow = (direction) => {
    const { index, filteredList } = this.state;
    if (direction === 'up') {
      this.setState({ index: (index !== 0) ? index - 1 : filteredList.length });
    }

    if (direction === 'down') {
      this.setState({ index: (index !== filteredList.length) ? index + 1 : 0 });
    }
  }

  onKeyEnter = () => {
    const { value, index, groupedFilteredList } = this.state;

    if (index !== 0) {
      const filteredList = flatten(Object.keys(groupedFilteredList).map(g =>
        groupedFilteredList[g]));

      const tag = filteredList[index - 1];

      this.props.onToggleSelected(tag);
    } else {
      this.props.onChangeTextSearch(value);
    }

    this.onToggleOpen(false);
  }

  onListItemMouseOver = (index) => {
    this.setState({ index });
  }


  onChangeSearch = (e) => {
    const { value } = e.currentTarget;
    const { open } = this.props;

    if (!open && value.length > 2) {
      this.onToggleOpen(true);
    }

    const filteredList = (value.length > 2) ? this.fuse.search(value).sort((a, b) => {
      const index1 = a.label.toLowerCase().indexOf(value.toLowerCase());
      const index2 = b.label.toLowerCase().indexOf(value.toLowerCase());
      const exactMatch1 = a.label.toLowerCase() === value.toLowerCase();
      const exactMatch2 = b.label.toLowerCase() === value.toLowerCase();
      if (exactMatch1) {
        return -1;
      } else if (exactMatch2) {
        return 1;
      }
      return index1 > index2;
    }) : [];
    const newGroupFilteredList = omit(groupBy(filteredList, (l) => {
      const group = l.labels && l.labels[1];
      return group || 'undefined';
    }), ['undefined', 'GEOGRAPHY']);
    this.setState({
      index: Object.keys(newGroupFilteredList).length > 0 ? 1 : 0,
      value,
      filteredList,
      groupedFilteredList: newGroupFilteredList
    });
  }

  render() {
    const { open } = this.props;
    const { index, value, groupedFilteredList } = this.state;
    let groupedFilteredListIndex = 0;

    return (
      <div className="c-dataset-search">
        {/* Search */}
        <div className="search-container">
          <button
            className={classnames({
              'search-icon': true,
              '-search': true
            })}
          >
            <Icon name="icon-search" className="-small" />
          </button>

          <input
            ref={(c) => { this.input = c; }}
            className={classnames({
              'search-input': true,
              '-open': open
            })}
            type="search"
            placeholder="Search datasets"
            value={value}
            onChange={this.onChangeSearch}
          />
        </div>

        {/* Dropdown search */}
        {open && value &&
          <div className="search-dropdown">
            <div className="search-dropdown-list">
              {Object.keys(groupedFilteredList).map(g => (
                <div className="search-dropdown-list-item" key={g}>
                  {!!g && g.toLowerCase &&
                    <h4>Filter by {g.toLowerCase()}:</h4>
                  }

                  <ul className="list-item-results">
                    {groupedFilteredList[g].map((l) => {
                      const currentIndex = ++groupedFilteredListIndex;

                      return (
                        <li
                          key={l.id}
                        >
                          <button
                            type="button"
                            className={classnames({ '-active': index === currentIndex })}
                            onClick={() => {
                              this.props.onToggleSelected(l);
                              this.onToggleOpen(false);
                            }}
                            onMouseOver={() => this.onListItemMouseOver(currentIndex)}
                          >
                            {l.label}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
              <div className="search-dropdown-list-item">
                <h4>Search by text:</h4>

                <ul className="list-item-results">
                  <li>
                    <button
                      type="button"
                      className={classnames({ '-active': index === 0 })}
                      onClick={() => {
                        this.props.onChangeTextSearch(value);
                        this.onToggleOpen(false);
                      }}
                      onMouseOver={() => this.onListItemMouseOver(0)}
                    >
                      {value}
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        }
      </div>

    );
  }
}

export default SearchComponent;
