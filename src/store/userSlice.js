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

export const getCurrentUser = createAsyncThunk(
  "user/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:3000/user", {
        credentials: "include",
      });
      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(
          data.message || "Can't find info for current user",
        );
      }

      return data;
    } catch (error) {
      rejectWithValue(error.message);
    }
  },
);

export const createNewUser = createAsyncThunk(
  "user/createUser",
  async (info, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:3000/user/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(info),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Could not create new user");
      }

      console.log("User Created");
      console.log(data);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const logoutUser = createAsyncThunk(
  "user/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:3000/user/logout", {
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Couldn't logout properly");
      }

      console.log("After Reponse");
      console.log(data);
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
    builder
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.error = action.payload;
      });
    builder
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder.addCase(createNewUser.pending, (store) => {
      store.loading = true;
      store.error = null;
    });
    builder.addCase(createNewUser.fulfilled, (store, action) => {
      store.user = action.payload;
      store.loading = false;
    });
    builder.addCase(createNewUser.rejected, (store, action) => {
      store.loading = false;
      store.error = action.payload;
    });
  },
});

export default userSlice.reducer;
export const selectCurrentUser = (store) => store.user.user;
