import React, { useState, useEffect } from "react";
import {
  Container,
  Grow,
  Grid,
  AppBar,
  TextField,
  Paper,
} from "@material-ui/core";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import ChipInput from "material-ui-chip-input";
import {
  Text,
  Button,
  FramePentagon,
  FrameCorners,
  FrameBox,
} from "@arwes/core";
import { getPostsBySearch } from "../../actions/posts";
import Posts from "../Posts/Posts";
import Form from "../Form/Form";
import Pagination from "../Pagination";
import useStyles from "./styles";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}
const Home = ({ web3 }) => {
  const classes = useStyles();
  const query = useQuery();
  const page = query.get("page") || 1;
  const searchQuery = query.get("searchQuery");
  const [title, setTitle] = useState("Home");

  const [currentId, setCurrentId] = useState(0);
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");
  const [tags, setTags] = useState([]);
  const navigate = useNavigate();
  const clearPosts = () => {
    setSearch("");
    setTags([]);
    setTitle("Home");
    navigate("/home");
  };

  const searchPost = () => {
    if (search.trim() || tags.length) {
      dispatch(getPostsBySearch({ search, tags: tags.join(",") }));
      navigate(
        `/posts/search?searchQuery=${search || "none"}&tags=${tags.join(",")}`
      );

      setTitle(
        !!search && tags.length
          ? `Title: ${search} | Tags: ${
              tags.length > 1 ? tags.join(", ") : tags[0]
            }`
          : !!search
          ? `Title: ${search}`
          : tags.length > 1
          ? `Tags: ${tags.join(", ")}`
          : tags.length
          ? `Tags: ${tags[0]}`
          : "Home"
      );
    } else {
      setTitle("Home");
      navigate("/home");
    }
  };

  useEffect(() => {
    if (!search && !tags.length) {
      setTitle("Home");
      navigate("/home");
    }
  }, [search, tags]);

  const handleKeyPress = (e) => {
    if (e.keyCode === 13) {
      searchPost();
    }
  };

  const handleAddChip = (tag) => setTags([...tags, tag]);

  const handleDeleteChip = (chipToDelete) =>
    setTags(tags.filter((tag) => tag !== chipToDelete));

  return (
    <Grow in>
      <Container>
        <center>
          <Text as="h1">{title}</Text>
        </center>
        <Grid
          container
          justifyContent="space-between"
          alignItems="stretch"
          spacing={2}
          className={classes.gridContainer}
        >
          <Grid item xs={12} sm={7} md={8}>
            <Posts setCurrentId={setCurrentId} web3={web3} />
          </Grid>
          <Grid item xs={12} sm={5} md={4}>
            <center
              style={{
                width: "360px",
              }}
            >
              <Form
                currentId={currentId}
                setCurrentId={setCurrentId}
                web3={web3}
              />
              <p />
              <input
                placeholder="Search Posts"
                onKeyDown={handleKeyPress}
                name="search"
                variant="outlined"
                label="Search Memories"
                fullWidth
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <p />
              <Button
                FrameComponent={FrameBox}
                palette="secondary"
                onClick={clearPosts}
                className={classes.searchButton}
                variant="contained"
                color="primary"
              >
                clear
              </Button>
              <Button
                FrameComponent={FramePentagon}
                palette="secondary"
                onClick={searchPost}
                className={classes.searchButton}
                variant="contained"
                color="primary"
              >
                Search
              </Button>
            </center>

            {!searchQuery && !tags.length && <Pagination page={page} />}
          </Grid>
        </Grid>
      </Container>
    </Grow>
  );
};

export default Home;
