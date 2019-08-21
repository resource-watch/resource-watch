import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Geosuggest from 'react-geosuggest';

// components
import Icon from 'components/ui/icon';

// utils
import { logEvent } from 'utils/analytics';

// styles
import './styles.scss';

class SearchControls extends PureComponent {
  static propTypes = { onSelectLocation: PropTypes.func.isRequired };

  state = { showSearchInput: false };

  onSuggestSelect = (e) => {
    const { onSelectLocation } = this.props;

    if (e) {
      const { gmaps, location } = e;
      const viewport = gmaps.geometry && gmaps.geometry.viewport;

      if (viewport) {
        const { south, west, north, east } = viewport.toJSON();
        onSelectLocation({ bbox: [east, south, west, north] });
      }

      if (!viewport && location) {
        onSelectLocation({
          ...location,
          zoom: 7
        });
      }

      if ('label' in e) logEvent('Explore map', ' Search for a place', e.label);

      this.handleSearchInput(false);
    }
  }

  onKeyDown = (e) => {
    if (e.keyCode === 27) this.handleSearchInput(false);
  }

  handleSearchInput = (to) => {
    this.setState({ showSearchInput: to }, () => {
      if (this.state.showSearchInput) this.geosuggest.focus();
    });
  }

  render() {
    const { showSearchInput } = this.state;

    return (
      <div className="c-search-control">
        {showSearchInput &&
          <Geosuggest
            ref={(r) => { this.geosuggest = r; }}
            onSuggestSelect={this.onSuggestSelect}
            onKeyDown={this.onKeyDown}
          />
        }
        <button
          type="button"
          className="search-control--btn"
          onClick={() => this.handleSearchInput(!showSearchInput)}
        >
          <Icon
            name="icon-search"
            className="-small"
          />
        </button>
      </div>
    );
  }
}

export default SearchControls;
