import React, { useRef, useState } from "react";
import Layout from "../../components/Layout";
import { FaUpload } from "react-icons/fa";
import axios from "axios";
import { useConfig } from "../../customHooks/useConfigHook";
import { toast } from "sonner";
interface AuthResponse {
  success: boolean;
  message: string;
}
const Upload: React.FC = () => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [fileError, setFileError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { configWithJWT } = useConfig();

  // Function to trigger the file input click
  const handleUploadClick = () => {
    fileRef.current?.click();
  };

  // Function to handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check if the selected file is a video
      if (file.type.startsWith("video/")) {
        setFileError(null);
        // Create a URL for the selected video
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

    if (!videoSrc) {
      setUploadError("Please upload a video.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title || "");
    formData.append("description", description || "");
    const file = fileRef.current?.files?.[0];
    if (file) {
      formData.append("video", file);
    } else {
      setUploadError("No video file selected.");
      return;
    }
    try {
      const { data } = await axios.post<AuthResponse>(
        "/api/v1/aws/upload",
        { formData },
        configWithJWT
      );
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      console.log(error);

      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
    }
  };

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
    </Layout>
  );
};

export default Upload;
