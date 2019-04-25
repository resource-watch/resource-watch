import { getVegaTheme } from 'widget-editor';

export const getDefaultTheme = (isThumbnail = false) => {
  const defaultTheme = getVegaTheme(isThumbnail);
  return {
    ...defaultTheme,
    range: {
      ...defaultTheme.range,
      category: defaultTheme.range.category20
    }
  };
};

export default { getDefaultTheme };
