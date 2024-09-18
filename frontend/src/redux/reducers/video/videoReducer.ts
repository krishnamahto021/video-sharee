import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ConfigWithJWT } from "../../../types";
import backendApi from "../../../api/axios";
import { RootState } from "../../store";
import { toast } from "sonner";

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
  thumbNail: string;
}

export interface EditVideo {
  _id: string;
  path: File | string;
  title?: string;
  description?: string;
  uploadedBy: {
    email: string;
  };
  isPrivate: boolean | string;
  thumbNail: File | string;
}

// State interface
export interface VideoState {
  videos: IVideo[] | null;
  publicVideos: IVideo[] | null;
  searchResults: IVideo[] | null;
  isLoading: boolean;
  error: string | null;
  editVideo: IVideo | null;
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

// handle single file
interface SingleFileResponse {
  success: boolean;
  message: string;
  video?: IVideo;
}

const initialState: VideoState = {
  videos: [],
  publicVideos: [],
  searchResults: [],
  isLoading: false,
  error: null,
  editVideo: null,
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

// Update video details
export const updateVideo = createAsyncThunk<
  IVideo,
  {
    videoId: string;
    updateData: Partial<EditVideo>; // Use EditVideo for file handling
    configWithJwt: ConfigWithJWT;
  },
  { rejectValue: string }
>("video/update", async ({ videoId, updateData, configWithJwt }, thunkAPI) => {
  try {
    const formData = new FormData();

    // Append form data if files are present
    if (updateData.path instanceof File) {
      formData.append("video", updateData.path);
    }
    if (updateData.thumbNail instanceof File) {
      formData.append("thumbnail", updateData.thumbNail);
    }

    // Append other data if present
    if (updateData.title) formData.append("title", updateData.title);
    if (updateData.description)
      formData.append("description", updateData.description);
    formData.append("isPrivate", String(updateData.isPrivate));

    const { data } = await backendApi.put<SingleFileResponse>(
      `/api/v1/aws/video/update/${videoId}`,
      formData,
      {
        ...configWithJwt,
        headers: {
          ...configWithJwt.headers,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (data.success && data.video) {
      toast.success(data.message);
      return data.video;
    }
    return thunkAPI.rejectWithValue(data.message);
  } catch (error: any) {
    const errMessage = error.response?.data?.message || "Something went wrong";
    return thunkAPI.rejectWithValue(errMessage);
  }
});

// Delete video
export const deleteVideo = createAsyncThunk<
  { videoId: string },
  { videoId: string; configWithJwt: ConfigWithJWT },
  { rejectValue: string }
>("video/delete", async ({ videoId, configWithJwt }, thunkAPI) => {
  try {
    const { data } = await backendApi.delete<FileResponse>(
      `/api/v1/aws/video/delete/${videoId}`,
      configWithJwt
    );

    if (data.success) {
      return { videoId };
    }
    return thunkAPI.rejectWithValue(data.message);
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
    setEditVideo: (state, action: PayloadAction<IVideo | null>) => {
      state.editVideo = action.payload;
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
      )
      // Update video
      .addCase(
        updateVideo.fulfilled,
        (state, action: PayloadAction<IVideo>) => {
          const index = state.videos?.findIndex(
            (video) => video._id === action.payload._id
          );
          if (index !== undefined && index !== -1 && state.videos) {
            state.videos[index] = action.payload;
            state.editVideo = null;
          }
        }
      )
      // Delete video
      .addCase(
        deleteVideo.fulfilled,
        (state, action: PayloadAction<{ videoId: string }>) => {
          state.videos =
            state.videos?.filter(
              (video) => video._id !== action.payload.videoId
            ) || null;
        }
      );
  },
});

export const videoReducer = videoSlice.reducer;
export const selectVideos = (state: RootState) => state.video.videos;
export const { setVideos, setEditVideo } = videoSlice.actions;
export const selectPublicVideos = (state: RootState) =>
  state.video.publicVideos;
export const selectSearchVideos = (state: RootState) =>
  state.video.searchResults;
export const selectVideoLoading = (state: RootState) => state.video.isLoading;
export const selectVideoError = (state: RootState) => state.video.error;
export const selectEditVideo = (state: RootState) => state.video.editVideo;
