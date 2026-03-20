import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import  Greeting  from './Conditional Rendering/GreetingMain';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<Greeting isLoggedIn={false} />
);

