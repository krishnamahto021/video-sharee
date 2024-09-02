import React, { useEffect, useRef, useState } from "react";
import Layout from "../../components/Layout";
import { FaUpload } from "react-icons/fa";
import backendApi from "../../api/axios";
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
import Sidebar from "../../components/Sidebar";

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
  const [isPrivate, setIsPrivate] = useState<string>("false");

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

  const handlePrivacyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setIsPrivate(event.target.value);
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
    formData.append("isPrivate", isPrivate);
    try {
      const { data } = await backendApi.post<AuthResponse>(
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
  }, [dispatch, configWithJWT]);

  return (
    <Layout>
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 mt-7  ">
          <section className="flex flex-col items-center ">
            <form
              className="container flex flex-col gap-4 p-6 bg-white shadow-lg rounded-lg"
              onSubmit={handleSubmit}
            >
              <div className="mb-4">
                <div className="flex items-center justify-center p-6 border-dotted border-2 border-gray-300 rounded-lg w-full">
                  <input
                    type="file"
                    hidden
                    ref={fileRef}
                    accept="video/*"
                    onChange={handleFileChange}
                  />
                  <FaUpload
                    className="text-9xl cursor-pointer hover:scale-110 duration-300"
                    onClick={handleUploadClick}
                  />
                </div>
              </div>

              {fileError && <p className="text-red-500 mt-2">{fileError}</p>}
              {videoSrc && (
                <div className="mt-4 flex flex-col items-center">
                  <video
                    src={videoSrc}
                    controls
                    className="w-32 h-32 object-cover rounded-md shadow-md"
                  />
                </div>
              )}
              <label htmlFor="title" className="text-textOne font-semibold">
                Title (Optional)
              </label>
              <input
                name="title"
                type="text"
                placeholder="Enter title of your video"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bgFive bg-bgOne"
              />
              <label
                htmlFor="description"
                className="text-textOne font-semibold"
              >
                Description (Optional)
              </label>
              <textarea
                rows={3}
                name="description"
                placeholder="Enter description of your video"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bgFive bg-bgOne resize-none"
              />
              <label htmlFor="privacy" className="text-textOne font-semibold">
                Privacy
              </label>
              <select
                name="privacy"
                value={isPrivate}
                onChange={handlePrivacyChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bgFive bg-bgOne"
              >
                <option value="false">Public</option>
                <option value="true">Private</option>
              </select>
              {uploadError && (
                <p className="text-red-500 mt-2">{uploadError}</p>
              )}
              <div className="flex items-center justify-center">
                <button
                  type="submit"
                  className="bg-bgFour rounded-md p-2 text-white text-lg mt-5 hover:bg-opacity-90 duration-300 capitalize w-full md:w-fit"
                >
                  Upload video
                </button>
              </div>
            </form>
          </section>

          <section className="p-4 mt-7">
            <h1 className="capitalize text-textOne text-center text-xl sm:text-3xl md:text-4xl lg:text-6xl mb-7">
              Uploaded Videos
            </h1>
            <div className=" grid grid-cols-1 gap-4 p-2 md:grid-cols-2  lg:grid-cols-3 items-center">
              {videos?.map((video, index) => (
                <VideoCard
                  _id={video._id}
                  key={index}
                  title={video.title}
                  description={video.description}
                  path={video.path}
                  uploadedBy={video.uploadedBy.email}
                  isPrivate={video.isPrivate}
                />
              ))}
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
};

export default Upload;
