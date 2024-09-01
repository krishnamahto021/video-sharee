import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ConfigWithJWT } from "../../../types";
import backendApi from "../../../api/axios";
import { RootState } from "../../store";

// Video interface
export interface IVideo {
  _id: string;
  path: string;
  title?: string;
  description?: string;
  uploadedBy: {
    email: string;
  };
  isPrivate: boolean;
}

// State interface
export interface VideoState {
  videos: IVideo[] | null;
  publicVideos: IVideo[] | null;
  searchResults: IVideo[] | null;
  isLoading: boolean;
  error: string | null;
}

// Payload types
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
  publicVideos: [],
  searchResults: [],
  isLoading: false,
  error: null,
};

// Fetch videos for logged in user
export const fetchVideoForUser = createAsyncThunk<
  IVideo[],
  FileFetchPayload,
  { rejectValue: string }
>("/video/fetchVideoForUser", async (payload, thunkAPI) => {
  try {
    const { configWithJwt } = payload;
    const { data } = await backendApi.get<FileResponse>(
      `/api/v1/user/get-latest-videos`,
      configWithJwt
    );
    if (data.success) {
      return data.videos || [];
    }
    return thunkAPI.rejectWithValue(data.message);
  } catch (error: any) {
    const errMessage = error.response?.data?.message || "Something went wrong";
    return thunkAPI.rejectWithValue(errMessage);
  }
});

// Fetch public videos
export const fetchVideoForPublic = createAsyncThunk<
  IVideo[],
  void,
  { rejectValue: string }
>("/video/fetchVideoForPublic", async (_, thunkAPI) => {
  try {
    const { data } = await backendApi.get<FileResponse>(
      "/api/v1/fetch-latest-6-videos"
    );
    if (data.success) {
      return data.videos || [];
    }
    return thunkAPI.rejectWithValue(data.message);
  } catch (error: any) {
    const errMessage = error.response?.data?.message || "Something went wrong";
    return thunkAPI.rejectWithValue(errMessage);
  }
});

// Get search results
export const getSearchResults = createAsyncThunk<
  IVideo[],
  string,
  { rejectValue: string; state: RootState }
>("video/search", async (query, thunkAPI) => {
  try {
    const { videos, publicVideos } = thunkAPI.getState().video;
    const combinedVideos = [...(publicVideos || []), ...(videos || [])];
    const filteredVideos = combinedVideos.filter(
      (video) =>
        video.title?.toLowerCase().includes(query.toLowerCase()) ||
        video.description?.toLowerCase().includes(query.toLowerCase())
    );
    return filteredVideos;
  } catch (error: any) {
    const errMessage = error.response?.data?.message || "Something went wrong";
    return thunkAPI.rejectWithValue(errMessage);
  }
});

// Download video
export const downloadVideo = createAsyncThunk<
  void,
  { videoId: string },
  { rejectValue: string }
>("video/download", async (payload, thunkAPI) => {
  try {
    const { videoId } = payload;
    const state = thunkAPI.getState() as RootState;
    const queryParams = state.auth.loggedInUser
      ? `?userId=${encodeURIComponent(state.auth.loggedInUser._id)}`
      : "";
    const response = await backendApi.get(
      `/api/v1/video/download/${videoId}${queryParams}`,
      {
        responseType: "blob",
      }
    );
    const contentDisposition = response.headers["content-disposition"];
    const filename = contentDisposition
      ? contentDisposition.split("filename=")[1].replace(/['"]/g, "")
      : "video.mp4";
    const blob = new Blob([response.data], {
      type: response.headers["content-type"],
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error: any) {
    const errMessage = error.response?.data?.message || "Something went wrong";
    return thunkAPI.rejectWithValue(errMessage);
  }
});

const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    setVideos: (state, action: PayloadAction<IVideo>) => {
      state.videos?.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVideoForUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchVideoForUser.fulfilled,
        (state, action: PayloadAction<IVideo[]>) => {
          state.videos = action.payload;
          state.isLoading = false;
        }
      )
      .addCase(fetchVideoForUser.rejected, (state, action) => {
        state.error = action.payload as string; // Using 'as string' to match the expected type
        state.isLoading = false;
      })
      .addCase(fetchVideoForPublic.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchVideoForPublic.fulfilled,
        (state, action: PayloadAction<IVideo[]>) => {
          state.publicVideos = action.payload;
          state.isLoading = false;
        }
      )
      .addCase(fetchVideoForPublic.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isLoading = false;
      })
      .addCase(
        getSearchResults.fulfilled,
        (state, action: PayloadAction<IVideo[]>) => {
          state.searchResults = action.payload;
        }
      );
  },
});

export const videoReducer = videoSlice.reducer;
export const selectVideos = (state: RootState) => state.video.videos;
export const { setVideos } = videoSlice.actions;
export const selectPublicVideos = (state: RootState) =>
  state.video.publicVideos;
export const selectSearchVideos = (state: RootState) =>
  state.video.searchResults;
export const selectVideoLoading = (state: RootState) => state.video.isLoading;
export const selectVideoError = (state: RootState) => state.video.error;
