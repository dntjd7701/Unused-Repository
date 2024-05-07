import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ImageViewer from './ImageViewer';
import Three from './Three';
import Background from './components/Background';

const App = () => {
  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route
            path='/'
            element={<ImageViewer />}></Route>
          <Route
            path='/three'
            element={<Three />}></Route>
          <Route
            path='/img'
            element={<Background />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
