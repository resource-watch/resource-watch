import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// components
import Icon from 'components/ui/Icon';

class HeaderSearch extends PureComponent {
  static propTypes = { setSearchOpened: PropTypes.func.isRequired };

  render() {
    const { setSearchOpened } = this.props;

    return (
      <button
        className="header-menu-link"
        onClick={() => setSearchOpened(true)}
      >
        <Icon
          name="icon-search"
          className="-medium"
        />
      </button>
    );
  }
}

export default HeaderSearch;
