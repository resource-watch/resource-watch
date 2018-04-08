import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import * as actions from 'layout/explore/explore-actions';

// Components
import LocationSearch from 'components/search/LocationSearch';
import Icon from 'components/ui/Icon';

class SearchControl extends React.Component {
  static propTypes = {
    setMapLatLng: PropTypes.func,
    setMapZoom: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
      showSearchInput: false
    };
  }

  handleToggleSearchInput = () => {
    const { showSearchInput } = this.state;
    this.setState({ showSearchInput: !showSearchInput });
  }

  handleOnSuggestSelect = (e) => {
    if (e) {
      const { location } = e;
      this.props.setMapLatLng(location);
      this.props.setMapZoom(7);
      this.setState({ showSearchInput: false });
    }
  }

  // RENDER
  render() {
    const { showSearchInput } = this.state;
    const className = classNames({
      'c-map-search-control': true,
      '-show-input': showSearchInput
    });
    return (
      <div className={className}>
        <LocationSearch handleOnSuggestSelect={this.handleOnSuggestSelect} />
        <button type="button" className="search-button" onClick={this.handleToggleSearchInput}>
          <Icon name="icon-search" className="-small" />
        </button>
      </div>
    );
  }
}

const mapStateToProps = () => ({});

export default connect(mapStateToProps, actions)(SearchControl);
