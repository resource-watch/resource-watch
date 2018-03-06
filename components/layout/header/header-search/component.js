import React from 'react';
import PropTypes from 'prop-types';

// Components
import Icon from 'components/ui/Icon';

class HeaderSearch extends React.PureComponent {
  static propTypes = {
    setSearchOpened: PropTypes.func
  };

  static defaultProps = {
    setSearchOpened: () => {}
  }


  render() {
    const { setSearchOpened } = this.props;

    return (
      <span
        className="header-menu-link"
        onClick={() => setSearchOpened(true)}
      >
        <Icon name="icon-search" className="-medium" />
      </span>
    );
  }
}

export default HeaderSearch;
