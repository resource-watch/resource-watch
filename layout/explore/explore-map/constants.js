// docs: https://react-component.github.io/slider/#common-api
export const LEGEND_TIMELINE_PROPERTIES = {
  trackStyle: [
    { backgroundColor: '#caccd0' },
    { backgroundColor: '#caccd0' }
  ],
  railStyle: {
    backgroundColor: '#caccd0',
    height: 2
  },
  handleStyle: [
    {
      backgroundColor: '#c32d7b',
      width: 21,
      height: 21,
      borderWidth: 3,
      borderColor: '#fff',
      transform: 'translate(calc(-50% + 6px), calc(-50% + 12px))',
      top: 0
    },
    {
      backgroundColor: '#c32d7b',
      width: 21,
      height: 21,
      borderWidth: 3,
      borderColor: '#fff',
      transform: 'translate(calc(-50% + 6px), calc(-50% + 12px))',
      top: 0
    }
  ],
  dotStyle: {
    width: 16,
    height: 16,
    borderColor: '#caccd0',
    transform: 'translate(calc(-50% + 4px), 50%)',
    bottom: '50%',
    borderWidth: 2
  },
  activeDotStyle: {
    width: 16,
    height: 16,
    borderColor: '#caccd0',
    transform: 'translate(calc(-50% + 4px), 50%)',
    bottom: '50%'
  },
  markStyle: {
    width: 'auto',
    margin: 0,
    fontFamily: '\'Lato\', \'Helvetica Neue\', Helvetica, Arial, sans',
    color: '#393f44'
  }
};

export const TIMELINE_THRESHOLD = 5;

export default {
  LEGEND_TIMELINE_PROPERTIES,
  TIMELINE_THRESHOLD
};
