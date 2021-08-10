import {
  createSlice,
} from '@reduxjs/toolkit';

export const miniExploreWidgetState = {
  geostore: null,
};

export const miniExploreWidgetSlice = createSlice({
  name: 'mini-explore-widget',
  reducers: {
    setGeostore: (state, { payload }) => ({
      ...state,
      geostore: payload,
    }),
  },
  initialState: miniExploreWidgetState,
});

export default miniExploreWidgetSlice;
