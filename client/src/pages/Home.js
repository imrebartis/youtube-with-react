import React from "react";
import Wrapper from "../styles/Home";
import VideoGrid from "../styles/VideoGrid";
import { useQuery } from "react-query";
import { client } from "../utils/api-client";
import HomeSkeleton from "../skeletons/HomeSkeleton";
import ErrorMessage from "../components/ErrorMessage";

function Home() {
  const {
    data: videos,
    isLoading,
    isError,
    error,
  } = useQuery("Home", () =>
    client.get("/videos").then((res) => res.data.videos)
  );

  console.log(videos);

  if (isLoading) return <HomeSkeleton />;
  if (isError) return <ErrorMessage error={error} />;
  return (
    <Wrapper>
      <VideoGrid>Recommended videos</VideoGrid>
    </Wrapper>
  );
}

export default Home;
