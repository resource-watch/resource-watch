import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';

// Next
import { Link } from 'routes';

// Components
import Icon from 'components/ui/Icon';

class SearchInput extends React.Component {
  /**
   * Event handler executed when the user search
   * @param {string} { value } Search keywords
   */
  @Autobind
  onSearch(event) {
    this.props.onSearch(event.target.value);
  }

  render() {
    const { link, input } = this.props;

    return (
      <div className="c-search-input">
        <div className="c-field -fluid">
          <input
            className="-fluid"
            onChange={this.onSearch}
            placeholder={input.placeholder}
            value={input.value ? input.value : ''}
            type="search"
          />
          <Icon name="icon-search" className="-small" />
        </div>
        {link.route &&
          <Link route={link.route} params={link.params}>
            <a className="c-button -secondary">{link.label}</a>
          </Link>
        }
      </div>
    );
  }
}

SearchInput.propTypes = {
  input: PropTypes.object.isRequired,
  link: PropTypes.object.isRequired,
  onSearch: PropTypes.func.isRequired
};

SearchInput.defaultProps = {
  input: {},
  link: {}
};

export default SearchInput;
