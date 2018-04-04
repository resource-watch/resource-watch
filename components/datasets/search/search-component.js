import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import flatten from 'lodash/flatten';
import sortBy from 'lodash/sortBy';
import groupBy from 'lodash/groupBy';
import omit from 'lodash/omit';
import Fuse from 'fuse.js';

// Components
import Tabs from 'components/ui/Tabs';
import Tag from 'components/ui/Tag';
import Icon from 'components/ui/Icon';

import CheckboxGroup from 'components/form/CheckboxGroup';

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
    onChangeSearch: PropTypes.func,
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
      this.setState({
        index: (index !== 0) ? index - 1 : filteredList.length
      });
    }

    if (direction === 'down') {
      this.setState({
        index: (index !== filteredList.length) ? index + 1 : 0
      });
    }
  }

  onKeyEnter = () => {
    const tabs = this.getTabs();
    const { value, index, groupedFilteredList } = this.state;

    if (index === 0) {
      this.props.onChangeSearch(value);
    }

    if (index !== 0) {
      const filteredList = flatten(Object.keys(groupedFilteredList).map(g =>
        groupedFilteredList[g]));

      const l = filteredList[index - 1];
      this.props.onToggleSelected({
        tag: l,
        tab: (tabs.find(t => t.type === l.labels[1]) || {}).value || 'custom'
      });
    }

    this.onToggleOpen(false);
  }

  onListItemMouseOver = (index) => {
    this.setState({ index });
  }

  onChangeTab = (t) => {
    const { tab } = this.props;
    if (t === tab) {
      this.onToggleOpen(false);
    } else {
      this.props.onChangeTab(t);
    }
  }

  onChangeSearch = (e) => {
    const { value } = e.currentTarget;

    const filteredList = (value.length > 2) ? sortBy(this.fuse.search(value), 'label') : [];

    this.setState({
      index: 0,
      value,
      filteredList,
      groupedFilteredList: omit(groupBy(filteredList, l => l.labels[1]), 'undefined')
    });
  }

  // HELPERS
  getTabs = () => {
    const {
      options, selected
    } = this.props;

    return Object
      .keys(options)
      .filter((o) => {
        if (o === 'custom') {
          return selected.custom.length;
        }
        return o !== 'custom';
      })
      .map(o => ({
        label: options[o].label,
        value: options[o].value,
        type: options[o].type,
        ...selected[o].length && { number: selected[o].length }
      }));
  }

  render() {
    const {
      open, search, options, selected, tab, list
    } = this.props;

    const {
      index, value, groupedFilteredList
    } = this.state;

    let groupedFilteredListIndex = 0;

    const tabs = this.getTabs();

    const mainArr = options[tab].list;
    const secondaryArr = selected[tab]
      .filter(s => !options[tab].list.find(l => l.id === s))
      .map(s => list.find(l => l.id === s));

    const selectedAllArr = flatten(Object.keys(selected).map(s =>
      selected[s].map(c =>
        ({ ...list.find(o => o.id === c), tab: s }))));


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
            placeholder="Search and filter datasets"
            value={value}
            onClick={() => this.onToggleOpen(true)}
            onChange={this.onChangeSearch}
          />

          <button
            className={classnames({
              'search-icon': true,
              '-arrow': true,
              '-open': open
            })}
            onClick={() => this.onToggleOpen(!open)}
          >
            <Icon name="icon-arrow-down-2" className="-small" />
          </button>
        </div>


        {/* Dropdown */}
        {open && !value &&
          <div className="search-dropdown">
            <Tabs
              className="-dark -no-margin"
              options={tabs}
              defaultSelected={tab}
              selected={tab}
              onChange={this.onChangeTab}
            />

            <div className="search-dropdown-list">
              {!!mainArr.length &&
                <CheckboxGroup
                  name="mainArr"
                  selected={selected[tab]}
                  className="mainArr-checkbox-group"
                  options={mainArr.map(o => ({ value: o.id, label: o.label }))}
                  onChange={s => this.props.onChangeSelected(s)}
                />
              }

              {!!secondaryArr.length &&
                <CheckboxGroup
                  name="secondaryArr"
                  selected={selected[tab]}
                  className="secondaryArr-checkbox-group"
                  options={secondaryArr.map(o => ({ value: o.id, label: o.label }))}
                  onChange={s => this.props.onChangeSelected(s)}
                />
              }
            </div>
          </div>
        }


        {/* Dropdown search */}
        {open && value &&
          <div className="search-dropdown">
            <div className="search-dropdown-list">
              <div className="search-dropdown-list-item">
                <h4>Search by text:</h4>

                <ul className="list-item-results">
                  <li>
                    <button
                      type="button"
                      className={classnames({
                        '-active': index === 0
                      })}
                      onClick={() => this.props.onChangeSearch(value)}
                      onMouseOver={() => this.onListItemMouseOver(0)}
                    >
                      {value}
                    </button>
                  </li>
                </ul>
              </div>

              {Object.keys(groupedFilteredList).map(g => (
                <div className="search-dropdown-list-item" key={g}>
                  <h4>Filter by {g.toLowerCase()}:</h4>

                  <ul className="list-item-results">
                    {groupedFilteredList[g].map((l) => {
                      const currentIndex = ++groupedFilteredListIndex;

                      return (
                        <li
                          key={l.id}
                        >
                          <button
                            type="button"
                            className={classnames({
                              '-active': index === currentIndex
                            })}
                            onClick={() => {
                              this.props.onToggleSelected({
                                tag: l,
                                tab: (tabs.find(t => t.type === l.labels[1]) || {}).value || 'custom'
                              });

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
            </div>
          </div>
        }


        {/* Selected */}
        {!open && (!!selectedAllArr.length || !!search) &&
          <div className="search-selected">
            <div className="c-tag-list">
              {!!search &&
                <Tag
                  key="clear-search"
                  name={`Text: ${search}`}
                  className="-secondary"
                  isRemovable
                  onClick={() => this.props.onChangeSearch('')}
                />
              }

              {selectedAllArr.map(s => (
                <Tag
                  key={s.id}
                  name={s.label}
                  className="-secondary"
                  isRemovable
                  onClick={() => this.props.onToggleSelected({ tag: s, tab: s.tab })}
                />
              ))}

              <Tag
                key="clear-filters"
                name="Clear filters"
                className="-primary"
                onClick={() => this.props.onResetSelected()}
              />
            </div>
          </div>
        }
      </div>

    );
  }
}

export default SearchComponent;
