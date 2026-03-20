import React, { useRef } from 'react';
//Accessing DOM elements

function TextInput() {
  const inputRef = useRef(null);

  const focusInput = () => {
    inputRef.current.focus(); // direct DOM access
  };

  return (
    <div>
      <input ref={inputRef} type="text" placeholder="Type something" />
      <button onClick={focusInput}>Focus Input</button>
    </div>
  );
}

export default TextInput;