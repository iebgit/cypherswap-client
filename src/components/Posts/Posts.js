import React from "react";
import { Grid, CircularProgress } from "@material-ui/core";
import { useSelector } from "react-redux";
import {
  LoadingBars,
  Button,
  FramePentagon,
  FrameCorners,
  FrameBox,
} from "@arwes/core";
import Post from "./Post/Post";
import useStyles from "./styles";

const Posts = ({ setCurrentId, web3 }) => {
  const { posts, isLoading } = useSelector((state) => state.posts);
  const classes = useStyles();

  if (!posts.length && !isLoading) return "No posts";

  return isLoading ? (
    <LoadingBars animator={true} size={1} speed={6} />
  ) : (
    <Grid
      className={classes.container}
      container
      alignItems="stretch"
      spacing={3}
    >
      {posts?.map((post) => (
        <Grid key={post._id} item xs={12} md={6} lg={4}>
          <Post post={post} setCurrentId={setCurrentId} web3={web3} />
        </Grid>
      ))}
    </Grid>
  );
};

export default Posts;
