import {
  useEffect,
  useState,
  useRef,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import Tether from 'react-tether';

// components
import TooltipContainer from 'components/tooltip-container';
import DropdownList from 'components/dropdown-list';
import Banner from 'components/app/common/Banner';

export default function BannerCountries({
  title,
  countryList,
  onChangeCountry,
}) {
  const [isVisible, setVisibility] = useState(false);
  let countrySelectorRef = useRef(null);
  const tetherRef = useRef(null);
  let buttonRef = useRef(null);

  const toggleDropdown = useCallback(() => {
    setVisibility(!isVisible);
  }, [isVisible]);

  const handleSearch = useCallback(() => {
    if (tetherRef.current === null) return false;
    return tetherRef.current.position();
  }, [tetherRef]);

  useEffect(() => {
    const handleMouseDown = (e) => {
      const countrySelectorDOM = countrySelectorRef.current;
      const buttonDOM = buttonRef.current;
      const clickOutside = !countrySelectorDOM?.contains(e.target)
        && !buttonDOM?.contains(e.target);
      if (clickOutside) setVisibility(false);
    };

    const handleEscapeKey = (e) => {
      if (e.key === 'Escape') setVisibility(false);
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('keydown', handleEscapeKey);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  return (
    <Banner
      className="-text-center"
      bgImage="/static/images/pages/app/bg-banner-ocean-watch.png"
      styles={{
        borderRadius: 5,
      }}
    >
      <h3 className="-claim">
        {title}
      </h3>
      <div style={{
        marginTop: 15,
      }}
      >
        <Tether
          ref={(tether) => { tetherRef.current = tether; }}
          attachment="bottom center"
          constraints={[{
            to: 'window',
          }]}
          offset="15px 0"
          renderTarget={(ref) => {
            buttonRef = ref;

            return (
              <button
                ref={ref}
                type="button"
                className="c-btn -secondary -no-hover"
                onClick={toggleDropdown}
              >
                Select a country
              </button>
            );
          }}
          renderElement={(ref) => {
            countrySelectorRef = ref;
            if (!isVisible) return null;

            return (
              <div ref={ref}>
                <TooltipContainer>
                  <DropdownList
                    items={countryList}
                    name="countries"
                    onSelect={onChangeCountry}
                    onSearch={handleSearch}
                  />
                </TooltipContainer>
              </div>
            );
          }}
        />
      </div>
    </Banner>
  );
}

BannerCountries.propTypes = {
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]).isRequired,
  countryList: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ).isRequired,
  onChangeCountry: PropTypes.func.isRequired,
};
