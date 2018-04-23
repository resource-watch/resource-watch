const BASEMAPS = {
  dark: {
    id: 'dark',
    value: 'https://api.mapbox.com/styles/v1/resourcewatch/cjgcf9gqk9tmm2spd9zr0tml3/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmVzb3VyY2V3YXRjaCIsImEiOiJjajFlcXZhNzcwMDBqMzNzMTQ0bDN6Y3U4In0.FRcIP_yusVaAy0mwAX1B8w',
    label: 'Dark',
    options: {
      attribution: '<a href="https://www.mapbox.com/about/maps/" target="_blank">© Mapbox</a> <a href="http://www.openstreetmap.org/about/" target="_blank">© OpenStreetMap</a>'
    }
  },
  light: {
    id: 'light',
    value: 'https://api.mapbox.com/styles/v1/resourcewatch/cjgcf9rs05qnu2rrpp4qzucox/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmVzb3VyY2V3YXRjaCIsImEiOiJjajFlcXZhNzcwMDBqMzNzMTQ0bDN6Y3U4In0.FRcIP_yusVaAy0mwAX1B8w',
    label: 'Light',
    options: {
      attribution: '<a href="https://www.mapbox.com/about/maps/" target="_blank">© Mapbox</a> <a href="http://www.openstreetmap.org/about/" target="_blank">© OpenStreetMap</a>'
    }
  },
  satellite: {
    id: 'satellite',
    value: 'https://api.mapbox.com/styles/v1/jcawri/cj0cl6k8h00bu2sobqze86bcm/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiamNhd3JpIiwiYSI6ImNqMDd6N2NybzAwMHcyd29iZWlsems0enEifQ.eIqQeyQn5oCLkyivGtiVLg',
    label: 'Satellite',
    options: {
      attribution: '<a href="https://www.mapbox.com/about/maps/" target="_blank">© Mapbox</a> <a href="http://www.openstreetmap.org/about/" target="_blank">© OpenStreetMap</a>'
    }
  },
  terrain: {
    id: 'terrain',
    value: 'https://api.mapbox.com/styles/v1/jcawri/cj8emql45a7g92suc538h2shw/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiamNhd3JpIiwiYSI6ImNqMDd6N2NybzAwMHcyd29iZWlsems0enEifQ.eIqQeyQn5oCLkyivGtiVLg',
    label: 'Terrain',
    options: {
      attribution: '<a href="https://www.mapbox.com/about/maps/" target="_blank">© Mapbox</a> <a href="http://www.openstreetmap.org/about/" target="_blank">© OpenStreetMap</a>'
    }
  }
};

const LABELS = {
  none: {
    id: 'none',
    label: 'No labels',
    value: 'no_labels'
  },
  light: {
    id: 'light',
    label: 'Labels light',
    value: 'https://api.mapbox.com/styles/v1/prepdata/cjc6dank251222rnm74g4qmin/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicHJlcGRhdGEiLCJhIjoiY2piZmNrcTRjMXRsdzJxbm9uNm1nOXJtNSJ9.Jm14P-FBGvNxiaB-3mzSPw'
  },
  dark: {
    id: 'dark',
    label: 'Labels dark',
    value: 'https://api.mapbox.com/styles/v1/prepdata/cjc6c1e9o4wa42slf54h8ccix/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicHJlcGRhdGEiLCJhIjoiY2piZmNrcTRjMXRsdzJxbm9uNm1nOXJtNSJ9.Jm14P-FBGvNxiaB-3mzSPw'
  }
};

const BOUNDARIES = {
  dark: {
    id: 'dark',
    label: 'Boundaries',
    value: 'https://api.mapbox.com/styles/v1/resourcewatch/cjgcf8qdaai1x2rn6w3j4q805/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmVzb3VyY2V3YXRjaCIsImEiOiJjajFlcXZhNzcwMDBqMzNzMTQ0bDN6Y3U4In0.FRcIP_yusVaAy0mwAX1B8w'
  }
};

export { BASEMAPS, LABELS, BOUNDARIES };
