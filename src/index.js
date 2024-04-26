import React from 'react';
import ReactDOM from 'react-dom/client';
import './style.scss';
import './components/ImageEditor.scss';
import FreeDraw from './FreeDraw';
import AnotherWay from './AnotherWay';
import Konva from './Konva';

const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(<FreeDraw />);
root.render(<AnotherWay />);
// root.render(<Konva />);
