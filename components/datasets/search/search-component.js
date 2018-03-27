import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import flatten from 'lodash/flatten';

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

  state = {
    value: this.props.search
  }

  onScreenClick = (e) => {
    const el = document.querySelector('.c-dataset-search');
    const clickOutside = el && el.contains && !el.contains(e.target);

    if (clickOutside) {
      this.onToggleOpen(false);
    }
  }

  onScreenKeyup = (e) => {
    if (e.keyCode === 27) {
      this.onToggleOpen(false);
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
      }
    });

    this.props.onChangeOpen(to);
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
    this.setState({ value: e.currentTarget.value });
    this.props.onChangeSearch(e.currentTarget.value);
  }

  render() {
    const {
      open, options, selected, tab, list
    } = this.props;

    const { value } = this.state;

    const tabs = Object
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
        ...selected[o].length && { number: selected[o].length }
      }));

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
            <Icon name="icon-arrow-down" className="-small" />
          </button>
        </div>

        {/* Dropdown */}
        {open &&
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

        {/* Selected */}
        {!open && !!selectedAllArr.length &&
          <div className="search-selected">
            <div className="c-tag-list">
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
