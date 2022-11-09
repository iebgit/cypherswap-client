import React, { useEffect } from 'react';
import { Paper, Typography, CircularProgress, Divider } from '@material-ui/core/';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Figure,
  LoadingBars,
  Text,
  Card,
  Button, 
  FrameHexagon,
  FrameCorners,
  FrameBox,} from '@arwes/core'
import { getPost, getPostsBySearch } from '../../actions/posts';
import CommentSection from './CommentSection';
import useStyles from './styles';

const Post = () => {
  const { post, posts, isLoading } = useSelector((state) => state.posts);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const classes = useStyles();
  const { id } = useParams();

  useEffect(() => {
    dispatch(getPost(id));
  }, [id]);
  useEffect(() => {
    setInterval(() => {
     
    }, 5000);
  }, []);

  useEffect(() => {
    if (post) {
      dispatch(getPostsBySearch({ search: 'none', tags: post?.tags.join(',') }));
    }
  }, [post]);

  if (!post) return null;

  const openPost = (_id) => navigate(`/posts/${_id}`);

  if (isLoading) {
    return (
 
        <LoadingBars animator={true} size={1} speed={6}/>
  
    );
  }

  const recommendedPosts = posts.filter(({ _id }) => _id !== post._id);

  return (
    <>
    <FrameCorners
   
    animator={true}
    cornerLength={22}

    style={{ padding: '20px', borderRadius: '15px', FontFamily: "serif", backgroundColor: "transparent"}} elevation={6}
  >
 <Text style={{marginTop: "20px"}} as="h1">{post.title}</Text>
       
      <div className={classes.card}>
        <div style={{minWidth: "50%"}} className={classes.section}>
         
          <Text gutterBottom variant="" color="textSecondary" component="h2">{post.tags.map((tag) => (
            <Link to={`/tags/${tag}`}>
              {` #${tag} `}
            </Link>
          ))}
          </Text>
          <h5></h5>
          <Text >{post.message}</Text>
          <div style={{marginTop: "10px"}}>
          <Text as="h6">
            
            <Link to={`/creators/${post.name}`}>
              {` ${post.name}`}
            </Link>
          </Text>
          </div>
          
          <div style={{color: "white"}}>
          <Text>{moment(post.createdAt).fromNow()}</Text>

          </div>
          <br/>
       
       
        </div>
     
        <div className={classes.imageSection}>
          <Figure className={classes.media} src={post.selectedFile || 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'} alt={post.title} />
        </div>
     
    
    
      </div>
      <div style={{margin: "6px"}} >
   
        <CommentSection post={post} />
        </div>
      {!!recommendedPosts.length && (
      <>
              <Text as="h4">You might also like:</Text>
          <hr/>
     
          <div className={classes.recommendedPosts}>
            {recommendedPosts.map(({ title, name, message, likes, selectedFile, _id }) => (
                  <div style={{ margin: '20px', alignContent: 'right'}}  key={`posts-${_id}`}>

                    <Card >
                      <div style={{display: "flex", justifyContent: "space-between"}}>
                      <div style={{maxWidth: "50%"}} className={classes.section}>
                  <div>
                  <Text as="h5">
                <div style={{cursor: 'pointer'}} onClick={() => openPost(_id)}  gutterBottom variant="h6" >{title}</div>
                </Text>
                  </div>
               
                 <Text><Link to={`/creators/${name}`}>
             {` ${name}`}
            </Link></Text> 
                <div style={{ cursor: 'pointer'}} onClick={() => openPost(_id)}>
                <Typography gutterBottom><Text>{message}</Text></Typography>
                <Text style={{color: "white"}} gutterBottom variant="subtitle1">Likes: {likes.length}</Text>
                
                  </div>      </div>
                  <div onClick={() => openPost(_id)}  style={{maxWidth: "40%", cursor: "pointer"}} className={classes.imageSection}>
              <Figure className={classes.media}  src={selectedFile} alt=""/>
              </div>

                      </div>
                

                </Card>
                
               </div>
            
              
            ))}
          </div>
      </>
  
     
       
      )}
         </FrameCorners>
    </>
  );
};

export default Post;