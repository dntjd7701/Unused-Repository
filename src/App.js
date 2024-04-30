import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ImageViewer from './ImageViewer';
import Three from './Three';

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
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
