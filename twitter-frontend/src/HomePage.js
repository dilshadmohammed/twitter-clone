import React, { useEffect, useState } from 'react'
import './HomePage.css'
import Tweet from './Tweet'
import NewTweet from './NewTweet'
import axios from './axios';




function HomePage({...user}) {

  const initialTweets = [
    { "id": 1,
      "name": "John Doe",
      "username": "johndoe",
      "message": "Having a great day! Enjoying the sunshine and spending time outdoors. Life is good!",
      "likes": 20,
      "liked":true
    },
    { "id": 2,
      "name": "Jane Smith",
      "username": "janesmith",
      "message": "Just finished reading a fascinating book. The plot twists kept me on the edge of my seat!",
      "likes": 15,
      "liked":false
    },
    { "id": 3,
      "name": "Bob Johnson",
      "username": "dilshadvln",
      "message": "Coding all night long! Building something awesome and pushing my limits.",
      "likes": 30,
      "liked":true
    },
    { "id": 4,
      "name": "Alice Brown",
      "username": "alicebrown",
      "message": "Exploring new places and trying out different cuisines. Foodie adventures!",
      "likes": 25,
      "liked":false
    }
  ];
  
  const [tweets,setTweets] = useState(initialTweets)
  axios.get(`/get-tweets/${user.user_id}`)
  .then(response => {
    setTweets(response.data)
  })
  .catch(error => {
    console.error('Error fetching tweets:', error);
  });
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
  };

  const handleDeleteTweet = (tweetId) => {
    setTweets((prevTweets) => prevTweets.filter((tweet) => tweet.id !== tweetId));
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
          {tweets.map((tweet) => (
              <Tweet key={tweet.id} {...tweet} ownTweet={tweet.username === user.username} onDelete={() => handleDeleteTweet(tweet.id)}/>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default HomePage
