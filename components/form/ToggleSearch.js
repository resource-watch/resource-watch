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

  componentWillMount() {
    if (typeof window !== 'undefined') {
      const addSearchConfigScript = document.createElement('script');
      addSearchConfigScript.innerHTML = 'window.addsearch_settings = { display_url: true, display_category: false, display_resultscount: true }';

      const addSearchLibScript = document.createElement('script');
      addSearchLibScript.src = `https://addsearch.com/js/?key=${process.env.ADD_SEARCH_KEY}`;
      addSearchLibScript.async = true;

      document.body.appendChild(addSearchConfigScript);
      document.body.appendChild(addSearchLibScript);
    }
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
