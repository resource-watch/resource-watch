import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Components
import Icon from 'components/ui/Icon';

export default function Search({ search, setOpened, getInputRef }) {
  const classNames = classnames({
    '-opened': search.opened
  });

  return (
    <div className={`c-search ${classNames}`}>
      <div className="search-container">
        <form className="search-form" noValidate>
          <Icon name="icon-search" className="search-icon -medium" />

          <input
            ref={getInputRef}
            id="addsearch"
            className="addsearch search-input"
            type="text"
            placeholder="Search in Resource Watch"
          />

          <button
            className="search-close"
            type="button"
            onClick={() => setOpened(false)}
          >
            <Icon name="icon-cross" className="-smaller" />
          </button>
        </form>
      </div>

      <button
        onClick={() => setOpened(false)}
        className="search-backdrop"
      />
    </div>
  );
}

Search.propTypes = {
  search: PropTypes.object,
  // Actions
  setOpened: PropTypes.func,
  getInputRef: PropTypes.func
};

Search.defaultProps = {
  search: {},
  setOpened: null,
  getInputRef: null
};
