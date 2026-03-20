import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import TextInput from './Hooks/useRef';
import RefPersistenceDemo from './Hooks/useRef2';
import DataFetcher from './Hooks/useEffect';
import Counter from './Hooks/useState';
import UseCallbackExample from './Hooks/useCallback';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<Counter/>
);

