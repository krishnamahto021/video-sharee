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
const storedUser = localStorage.getItem("loggedInUser");
const initialState: AuthState = {
  loggedInUser: storedUser ? JSON.parse(storedUser) : null,
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
  User | null,
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
    if (data.success) {
      if (data.user) {
        localStorage.setItem("loggedInUser", JSON.stringify(data.user));
      }
      navigate("/user/profile");
      return data.user || null;
    } else {
      return thunkApi.rejectWithValue(data.message);
    }
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Something went wrong";
    toast.error(errorMessage);
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
      const navigate = action.payload;
      localStorage.removeItem("loggedInUser");
      toast.warning("We will miss you");
      navigate("/sign-in");
    },
    updateUser: (state, action: PayloadAction<string>) => {
      if (state.loggedInUser) {
        state.loggedInUser.name = action.payload;
        toast.success("User name updated successfully");
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
    builder.addCase(
      signInUser.fulfilled,
      (state, action: PayloadAction<User | null>) => {
        state.loggedInUser = action.payload;
        if (action.payload?.token) {
          localStorage.setItem("token", action.payload.token);
        }
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
