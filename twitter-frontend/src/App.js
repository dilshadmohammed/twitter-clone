import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from './HomePage'
import Login from './Login'
function App() {

  const [user,setUser] = useState({});
  useEffect(()=>{
    const storedUser =  localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  },[])


  return (
    // <BrowserRouter>
    //   <Routes>
    //       <Route index element={<HomePage />} />
    //       <Route path='/login' element={<Login/>}/>
    //   </Routes>
    // </BrowserRouter>
    <div>
      {(user?.username)?<HomePage {...user} />:<Login />}
    </div>
  );
}

export default App;
