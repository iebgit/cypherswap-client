import React, { useState } from 'react';
import { CardActions, CardContent, CardMedia, Typography, ButtonBase } from '@material-ui/core/';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import DeleteIcon from '@material-ui/icons/Delete';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import ThumbUpAltOutlined from '@material-ui/icons/ThumbUpAltOutlined';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import {
  Text,
  Card,
  Button, 
  Figure,
  FramePentagon,
  FrameCorners,
  FrameBox,} from '@arwes/core'

import { likePost, deletePost } from '../../../actions/posts';
import useStyles from './styles';

const Post = ({ post, setCurrentId }) => {
  const user = JSON.parse(localStorage.getItem('profile'));
  const [likes, setLikes] = useState(post?.likes);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const classes = useStyles();

  const userId = user?.result.googleId || user?.result?._id;
  const hasLikedPost = post.likes.find((like) => like === userId);

  const handleLike = async () => {
    dispatch(likePost(post._id));

    if (hasLikedPost) {
      setLikes(post.likes.filter((id) => id !== userId));
    } else {
      setLikes([...post.likes, userId]);
    }
  };

  const Likes = () => {
    if (likes.length > 0) {
      return likes.find((like) => like === userId)
        ? (
          <><ThumbUpAltIcon fontSize="small" />&nbsp;{likes.length > 2 ? `You and ${likes.length - 1} others` : `${likes.length} like${likes.length > 1 ? 's' : ''}` }</>
        ) : (
          <><ThumbUpAltOutlined fontSize="small" />&nbsp;{likes.length} {likes.length === 1 ? 'Like' : 'Likes'}</>
        );
    }

    return <><ThumbUpAltOutlined fontSize="small" />&nbsp;Like</>;
  };

  const openPost = (e) => {
    // dispatch(getPost(post._id, history));

    navigate(`/posts/${post._id}`);
  };

  return (
    <Card className={classes.card} raised elevation={6}>
      <ButtonBase
        component="span"
        name="test"
        className={classes.cardAction}
        onClick={openPost}
      >
        <CardMedia className={classes.media} image={post.selectedFile || 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'} title={post.title} />
        <div className={classes.overlay}>
          <Text as="a"><strong>{post.name}</strong></Text>
          <div>
          <Text as="p" variant="body2">{moment(post.createdAt).fromNow()}</Text>
          </div>
        </div>
        {(user?.result?.googleId === post?.creator || user?.result?._id === post?.creator) && (
        <div className={classes.overlay2} name="edit">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentId(post._id);
            }}
            FrameComponent={FramePentagon}
            palette='secondary'
          >
            <MoreHorizIcon fontSize="small" />
          </Button>
        </div>
        )}
        <div className={classes.details}>
          <Text variant="body2" color="textSecondary" component="h2">{post.tags.map((tag) => `#${tag} `)}</Text>
        </div>
        <Text as="h5" className={classes.title}>{post.title}</Text>
        <CardContent>
          <Text variant="body2" color="textSecondary" component="p">{post.message.split(' ').splice(0, 20).join(' ')}...</Text>
        </CardContent>
      </ButtonBase>
      <CardActions >
       
        {(user?.result?.googleId === post?.creator || user?.result?._id === post?.creator) ? (
           <>
                <Button FrameComponent={FrameBox}  size="small" palette={likes.length ? "success": "primary"} disabled={!user?.result} onClick={handleLike}>
           <Likes />
         </Button>
          <Button FrameComponent={FramePentagon} size="small" palette="error" onClick={() => dispatch(deletePost(post._id))}>
            <DeleteIcon fontSize="small" /> DELETE
          </Button>
           </>):
           (<>
                <Button FrameComponent={FramePentagon}  size="small" palette="success" disabled={!user?.result} onClick={handleLike}>
           <Likes />
         </Button>

           </>
      
        )}
      </CardActions>
    </Card>
  );
};

export default Post;