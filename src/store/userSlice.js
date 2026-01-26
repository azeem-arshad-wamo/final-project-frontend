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
      const response = await fetch("http://localhost:3000/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(info),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Login Failed");
      }

      console.log("Correct Password");
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
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

export default userSlice.reducer;
export const selectCurrentUser = (store) => store.user.user;
