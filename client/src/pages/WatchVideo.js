// @ts-nocheck
import React from "react";
import { useParams } from "react-router-dom";
import { DislikeIcon, LikeIcon } from "../components/Icons";
import NoResults from "../components/NoResults";
import VideoPlayer from "../components/VideoPlayer";
import Button from "../styles/Button";
import Skeleton from "../skeletons/WatchVideoSkeleton";
import Wrapper from "../styles/WatchVideo";
import { useQuery } from "react-query";
import { client, likeVideo, dislikeVideo } from "../utils/api-client";
import AddComment from "../components/AddComment";
import { formatCreatedAt } from "../utils/date";
import VideoCard from "../components/VideoCard";

function WatchVideo() {
  const { videoId } = useParams();
  const { data: video, isLoading: isLoadingVideo } = useQuery(
    ["WatchVideo", videoId],
    () => client.get(`/videos/${videoId}`).then((res) => res.data.video)
  );

  const { data: next, isLoading: isLoadingNext } = useQuery(
    ["WatchVideo", "Up next"],
    () => client.get(`/videos`).then((res) => res.data.videos)
  );

  console.log(video);
  console.log(next);

  if (isLoadingVideo || isLoadingNext) {
    return <Skeleton />;
  }

  if (!isLoadingVideo && !video) {
    return (
      <NoResults
        title="Page not found"
        text="The page you are looking for is not found or it may have been removed."
      />
    );
  }

  function handleLikeVideo(videoId) {
    likeVideo(videoId);
  }

  function handleDislikeVideo(videoId) {
    dislikeVideo(videoId);
  }

  return (
    <Wrapper
      filledLike={video && video.isLiked}
      filledDislike={video && video.isDisliked}
    >
      <div className="video-container">
        <div className="video">
          {!isLoadingVideo && <VideoPlayer />} video={video}
        </div>

        <div className="video-info">
          <h3>{video.title}</h3>

          <div className="video-info-stats">
            <p>
              <span>{video.views} views</span> <span>•</span>{" "}
              <span>Premiered {formatCreatedAt(video.createdAt)}</span>
            </p>

            <div className="likes-dislikes flex-row">
              <p className="flex-row like">
                <LikeIcon onClick={() => handleLikeVideo(video.id)} />{" "}
                <span>{video.likesCount}</span>
              </p>
              <p className="flex-row dislike" style={{ marginLeft: "1rem" }}>
                <DislikeIcon onClick={() => handleDislikeVideo(video.id)} />{" "}
                <span>{video.DislikesCount}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="channel-info-description">
          <div className="channel-info-flex">
            <div className="channel-info flex-row">
              <img
                className="avatar md"
                src={video.user.avatar}
                alt={`${video.user.username} channel avatar`}
              />
              <div className="channel-info-meta">
                <h4>{video.user.username}</h4>
                <span className="secondary small">
                  {video.subscribersCount} subscribers
                </span>
              </div>
            </div>

            {!video.isVideoMine && !video.isSubscribed && (
              <Button>Subscribe</Button>
            )}
            {!video.isVideoMine && video.isSubscribed && (
              <Button>Subscribed</Button>
            )}
          </div>

          <p>{video.description}</p>
        </div>

        <AddComment video={video} />
      </div>

      <div className="related-videos">
        <h3 className="up-next">Up Next</h3>
        {next
          .filter((v) => v.id !== video.id)
          .slice(0, 10)
          .map((video) => (
            <VideoCard key={video.id} hideAvatar video={video} />
          ))}
      </div>
    </Wrapper>
  );
}

export default WatchVideo;
