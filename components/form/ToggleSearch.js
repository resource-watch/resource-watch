import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/ui/Icon';

class ToggleSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: props.open || false };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState && this.state.open !== nextState.open) return true;
    return false;
  }

  onUserFocus() {
    this.setState({ open: true });
  }

  onUserBlur() {
    this.setState({ open: false });
  }

  render() {
    const classNames = this.state.open && '-open';
    return (
      <form className={`toggle-search ${classNames}`}>
        <div className="c-field-search">
          <Icon name="icon-search" className="-small" />
          <input
            type="text"
            placeholder="Search"
            className="addsearch"
            onFocus={() => this.onUserFocus()}
            onBlur={() => this.onUserBlur()}
          />
        </div>
        <script src={`https://addsearch.com/js/?key=${process.env.ADD_SEARCH_KEY}`} />
      </form>
    );
  }
}

ToggleSearch.propTypes = {
  open: PropTypes.bool
};

ToggleSearch.defaultProps = {
  open: false
};

export default ToggleSearch;
