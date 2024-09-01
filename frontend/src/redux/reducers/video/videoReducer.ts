import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ConfigWithJWT } from "./../../../types";
import backendApi from "../../../api/axios";
import { RootState } from "../../store";
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

export interface VideoState {
  videos: IVideo[] | null;
  publicVideos: IVideo[] | null;
  searchResults: IVideo[] | null;
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
  publicVideos: [],
  searchResults: [],
};

// fetch videos for logged in user
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

// fetch public videos
export const fetchVideoForPublic = createAsyncThunk<
  IVideo[],
  void,
  { rejectValue: string }
>("/video/fetchVideoForPublic", async (_, thunkApi) => {
  try {
    const { data } = await backendApi.get<FileResponse>(
      "/api/v1/fetch-latest-6-videos"
    );
    if (data.success) {
      return data.videos || [];
    }
    return thunkApi.rejectWithValue(data.message);
  } catch (error: any) {
    const errMessage = error.response?.data?.message || "Something went wrong";
    return thunkApi.rejectWithValue(errMessage);
  }
});

export const getSearchResults = createAsyncThunk<
  IVideo[],
  string,
  { rejectValue: string; state: RootState }
>("video/search", async (query, thunkAPI) => {
  try {
    const { videos, publicVideos } = thunkAPI.getState().video;

    // Combine both arrays
    const combinedVideos = [...(publicVideos || []), ...(videos || [])];
    // Filter combined videos based on query
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

interface DownloadVideoPayload {
  videoId: string;
}
// download video
export const downloadVideo = createAsyncThunk<
  void,
  DownloadVideoPayload,
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
    // Extract filename from the Content-Disposition header
    const contentDisposition = response.headers["content-disposition"];
    const filename = contentDisposition
      ? contentDisposition.split("filename=")[1].replace(/['"]/g, "")
      : "video.mp4";

    // Create a blob from the response data
    const blob = new Blob([response.data], {
      type: response.headers["content-type"],
    });

    // Create a temporary anchor element to trigger the download
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

// create video slice

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
      .addCase(
        fetchVideoForUser.fulfilled,
        (state, action: PayloadAction<IVideo[]>) => {
          state.videos = action.payload;
        }
      )
      .addCase(fetchVideoForPublic.fulfilled, (state, action) => {
        state.publicVideos = action.payload;
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
