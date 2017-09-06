import React from 'react';
import PropTypes from 'prop-types';
import Slider from 'react-slick';

const defaultSettings = {
  dots: false,
  infinite: true,
  slidesToShow: 7,
  slidesToScroll: 7,
  autoplay: true,
  autoplaySpeed: 3500,
  arrows: false
};

function Carousel(props) {
  const settings = props.settings || defaultSettings;

  if (window.innerWidth < 720) {
    settings.slidesToShow = 2;
    settings.slidesToScroll = 2;
  }

  return (
    <div className="c-carousel">
      <Slider {...settings}>
        {props.items.map(item => item)}
      </Slider>
    </div>
  );
}

Carousel.propTypes = {
  items: PropTypes.array.isRequired,
  settings: PropTypes.object
};

Carousel.defaultProps = {
  items: []
};

export default Carousel;
