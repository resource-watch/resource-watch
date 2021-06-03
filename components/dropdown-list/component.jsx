import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';

// Components
import RadioGroup from 'components/form/RadioGroup';
import Field from 'components/form/Field';
import Input from 'components/form/Input';

// Styles
import './styles.scss';

export default function DropdownList({
  items,
  defaultItem,
  onSelect,
  name,
  placeholder,
  onSearch,
}) {
  const [filteredItems, setFilteredItems] = useState(items);
  const inputRef = useRef(null);
  const onSearchChange = debounce((search) => {
    if (search && search.length > 1) {
      const results = items.filter(
        ({ label }) => label.toLowerCase().indexOf(search.toLowerCase()) >= 0,
      );
      setFilteredItems(results);
    } else {
      setFilteredItems(items);
    }

    if (onSearch) onSearch(search);
  }, 250);

  useEffect(() => inputRef.current.focus(), []);

  return (
    <div className="c-dropdown-list">
      <Field
        className="search-input"
        onChange={onSearchChange}
        properties={{
          name: 'search',
          type: 'text',
          placeholder,
          ref: inputRef,
        }}
      >
        {Input}
      </Field>
      {filteredItems.length > 0 && (
        <div className="list-container">
          <div style={{
            overflowY: 'auto',
            maxHeight: 180,
          }}
          >
            <div style={{
              padding: '15px 0',
            }}
            >
              <RadioGroup
                options={filteredItems}
                name={name}
                properties={{
                  ...(defaultItem && { default: defaultItem }),
                }}
                onChange={onSelect}
              />
            </div>
          </div>
        </div>
      )}
      {!filteredItems.length && (
        <span className="no-results">No results found.</span>
      )}
    </div>
  );
}

DropdownList.defaultProps = {
  defaultItem: null,
  placeholder: 'Search',
  onSearch: null,
};

DropdownList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ).isRequired,
  defaultItem: PropTypes.string,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  onSearch: PropTypes.func,
};
