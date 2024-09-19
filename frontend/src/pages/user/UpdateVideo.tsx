import React, { useEffect, useRef, useState } from "react";
import { useConfig } from "../../customHooks/useConfigHook";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchVideoForUser,
  selectEditVideo,
  updateVideo,
} from "../../redux/reducers/video/videoReducer";
import { AppDispatch } from "../../redux/store";
import Sidebar from "../../components/Sidebar";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const UpdateVideo: React.FC = () => {
  const editVideo = useSelector(selectEditVideo);
  const dispatch = useDispatch<AppDispatch>();
  const fileRef = useRef<HTMLInputElement>(null);
  const thumbnailRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState<string>(editVideo?.title || "");
  const [description, setDescription] = useState<string>(
    editVideo?.description || ""
  );
  const [isPrivate, setIsPrivate] = useState<string>(
    editVideo?.isPrivate !== undefined ? String(editVideo.isPrivate) : "false"
  );
  const [videoSrc, setVideoSrc] = useState<string | null>(
    editVideo?.path || null
  );
  const [thumbnailSrc, setThumbnailSrc] = useState<string | null>(
    editVideo?.thumbNail || null
  );

  const [loading, setLoading] = useState<boolean>(false);

  const [fileError, setFileError] = useState<string | null>(null);
  const [thumbnailError, setThumbnailError] = useState<string | null>(null);
  const { configWithJWT } = useConfig();

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

  const handleThumbnailChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        setThumbnailError(null);
        const thumbnailUrl = URL.createObjectURL(file);
        setThumbnailSrc(thumbnailUrl);
      } else {
        setThumbnailError("Please select a valid image file.");
        setThumbnailSrc(null);
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const file = fileRef.current?.files?.[0];
    const thumbnail = thumbnailRef.current?.files?.[0];

    const { configWithJWT } = useConfig();
    const formData = new FormData();

    if (file) {
      formData.append("video", file);
    }
    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }

    try {
      if (editVideo?._id) {
        dispatch(
          updateVideo({
            videoId: editVideo._id,
            updateData: {
              title: title || editVideo.title,
              description: description || editVideo.description,
              _id: editVideo._id,
              uploadedBy: { email: editVideo.uploadedBy.email },
              isPrivate: isPrivate || editVideo.isPrivate,
              path: file || editVideo.path,
              thumbNail: thumbnail || editVideo.thumbNail,
            },
            configWithJwt: configWithJWT,
          })
        );
      }
      setVideoSrc(null);
      setThumbnailSrc(null);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePrivacyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setIsPrivate(event.target.value);
  };

  useEffect(() => {
    dispatch(fetchVideoForUser({ configWithJwt: configWithJWT }));
  }, []);

  return (
    <div className="flex w-full">
      <Sidebar />
      <main className="flex-1 p-4 mt-7 lg:ml-64">
        <section className="flex flex-col items-center">
          <form
            className="container flex flex-col gap-4 p-6 bg-white shadow-lg rounded-lg"
            onSubmit={handleSubmit}
          >
            {/* Video Upload Section */}
            <label htmlFor="video" className="text-textOne font-semibold">
              Video (Optional - Leave empty to keep the current video)
            </label>
            <input
              type="file"
              ref={fileRef}
              accept="video/*"
              onChange={handleFileChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bgFive"
            />
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

            {/* Thumbnail Upload Section */}
            <label htmlFor="thumbnail" className="text-textOne font-semibold">
              Thumbnail (Optional)
            </label>
            <input
              type="file"
              ref={thumbnailRef}
              accept="image/*"
              onChange={handleThumbnailChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bgFive"
            />
            {thumbnailError && (
              <p className="text-red-500 mt-2">{thumbnailError}</p>
            )}
            {thumbnailSrc && (
              <div className="mt-4 flex flex-col items-center">
                <img
                  src={thumbnailSrc}
                  alt="Thumbnail Preview"
                  className="w-32 h-32 object-cover rounded-md shadow-md"
                />
              </div>
            )}

            {/* Other form fields remain the same */}
            <label htmlFor="title" className="text-textOne font-semibold">
              Title (Optional)
            </label>
            <input
              name="title"
              type="text"
              placeholder="Enter title of your video"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bgFive"
            />
            <label htmlFor="description" className="text-textOne font-semibold">
              Description (Optional)
            </label>
            <ReactQuill
              theme="snow"
              value={description}
              onChange={setDescription}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bgFive"
            />
            <label htmlFor="privacy" className="text-textOne font-semibold">
              Privacy
            </label>
            <select
              name="privacy"
              value={isPrivate}
              onChange={handlePrivacyChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bgFive"
            >
              <option value="false">Public</option>
              <option value="true">Private</option>
            </select>
            <div className="flex items-center justify-center">
              <button
                type="submit"
                className="bg-bgFour rounded-md p-2 text-white text-lg mt-5 hover:bg-opacity-90 duration-300 capitalize w-full md:w-fit flex items-center justify-center disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin mr-2 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8h8a8 8 0 11-16 0z"
                      ></path>
                    </svg>
                    Updating...
                  </>
                ) : (
                  "Update Video"
                )}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
};

export default UpdateVideo;
