import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedPostComments: null,
  loading: false,
};

export const fetchCurrentPostComments = createAsyncThunk(
  "comments/fetchCurrentComments",
  async (info, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:3000/comment/${info}`);
      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Couldn't find comments");
      }

      console.log(data);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const createNewComment = createAsyncThunk(
  "comments/newComment",
  async (info, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:3000/comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(info),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.messge || "Couldnt create comment");
      }

      console.log("Created Comment ");
      console.log(data);

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const commentSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCurrentPostComments.pending, (store) => {
      store.loading = true;
      store.error = null;
      store.selectedPostComments = null;
    });
    builder.addCase(fetchCurrentPostComments.fulfilled, (store, action) => {
      store.loading = false;
      store.selectedPostComments = action.payload;
    });
    builder.addCase(fetchCurrentPostComments.rejected, (store, action) => {
      store.loading = false;
      store.error = action.payload.comments;
    });
    builder.addCase(createNewComment.pending, (store) => {
      store.loading = true;
      store.error = null;
    });
    builder.addCase(createNewComment.fulfilled, (store) => {
      store.loading = false;
    });
    builder.addCase(createNewComment.rejected, (store, action) => {
      store.loading = false;
      store.error = action.payload.comments;
    });
  },
});

export default commentSlice.reducer;
export const selectCurrentComments = (store) =>
  store.comments.selectedPostComments;
