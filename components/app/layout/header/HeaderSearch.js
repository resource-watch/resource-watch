import React from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';
import { setOpened } from 'components/app/layout/search/search-actions';

// Components
import Icon from 'components/ui/Icon';

function HeaderUser(props) {
  return (
    <span
      className="header-menu-link"
      onClick={() => props.setOpened(true)}
    >
      <Icon name="icon-search" className="-medium" />
    </span>
  );
}

HeaderUser.propTypes = {
  setOpened: PropTypes.func
};


export default connect(
  null,
  { setOpened }
)(HeaderUser);
