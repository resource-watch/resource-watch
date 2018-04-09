import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import * as actions from 'layout/explore/explore-actions';

// Components
import Geosuggest from 'react-geosuggest';
import Icon from 'components/ui/Icon';

class SearchControl extends React.Component {
  static propTypes = {
    setMapLocation: PropTypes.func
  };

  state = {
    showSearchInput: false
  };

  // UI EVENTS
  onToggleSearchInput = (to) => {
    this.setState({ showSearchInput: to }, () => {
      if (this.state.showSearchInput) {
        this.geosuggest.focus();
      }
    });
  }

  onSuggestSelect = (e) => {
    if (e) {
      const { gmaps, location } = e;

      const viewport = gmaps.geometry && gmaps.geometry.viewport;

      if (viewport) {
        this.props.setMapLocation({
          bbox: [
            viewport.b.b, viewport.f.b,
            viewport.b.f, viewport.f.f
          ]
        });
      }

      if (!viewport && location) {
        this.props.setMapLocation({
          ...location,
          zoom: 7
        });
      }

      this.onToggleSearchInput(false);
    }
  }

  onKeyDown = (e) => {
    if (e.keyCode === 27) {
      this.onToggleSearchInput(false);
    }
  }

  // RENDER
  render() {
    const { showSearchInput } = this.state;
    const className = classNames({
      'c-map-search-control': true
    });

    return (
      <div className={className}>

        {showSearchInput &&
          <Geosuggest
            ref={(r) => { this.geosuggest = r; }}
            onSuggestSelect={this.onSuggestSelect}
            onKeyDown={this.onKeyDown}
          />
        }

        <button
          type="button"
          className="search-button"
          onClick={() => this.onToggleSearchInput(!showSearchInput)}
        >
          <Icon name="icon-search" className="-small" />
        </button>
      </div>
    );
  }
}

export default connect(null, actions)(SearchControl);
