import React from "react";
import Slider from "react-slick";
import { IVideo } from "../redux/reducers/video/videoReducer";
import VideoCard from "./VideoCard";

interface VideoSliderProps {
  videos: IVideo[] | null;
}

const VideoSlider: React.FC<VideoSliderProps> = ({ videos }) => {
  const sliderSettings = {
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <Slider {...sliderSettings}>
      {videos?.map((video) => (
        <VideoCard
          key={video._id}
          isPrivate={video.isPrivate}
          _id={video._id}
          title={video.title}
          description={video.description}
          path={video.path}
          uploadedBy={video.uploadedBy.email}
        />
      ))}
    </Slider>
  );
};

export default VideoSlider;
