import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedPostComments: null,
};

const commentSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {},
});

export default commentSlice.reducer;
