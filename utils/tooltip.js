export const getTooltipContainer = () => {
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    if (document.querySelector('.sidebar-content')) {
      return document.querySelector('.sidebar-content');
    }

    return document.body;
  }

  return null;
};

export default { getTooltipContainer };
