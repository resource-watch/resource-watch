export const LEGEND_TIMELINE_PROPERTIES = {
  trackStyle: [
    { backgroundColor: 'transparent' },
    { backgroundColor: '#F0F1F2' }
  ],
  railStyle: { backgroundColor: '#F0F1F2' },
  handleStyle: [
    {
      backgroundColor: '#c32d7b',
      width: '14px',
      height: '14px',
      border: 0,
      transform: 'translate(calc(50% - 4px), 0px)'
    }
  ],
  dotStyle: {
    width: 14,
    height: 14,
    borderColor: '#F0F1F2',
    transform: 'translate(0, 50%)',
    bottom: '50%',
    borderWidth: 3
  },
  activeDotStyle: {
    width: 14,
    height: 14,
    borderColor: '#F0F1F2',
    transform: 'translate(0, 50%)',
    bottom: '50%',
    borderWidth: 3
  },
  markStyle: {
    fontFamily: '\'Lato\', \'Helvetica Neue\', Helvetica, Arial, sans',
    color: '#393f44'
  }
};

export default { LEGEND_TIMELINE_PROPERTIES };
