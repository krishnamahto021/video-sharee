import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "sonner";

interface User {
  email: string;
  name?: string;
  token: string;
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
    const { data } = await axios.post<AuthResponse>(
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
    const { data } = await axios.post<AuthResponse>(
      "/api/v1/auth/sign-in",
      payload
    );
    if (data.success) {
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
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(
        signInUser.fulfilled,
        (state, action: PayloadAction<User | null>) => {
          state.loggedInUser = action.payload;
          if ("payload" in action) {
            localStorage.setItem(
              "loggedInUser",
              JSON.stringify(action.payload)
            );
          }
        }
      )
  },
});

export const authReducer = authSlice.reducer;
