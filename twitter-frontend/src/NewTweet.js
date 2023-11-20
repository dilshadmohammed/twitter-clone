import React from 'react'
import { useState } from 'react';
import './NewTweet.css'


function NewTweet({addNewTweet}) {

  const [tweetText, setTweetText] = useState('');

  const submitTweet = () => {
    if (tweetText.trim() !== '') {
      addNewTweet(tweetText);
      setTweetText('');
      document.getElementById('tweet-value').value = ''
    }
  };

  return (
    <div className='new-tweet'>
      <textarea type="text" onChange={(e)=>{setTweetText(e.target.value)}} className='new-message' id='tweet-value' placeholder='type something....' />
      <button onClick={submitTweet}>Tweet</button>
    </div>
  )
}

export default NewTweet
