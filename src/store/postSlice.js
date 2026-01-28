import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  posts: [],
  currentUserPost: {
    currentUser: null,
    posts: [],
  },
  selectedPost: null,
  loading: false,
  error: null,
};

export const fetchAllPosts = createAsyncThunk(
  "posts/fetchAllPosts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:3000/post/view/all");
      const data = await response.json();

      if (!response.ok) {
        rejectWithValue(data.message || "Error fetching all posts");
      }

      return data;
    } catch (error) {
      rejectWithValue(error.message);
    }
  },
);

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
        return rejectWithValue(data.message || "Cannot create a post");
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const getCurrentUserPosts = createAsyncThunk(
  "posts/getUserPosts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:3000/post", {
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Could not fetch user posts");
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const getPostById = createAsyncThunk(
  "posts/getPostById",
  async (info, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `http://localhost:3000/post/view?id=${info}`,
      );
      const data = await response.json();

      if (!response.ok) {
        rejectWithValue(data.message || "Couldn't find post by that id");
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
    builder.addCase(getCurrentUserPosts.pending, (store) => {
      store.loading = true;
      store.error = null;
    });
    builder.addCase(getCurrentUserPosts.fulfilled, (store, action) => {
      store.currentUserPost = action.payload;
      store.loading = false;
    });
    builder.addCase(getCurrentUserPosts.rejected, (store, action) => {
      store.loading = false;
      store.error = action.payload;
    });
    builder.addCase(getPostById.pending, (store) => {
      store.loading = true;
      store.error = null;
    });
    builder.addCase(getPostById.fulfilled, (store, action) => {
      store.selectedPost = action.payload;
      store.loading = false;
    });
    builder.addCase(getPostById.rejected, (store, action) => {
      store.loading = false;
      store.error = action.payload;
    });
    builder.addCase(fetchAllPosts.pending, (store) => {
      store.loading = true;
      store.error = null;
    });
    builder.addCase(fetchAllPosts.fulfilled, (store, action) => {
      store.posts = action.payload;
      store.loading = false;
    });
    builder.addCase(fetchAllPosts.rejected, (store, action) => {
      store.loading = false;
      store.error = action.payload;
    });
  },
});

export default postSlice.reducer;
export const selectCurrentUserPosts = (store) => store.posts.currentUserPost;
export const selectCurrentSelectedPost = (store) => store.posts.selectedPost;
