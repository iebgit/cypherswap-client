import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Typography, CircularProgress, Grid, Divider } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import {
  Text,
  LoadingBars,
  Card,
  Button,
  FramePentagon,
  FrameCorners,
  FrameBox,
} from "@arwes/core";
import Post from "../Posts/Post/Post";
import { getPostsByCreator, getPostsBySearch } from "../../actions/posts";
import Form from "../Form/Form";
import useStyles from "./styles";

const CreatorOrTag = ({ web3 }) => {
  const classes = useStyles();
  const { name } = useParams();
  const dispatch = useDispatch();
  const { posts, isLoading } = useSelector((state) => state.posts);
  const [currentId, setCurrentId] = useState(0);

  const location = useLocation();

  useEffect(() => {
    dispatch(getPostsByCreator(name));
  }, [dispatch, name]);

  if (!posts.length && !isLoading) return "No posts";

  return (
    <div>
      <center>
        <Text as="h1">{name}</Text>
      </center>
      <div>
        {isLoading ? (
          <LoadingBars animator={true} size={1} speed={6} />
        ) : (
          <Grid
            container
            justifyContent="space-between"
            alignItems="stretch"
            className={classes.gridContainer}
            spacing={3}
          >
            <Grid item xs={12} sm={6} md={7} lg={8}>
              <Grid
                container
                justifyContent="start"
                alignItems="stretch"
                spacing={2}
              >
                {posts?.map((post) => (
                  <Grid key={post._id} item xs={12} sm={12} md={6} lg={4}>
                    <Post post={post} setCurrentId={setCurrentId} web3={web3} />
                  </Grid>
                ))}
              </Grid>
            </Grid>
            <Grid item xs={12} sm={5} md={4} lg={3}>
              <center>
                <Form
                  currentId={currentId}
                  setCurrentId={setCurrentId}
                  web3={web3}
                />
              </center>
            </Grid>
          </Grid>
        )}
      </div>
    </div>
  );
};

export default CreatorOrTag;
