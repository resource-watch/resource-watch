import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Components
import Icon from 'components/ui/Icon';

export default function Search({ header, setSearchOpened, getInputRef }) {
  const classNames = classnames({
    '-opened': header.searchOpened
  });

  return (
    <div className={`c-search ${classNames}`}>
      <div className="search-container">
        <form
          className="search-form"
          onSubmit={(e) => { e.preventDefault(); }}
          noValidate
        >
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
            onClick={() => console.log(setSearchOpened) || setSearchOpened(false)}
          >
            <Icon name="icon-cross" className="-smaller" />
          </button>
        </form>
      </div>

      <button
        onClick={() => setSearchOpened(false)}
        className="search-backdrop"
      />
    </div>
  );
}

Search.propTypes = {
  header: PropTypes.object,
  // Actions
  setSearchOpened: PropTypes.func,
  getInputRef: PropTypes.func
};

Search.defaultProps = {
  header: {},
  setSearchOpened: null,
  getInputRef: null
};
