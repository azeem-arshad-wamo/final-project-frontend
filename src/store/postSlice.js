import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  posts: [],
  loading: false,
  error: null,
};

export const createPost = createAsyncThunk(
  "posts/createPost",
  async (info, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:3000/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(info),
      });

      const data = await response.json();

      if (!response.ok) {
        rejectWithValue(data.message || "Cannot create a post");
      }

      return data;
    } catch (error) {
      rejectWithValue(error.message);
    }
  },
);

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createPost.pending, (store) => {
      store.loading = true;
      store.error = null;
    });
    builder.addCase(createPost.fulfilled, (store) => {
      store.loading = false;
    });
    builder.addCase(createPost.rejected, (store, action) => {
      store.loading = false;
      store.error = action.payload;
    });
  },
});

export default postSlice.reducer;
