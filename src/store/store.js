import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice.js";
import postSlice from "./postSlice.js";
import commentSlice from "./commentSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    posts: postSlice,
    comments: commentSlice,
  },
});
