import React, { useState } from 'react'
import './HomePage.css'
import Tweet from './Tweet'
import NewTweet from './NewTweet'

function HomePage() {
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
      "username": "bobjohnson",
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

  const addNewTweet = (text) => {
    const newTweet = {
      id: tweets.length + 1,
      name:'Dilshad',
      username:'dilshadvln',
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
        <h2>twitter</h2>
        <img src="/images/twitter_logo.png" alt="" />
      </header>
      <main>
        <div className="tweet-section">
          <NewTweet addNewTweet={addNewTweet}/>
          <div className="feed">
          {tweets.map((tweet) => (
              <Tweet key={tweet.id} {...tweet}  onDelete={() => handleDeleteTweet(tweet.id)}/>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default HomePage
