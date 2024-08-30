import React, { useEffect, useRef, useState } from "react";
import Layout from "../../components/Layout";
import { FaUpload } from "react-icons/fa";
import axios from "axios";
import { useConfig } from "../../customHooks/useConfigHook";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchVideoForUser,
  IVideo,
  selectVideos,
  setVideos,
} from "../../redux/reducers/video/videoReducer";
import { AppDispatch } from "../../redux/store";
import VideoCard from "../../components/VideoCard";
import {
  increaseUploadCount,
  selectLoggedInUser,
} from "../../redux/reducers/auth/authReducer";

interface AuthResponse {
  success: boolean;
  message: string;
  video: IVideo;
}

const Upload: React.FC = () => {
  const videos = useSelector(selectVideos);
  const dispatch = useDispatch<AppDispatch>();
  const fileRef = useRef<HTMLInputElement>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [fileError, setFileError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { configWithJWT } = useConfig();
  const loggedInUser = useSelector(selectLoggedInUser);
  const handleUploadClick = () => {
    fileRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith("video/")) {
        setFileError(null);
        const videoUrl = URL.createObjectURL(file);
        setVideoSrc(videoUrl);
      } else {
        setFileError("Please select a valid video file.");
        setVideoSrc(null);
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const file = fileRef.current?.files?.[0];
    if (!file) {
      setUploadError("Please upload a video.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title || "");
    formData.append("description", description || "");
    formData.append("file", file);
    try {
      const { data } = await axios.post<AuthResponse>(
        "/api/v1/aws/upload",
        formData,
        {
          ...configWithJWT,
          headers: {
            ...configWithJWT.headers,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (data.success) {
        setTitle("");
        setDescription("");
        setVideoSrc(null);
        // update the download count of user by 1
        if (loggedInUser?.token) {
          dispatch(increaseUploadCount());
        }
        dispatch(setVideos(data.video));
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    dispatch(fetchVideoForUser({ configWithJwt: configWithJWT }));
  }, []);

  return (
    <Layout>
      <section className="p-2 mt-7 flex flex-col items-center md:w-1/2">
        <form className="container flex flex-col gap-2" onSubmit={handleSubmit}>
          <div className="flex items-center justify-center">
            <input
              type="file"
              hidden
              ref={fileRef}
              accept="video/*"
              onChange={handleFileChange}
            />
            <FaUpload
              className="text-8xl cursor-pointer hover:scale-110 duration-300"
              onClick={handleUploadClick}
            />
          </div>
          {fileError && <p className="text-red-500 mt-2">{fileError}</p>}
          {videoSrc && (
            <div className="mt-4 flex flex-col items-center">
              <video
                src={videoSrc}
                controls
                className="w-32 h-32 object-cover"
              />
            </div>
          )}
          <label htmlFor="title">Title (Optional)</label>
          <input
            name="title"
            type="text"
            placeholder="Enter title of your video"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 focus:outline-none border border-black focus:border-none focus:outline-[#3a10e5] bg-transparent"
          />
          <label htmlFor="description">Description (Optional)</label>
          <textarea
            rows={3}
            name="description"
            placeholder="Enter description of your video"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 focus:outline-none border border-black focus:border-none focus:outline-[#3a10e5] bg-transparent resize-none"
          />
          {uploadError && <p className="text-red-500 mt-2">{uploadError}</p>}
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="bg-bgFour rounded-md p-2 text-white text-lg mt-5 hover:bg-opacity-90 duration-300 capitalize w-fit"
            >
              Upload video
            </button>
          </div>
        </form>
      </section>

      <section className="p-2 mt-7 ">
        <h1 className="capitalize text-textOne text-center text-xl sm:text-3xl md:text-4xl lg:text-6xl mb-7">
          Uploaded Videos
        </h1>
        <div className="w-fit grid grid-cols-1 gap-2 sm:grid-cols-2 p-2 md:grid-cols-3 lg:grid-cols-4">
          {videos?.map((video, index) => (
            <VideoCard
              _id={video._id}
              key={index}
              title={video.title}
              description={video.description}
              path={video.path}
              uploadedBy={video.uploadedBy.email}
            />
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default Upload;
