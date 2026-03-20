import React, { useContext } from 'react';

const ThemeContext = React.createContext('dark');

function ThemeButton() {
  const theme = useContext(ThemeContext);

  return (
    <button
      style={{
        background: theme === 'dark' ? 'black' : 'white',
        color: theme === 'dark' ? 'white' : 'black'
      }}
    >
      Toggle Theme
    </button>
  );
}

export default ThemeButton;
