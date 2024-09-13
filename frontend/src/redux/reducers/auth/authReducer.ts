import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import backendApi from "../../../api/axios";
import { NavigateFunction } from "react-router-dom";
import { toast } from "sonner";
import { RootState } from "../../store";

interface User {
  _id: string;
  email: string;
  name?: string;
  token: string;
  uploadCount: number;
  downloadCount: number;
}

export interface AuthState {
  loggedInUser: User | null;
  loading: boolean;
  error: string | null;
}

// Define the payload and response types
interface SignUpPayload {
  email: string;
  password: string;
  name?: string;
}

interface SignInPayload {
  email: string;
  password: string;
  navigate: NavigateFunction;
}

interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
}

// Initialize state from local storage
const initialState: AuthState = {
  loggedInUser: null,
  loading: false,
  error: null,
};
// Async thunk for signing up a user
export const signUpUser = createAsyncThunk<
  void,
  SignUpPayload,
  { rejectValue: string }
>("auth/signUpUser", async (payload, thunkAPI) => {
  try {
    const { data } = await backendApi.post<AuthResponse>(
      "/api/v1/auth/sign-up",
      payload
    );
    if (data.success) {
      toast.success(data.message);
    } else {
      toast.success(data.message);
    }
  } catch (error: any) {
    const errMessage = error.response?.data?.message || "Something went wrong";
    toast.error(errMessage);
    return thunkAPI.rejectWithValue(errMessage);
  }
});

// Async thunk for signing in a user
export const signInUser = createAsyncThunk<
  string | null,
  SignInPayload,
  { rejectValue: string }
>("auth/signInUser", async (payload, thunkApi) => {
  try {
    const { email, password, navigate } = payload;
    const { data } = await backendApi.post<AuthResponse>(
      "/api/v1/auth/sign-in",
      {
        email,
        password,
      }
    );
    if (data.success && data.user?.token) {
      if (data.user) {
        toast.success(data.message);
        localStorage.setItem("token", data.user.token);
        navigate("/user/profile");
      }
      return data.user.token || null;
    } else {
      toast.error(data.message);
      return thunkApi.rejectWithValue(data.message);
    }
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Something went wrong";
    toast.error(errorMessage);
    return thunkApi.rejectWithValue(errorMessage);
  }
});

export const fetchUserDetails = createAsyncThunk<
  User | null,
  void,
  { rejectValue: string }
>("auth/fetchUserDetails", async (_, thunkApi) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return thunkApi.rejectWithValue("No token found");
    }

    const { data } = await backendApi.get<AuthResponse>(
      "/api/v1/user/details",
      {
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token in the header
        },
      }
    );

    if (data.success && data.user) {
      return data.user; // Return the user details
    } else {
      return thunkApi.rejectWithValue(data.message);
    }
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Failed to fetch user details";
    return thunkApi.rejectWithValue(errorMessage);
  }
});

// Create the auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logOutUser: (state, action: PayloadAction<NavigateFunction>) => {
      state.loggedInUser = null;
      state.error = null;
      const navigate = action.payload;
      localStorage.removeItem("token");
      toast.warning("We will miss you");
      navigate("/sign-in");
    },
    updateUser: (
      state,
      action: PayloadAction<{ name: string; email: string }>
    ) => {
      if (state.loggedInUser) {
        state.loggedInUser.name = action.payload.name;
        state.loggedInUser.email = action.payload.email;
        toast.success("User details updated successfully");
      }
    },

    increaseDownloadCount: (state) => {
      const newDownload = (state.loggedInUser?.downloadCount || 0) + 1;
      if (state.loggedInUser?.downloadCount) {
        state.loggedInUser.downloadCount = newDownload;
      }
    },
    increaseUploadCount: (state) => {
      const newUpload = (state.loggedInUser?.uploadCount || 0) + 1;
      if (state.loggedInUser?.uploadCount) {
        state.loggedInUser.uploadCount = newUpload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signInUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(
        signInUser.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload || "Error logging in";
        }
      )
      .addCase(
        fetchUserDetails.fulfilled,
        (state, action: PayloadAction<User | null>) => {
          state.loggedInUser = action.payload;
        }
      )
      .addCase(
        fetchUserDetails.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.error = action.payload || "Failed to fetch user details";
        }
      )
      .addCase(signUpUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUpUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(
        signUpUser.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload || "Error signing up";
        }
      );
  },
});

export const authReducer = authSlice.reducer;
export const {
  logOutUser,
  updateUser,
  increaseDownloadCount,
  increaseUploadCount,
} = authSlice.actions;
export const selectLoggedInUser = (state: RootState) => state.auth.loggedInUser;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;
