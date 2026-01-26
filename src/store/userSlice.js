import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (info, { rejectWithValue }) => {
    try {
      const response = await fetch("https://localhost:3000/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: info,
      });

      const data = await response.json();

      if (!response.ok) {
        rejectWithValue(data.message || "Login Failed");
      }

      console.log("Response:");
      console.log(data);

      // return data;
    } catch (error) {
      rejectWithValue(error.message);
    }
  },
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loginUser.pending, (store) => {
      store.loading = true;
      store.error = null;
    });
    builder.addCase(loginUser.fulfilled, (store, action) => {
      store.user = action.payload;
      store.loading = false;
    });
    builder.addCase(loginUser.rejected, (store, action) => {
      store.loading = false;
      store.error = action.payload;
    });
  },
});

export default userSlice;
