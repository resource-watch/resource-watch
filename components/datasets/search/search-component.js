import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import flatten from 'lodash/flatten';

// Components
import Tabs from 'components/ui/Tabs';
import Tag from 'components/ui/Tag';
import Icon from 'components/ui/Icon';


class SearchComponent extends React.Component {
  static propTypes = {
    open: PropTypes.bool,
    options: PropTypes.object,
    selected: PropTypes.object,
    tab: PropTypes.string,

    // CALLBACKS
    onChangeOpen: PropTypes.func,
    onChangeTab: PropTypes.func,
    onChangeSelected: PropTypes.func,
    onResetSelected: PropTypes.func
  };

  onScreenClick = (e) => {
    const el = document.querySelector('.c-dataset-search');
    const clickOutside = el && el.contains && !el.contains(e.target);

    if (clickOutside) {
      this.onToggleOpen(false);
    }
  }

  onToggleOpen = (to) => {
    requestAnimationFrame(() => {
      if (to) {
        window.addEventListener('click', this.onScreenClick);
      } else {
        window.removeEventListener('click', this.onScreenClick);
      }
    });

    this.props.onChangeOpen(to);
  }


  render() {
    const {
      open, options, selected, tab
    } = this.props;

    const tabs = Object
      .keys(options)
      .map(o => ({
        label: options[o].label,
        value: options[o].value,
        ...selected[o].length && { number: selected[o].length }
      }));

    const selectedArr = flatten(Object.keys(selected).map((s) => {
      return selected[s].map(c => ({ ...options[s].list.find(o => o.id === c), tab: s }));
    }));

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
            value=""
            // ref={c => this.getInputRef(c)}
            // onKeyDown={c => this.onKeyDown(c)}
            onClick={() => this.onToggleOpen(true)}
            onChange={this.onSearch}
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
              onChange={this.props.onChangeTab}
            />

            <div className="search-dropdown-list">
              <ul>
                {options[tab].list.map(o => (
                  <li key={o.id}>
                    <button
                      className={classnames({
                        'search-dropdown-list-btn': true,
                        '-active': selected[tab].includes(o.id)
                      })}
                      onClick={() => this.props.onChangeSelected({ tag: o, tab })}
                    >
                      {o.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        }

        {/* Selected */}
        {!open && !!selectedArr.length &&
          <div className="search-selected">
            <div className="c-tag-list">
              {selectedArr.map(s => (
                <Tag
                  key={s.id}
                  name={s.label}
                  className="-secondary"
                  onClick={() => this.props.onChangeSelected({ tag: s, tab: s.tab })}
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
