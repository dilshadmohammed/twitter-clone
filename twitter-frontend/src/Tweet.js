import React, { useEffect } from 'react'
import { useState } from 'react'
import './Tweet.css'


function Tweet({id, name, username, message, likes, liked, ownTweet, onDelete, user }) {
  const [like, setLike] = useState(liked);
  const [likeCount, setLikeCount] = useState(likes);
  const [tweet,setTweet] = useState(message);
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
  }

  const submitTweet = () => {
    setTweet(tweetText)
    setEditMode(false)
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
          <img src="/images/delete.png" alt="delete" className='delete-icon' onClick={()=>{onDelete(id)}}/>
          <img src="/images/edit_icon.png" onClick={()=>{setEditMode(true)}} alt="edit" className="edit-icon" />
        </div>
        }
        
      </div>
    </div>
  )
}
export default Tweet
