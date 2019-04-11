export const CAMERA_INITIAL_POSITION = {
  lat: 46.88,
  lon: -13,
  height: 90000,
  pitch: -0.3,
  heading: 0,
  roll: 0
};
export const CAMERA_FINAL_POSITION = {
  lat: 49.2002,
  lon: -0.1382,
  height: 20000000,
  pitch: 1.7,
  heading: 0,
  roll: 0
};
export const ANIMATION_DURATION = 0;
export const INITIAL_WAIT = 0.2;
export const FINAL_ANIMATION_DURATION = 8;

export const MARKERS = [
  {
    name: 'Coral bleaching',
    lat: -14.331400,
    lon: -170.711400,
    type: 'billboard',
    text: 'In 360 degrees, explore the dramatic aftermath of severe coral bleaching.',
    cta: 'VISIT THIS PLACE',
    image: '../../static/images/splash/marker.svg',
    imageSelected: '../../static/images/splash/marker.svg',
    imageNotSelected: '../../static/images/splash/marker.svg',
    thumbnail: '../../static/images/splash/american-samoa-coral-bleaching-thumbnail.jpg',
    routeId: 'coral'
  },
  {
    name: 'Neon roads',
    lat: 13.082700,
    lon: 80.270700,
    type: 'billboard',
    text: "The lights of our roads at night offer a glimpse of the world's changing cities.",
    cta: 'SEE MORE',
    image: '../../static/images/splash/marker.svg',
    imageSelected: '../../static/images/splash/marker.svg',
    imageNotSelected: '../../static/images/splash/marker.svg',
    thumbnail: '../../static/images/splash/neonroads-thumbnail.jpg'
  },
  {
    name: 'Lake Chad',
    lat: 13.107900,
    lon: 14.449000,
    type: 'billboard',
    text: 'How the disappearing waters of Lake Chad helped create conditions ripe for conflict.',
    cta: 'LEARN MORE',
    image: '../../static/images/splash/marker.svg',
    imageSelected: '../../static/images/splash/marker.svg',
    imageNotSelected: '../../static/images/splash/marker.svg',
    thumbnail: '../../static/images/splash/lakechad-thumbnail.jpg'
  },
  {
    name: 'Cities and rising seas',
    lat: 40.712800,
    lon: -74.006000,
    type: 'billboard',
    text: 'Here are five things you should know about sea level rise and the risks it poses to cities.',
    cta: 'LEARN MORE',
    image: '../../static/images/splash/marker.svg',
    imageSelected: '../../static/images/splash/marker.svg',
    imageNotSelected: '../../static/images/splash/marker.svg',
    thumbnail: '../../static/images/splash/komodromos-thumbnail.jpg'
  }
];


export default {
  CAMERA_INITIAL_POSITION,
  CAMERA_FINAL_POSITION,
  ANIMATION_DURATION,
  INITIAL_WAIT,
  FINAL_ANIMATION_DURATION,
  MARKERS
};
