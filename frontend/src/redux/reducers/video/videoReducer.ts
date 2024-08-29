import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ConfigWithJWT } from "./../../../types";
import { toast } from "sonner";
import axios from "axios";
import { RootState } from "../../store";
export interface IVideo {
  path: string;
  title?: string;
  description?: string;
  uploadedBy: {
    email: string;
  };
}

export interface VideoState {
  videos: IVideo[] | null;
}

// payload types
interface FileFetchPayload {
  configWithJwt: ConfigWithJWT;
}

interface FileResponse {
  success: boolean;
  message: string;
  videos?: IVideo[];
}

const initialState: VideoState = {
  videos: [],
};

// fetch videos for logged in user
export const fetchVideoForUser = createAsyncThunk<
  IVideo[],
  FileFetchPayload,
  { rejectValue: string }
>("/video/fetchVideoForUser", async (payload, thunkAPI) => {
  try {
    const { configWithJwt } = payload;
    const { data } = await axios.get<FileResponse>(
      `/api/v1/user/get-latest-videos`,
      configWithJwt
    );
    if (data.success) {
      return data.videos || [];
    }
    return thunkAPI.rejectWithValue(data.message);
  } catch (error: any) {
    const errMessage = error.response?.data?.message || "Something went wrong";
    toast.error(errMessage);
    return thunkAPI.rejectWithValue(errMessage);
  }
});

// create video slice

const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      fetchVideoForUser.fulfilled,
      (state, action: PayloadAction<IVideo[]>) => {
        state.videos = action.payload;
      }
    );
  },
});

export const videoReducer = videoSlice.reducer;
export const selectVideos = (state: RootState) => state.video.videos;
