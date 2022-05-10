import {createSlice} from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'misc',
  initialState: {
    loading: false,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export default slice.reducer;

export const {setLoading} = slice.actions;
