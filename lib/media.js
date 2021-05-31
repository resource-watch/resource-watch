import { createMedia } from '@artsy/fresnel';

// small: 0,
// medium: 780,
// large: 1024,
// xlarge: 1260,
// xxlarge: 1560,

const {
  MediaContextProvider,
  createMediaStyle,
  Media,
} = createMedia({
  breakpoints: {
    sm: 0,
    md: 780,
    lg: 1024,
    xl: 1260,
  },
});

// Make styles for injection into the header of the page
const mediaStyles = createMediaStyle();

export {
  mediaStyles,
  Media,
};

export default MediaContextProvider;
