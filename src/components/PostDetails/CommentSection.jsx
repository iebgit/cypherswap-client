import React, {useState, useEffect, useRef } from 'react';
import { Typography, TextField } from '@material-ui/core/';
import { useDispatch } from 'react-redux';
import {Link} from 'react-router-dom';
import {
  Card,
  Text,
  Button, 
  FramePentagon,
  FrameCorners,
  FrameBox,} from '@arwes/core'
import { commentPost, getPost, getCommentsById } from '../../actions/posts';
import useStyles from './styles';
import { alphabetColors } from '../../constants/theme.constants';
import Icons from '../../constants/Icons';
const CommentSection = ({ post }) => {
  const user = JSON.parse(localStorage.getItem('profile'));
  const [comment, setComment] = useState('');
  const dispatch = useDispatch();
  const [comments, setComments] = useState(post?.comments);
  const classes = useStyles();
  const commentsRef = useRef();
  const handleComment = async () => {
  const newComments = await dispatch(commentPost(`${user?.result?.name}: ${comment}`, post._id));
    setComment('');
    setComments(newComments);
    scrollToBottom()
    // commentsRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom()
    const interId = setInterval(async () => {
     console.log("interval")
      setComments(await dispatch(getCommentsById([post._id])))
    }, 10000);
    return () => clearInterval(interId)
  }, []);



function scrollToBottom() {
  const messages = document.getElementById('messages');
  messages.scrollTop = messages.scrollHeight;
}

  return (
    <div>
       <Text as="h3">Live Chat</Text>
      <hr/>
      <div className={classes.commentsOuterContainer}>

        <div id="messages" style={{margin: "20px", padding: "10px", background: "#001313", opacity: "0.7", minWidth: "60%"}} className={classes.commentsInnerContainer}>
            {comments?.slice(comments.length > 20 ? comments.length - 20: 0).map((c, i) => (
          <div style={{display: "flex", margin: "10px"}} key={i} gutterBottom variant="subtitle1">
            <div style={{display: "flex", marginRight: "4px"}}>
              <div style={{marginRight: "4px"}}>
                <Icons color={`${!!c.split(': ')[0][0] ? c.split(': ')[0][0]: "a"}`} icon={`${!!c.split(': ')[0][1] ? c.split(': ')[0][1]: "a"}`}/>
              </div>
              <Link to={`/creators/${c.split(': ')[0]}`}><strong style={{color: alphabetColors[`${c.split(': ')[0][0]}`.toLowerCase()], }}>{c.split(': ')[0]}:</strong></Link>

            </div>
            <span style={{color: "white"}}>{c.split(':')[1]}</span>
            <p/>
          </div>
          

          ))}
          <div ref={commentsRef} />
        </div>
            <div style={{ margin: "32px", marginTop: "5%" }}>
              <textarea placeholder='Comment' fullWidth minrows={5} variant="outlined" label="Comment" multiline value={comment} onChange={(e) => setComment(e.target.value)} />
              <br />
              <Button FrameComponent={FramePentagon} palette="secondary" style={{ marginTop: '10px' }} fullWidth disabled={!comment.length} color="primary" variant="contained" onClick={handleComment}>
                Comment
              </Button>
            </div>
          </div>
    </div>
  );
};

export default CommentSection;