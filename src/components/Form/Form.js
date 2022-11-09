import React, { useState, useEffect } from 'react';
import { TextField, Typography, Paper } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import FileBase from 'react-file-base64';
import { useNavigate } from 'react-router-dom';
import ChipInput from 'material-ui-chip-input';
import "./Form.css"
import {
  Text,
  Button, 
  FramePentagon,
  FrameCorners,
  FrameBox,} from '@arwes/core'

import { createPost, updatePost } from '../../actions/posts';
import useStyles from './styles';

const Form = ({ currentId, setCurrentId }) => {
  const [postData, setPostData] = useState({ title: '', message: '', tags: [], selectedFile: '' });
  const post = useSelector((state) => (currentId ? state.posts.posts.find((message) => message._id === currentId) : null));
  const dispatch = useDispatch();
  const classes = useStyles();
  const user = JSON.parse(localStorage.getItem('profile'));
  const navigate = useNavigate();

  const clear = () => {
    setCurrentId(0);
    setPostData({ title: '', message: '', tags: [], selectedFile: '' });
  };

  useEffect(() => {
    if (!post?.title) clear();
    if (post) setPostData(post);
  }, [post]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (currentId === 0) {
      dispatch(createPost({ ...postData, name: user?.result?.name }, navigate));
      clear();
    } else {
      dispatch(updatePost(currentId, { ...postData, name: user?.result?.name }));
      clear();
    }
  };

  if (!user?.result?.name) {
    return (
      <FrameBox palette="secondary" animator={true} >
        <Text as="a">
          Please sign in to create and like posts.
        </Text>
      </FrameBox>
    );
  }

  const handleAddChip = (tag) => {
    setPostData({ ...postData, tags: [...postData.tags, tag] });
  };

  const handleDeleteChip = (chipToDelete) => {
    setPostData({ ...postData, tags: postData.tags.filter((tag) => tag !== chipToDelete) });
  };

  return (
    <FrameCorners
            palette="pimary"
            animator={true}
            cornerLength={22}
            hover
            style={{minWidth: "280px"}}
          >
        <Text as="h5">{currentId ? `Editing "${post?.title}"` : 'Create Post'}</Text>
        <input placeholder="Title" fullWidth value={postData.title} onChange={(e) => setPostData({ ...postData, title: e.target.value })} />
        <textarea style={{ margin: '10px 0' }} name="message" rows='3' variant="outlined" placeholder="Message" fullWidth multiline minRows={4} value={postData.message} onChange={(e) => setPostData({ ...postData, message: e.target.value })} />
  
        <ChipInput
            name="tags"
            label="Tags"
            title="Add tags to you post"
            fullWidth
            value={postData.tags}
            onAdd={(chip) => handleAddChip(chip)}
            onDelete={(chip) => handleDeleteChip(chip)}
          />
          
   


    
          <div style={{ margin: '10px 0' }}>
          <small ><FileBase type="file" multiple={false} onDone={({ base64 }) => setPostData({ ...postData, selectedFile: base64 })} /></small>
          </div>
        <Button FrameComponent={FrameBox} palette="secondary" onClick={(e) => handleSubmit(e)}>Submit</Button>
        <Button FrameComponent={FramePentagon} palette="secondary" onClick={clear}>Clear</Button>
  
    </FrameCorners>
  );
};

export default Form;
