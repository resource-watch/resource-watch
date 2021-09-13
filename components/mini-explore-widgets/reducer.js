import {
  createSlice,
} from '@reduxjs/toolkit';

export const miniExploreWidgetState = {
  geostoreBasin: null,
};

export const miniExploreWidgetSlice = createSlice({
  name: 'mini-explore-widget',
  reducers: {
    setGeostoreBasin: (state, { payload }) => ({
      ...state,
      geostoreBasin: payload,
    }),
  },
  initialState: miniExploreWidgetState,
});

export default miniExploreWidgetSlice;
