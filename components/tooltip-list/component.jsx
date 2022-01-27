import {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';

// components
import SearchInput from 'components/ui/SearchInput';

export default function TooltipList({
  list,
  onClickItem,
  placeholder,
}) {
  const [search, setSearch] = useState('');
  const searchBoxRef = useRef(null);
  const handleSearch = useCallback((_search) => { setSearch(_search); }, [setSearch]);
  const getSearchBoxRef = useCallback((ref) => { searchBoxRef.current = ref; }, []);

  const handleCountry = useCallback(({ target }) => {
    const {
      label,
      value,
    } = target.dataset;
    onClickItem({
      label,
      value,
    });
  }, [onClickItem]);

  const results = useMemo(() => list
    .filter(({ label }) => label.toLocaleLowerCase().includes(search.toLocaleLowerCase())),
  [list, search]);

  useEffect(() => {
    if (searchBoxRef.current) searchBoxRef.current.focus();
  }, []);

  return (
    <div className="c-tooltip-list">
      <div className="search-container">
        <SearchInput
          getRef={getSearchBoxRef}
          input={{
            value: search,
            placeholder,
          }}
          onSearch={handleSearch}
        />
      </div>
      <div className="list-container">
        <ul className="list">
          {results.map(({ label, value }) => (
            <li
              key={value}
              className="list-item"
            >
              <button
                type="button"
                onClick={handleCountry}
                data-label={label}
                data-value={value}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

TooltipList.defaultProps = {
  placeholder: 'Search',
};

TooltipList.propTypes = {
  onClickItem: PropTypes.func.isRequired,
  list: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ).isRequired,
  placeholder: PropTypes.string,
};
