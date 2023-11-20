import React, { useEffect } from 'react'
import { useState } from 'react'
import './Tweet.css'
import axios from './axios';


function Tweet({id, name,tweet_id,user_id, username, content, like_count, user_liked, ownTweet, onDelete, thisUser}) {
  const [like, setLike] = useState(user_liked);
  const [likeCount, setLikeCount] = useState(like_count);
  const [tweet,setTweet] = useState(content);
  const [editMode,setEditMode] = useState(false);
  const [tweetText,setTweetText] = useState('');

  useEffect(()=>{
    // eslint-disable-next-line
    setTweet(tweet);
    setTweetText(tweet)
  },[])
  const handleLike = () => {
    like ? setLikeCount(likeCount - 1) : setLikeCount(likeCount + 1)
    setLike(!like)
    axios.post(`/like-unlike-tweet`, {
      user_id:thisUser,
      tweet_id:tweet_id
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
        console.log(response?.data?.message);
      })
      .catch((error) => {
        console.error("Something went wrong", error);
      });
  }

  const submitTweet = () => {
    setTweet(tweetText)
    setEditMode(false)
    axios.post(`/edit-tweet/${thisUser}/${tweet_id}`, {
      content:tweetText
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
        console.log(response?.data?.message);
      })
      .catch((error) => {
        console.error("Something went wrong", error);
      });
  }

  if(editMode)
  {
    return (
      <div className='new-tweet'>
        <textarea type="text" onChange={(e)=>{setTweetText(e.target.value)}} className='new-message' value={tweetText} />
        <button onClick={submitTweet}>Tweet</button>
      </div>
    )
  }
  return (
    <div className="message-box">
      <div className="user-details">
        <div>
          <img className="profile_pic" src="/images/avatar.png" alt="" />
        </div>
        <div className="name">
          <span>{name}</span>
          <small>@{username}</small>
        </div>
      </div>
      <div className="message">
        <p>{tweet}</p>
      </div>
      <div className="icons">
        <img src={like ? "/images/heart_liked.png" : "/images/heart_notliked.png"} onClick={handleLike} alt="likes" className="heart" />
        <span>{likeCount}</span>
        {ownTweet && 
        <div>
          <img src="/images/delete.png" alt="delete" className='delete-icon' onClick={()=>{onDelete()}}/>
          <img src="/images/edit_icon.png" onClick={()=>{setEditMode(true)}} alt="edit" className="edit-icon" />
        </div>
        }
        
      </div>
    </div>
  )
}
export default Tweet
