import React, { useEffect, useState } from 'react'
import './HomePage.css'
import Tweet from './Tweet'
import NewTweet from './NewTweet'
import axios from './axios';




function HomePage({...user}) {

  
  const [tweets,setTweets] = useState([])
  useEffect(()=>{
    axios.get(`/${user.user_id}`)
    .then(response => {
      setTweets(response.data)
    })
    .catch(error => {
      console.error('Error fetching tweets:', error);
    });
  },[])
 
  const Logout = () => {
  
    localStorage.removeItem('user');
    window.location.reload();
  };
  const addNewTweet = (text) => {
    const newTweet = {
      id: tweets.length + 1,
      name:user.name,
      username:user.username,
      message: text,
      likes:0

    };

    setTweets((prevTweets) => [...prevTweets, newTweet]);
    axios.post(`/add-tweet`, {
      user_id:user.user_id,
      content:text
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(() => {
        console.log("Tweet posted");
      })
      .catch((error) => {
        console.error("Something went wrong", error);
      });
  };

  const handleDeleteTweet = (tweetId) => {
    setTweets((prevTweets) => prevTweets.filter((tweet) => tweet.id !== tweetId));
    axios.post(`/delete-tweet/${user.user_id}/${tweetId}`,null, {
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
  };

  return (
    <div className="main-container">
      <header>
        <div className="left-container">
          <h2>twitter</h2>
          <img src="/images/twitter_logo.png" alt="" />
        </div>
        <div className="right-container">
          <span>@{user.username}</span>
          <button onClick={Logout}>Logout</button>
        </div>
      </header>
      <main>
        <div className="tweet-section">
          <NewTweet addNewTweet={addNewTweet}/>
          <div className="feed">
          { tweets.map((tweet) => (
              <Tweet key={tweet.id} {...tweet} ownTweet={tweet.username === user.username} onDelete={() => handleDeleteTweet(tweet.tweet_id)} thisUser={user.user_id} />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default HomePage
