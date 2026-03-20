import  { useRef, useState } from 'react';

function RefPersistenceDemo() {
  const [dummy, setDummy] = useState(0); // Just to trigger re-renders
  const countRef = useRef(0);
  const renderCount = useRef(0);
  
  // Track re-renders
  renderCount.current += 1;
  
  const incrementRef = () => {
    countRef.current += 1; //  Updates persist but won't trigger re-render
    console.log(`countRef after increment: ${countRef.current}`);
  };
  
  const forceReRender = () => {
    setDummy(prev => prev + 1); // Triggers re-render
  };
  


  return (
    <div>
      <h3>useRef Persistence Demo</h3>
      <p>countRef.current: {countRef.current}</p>
      <p>Render count: {renderCount.current}</p>
      <p>Dummy state (triggers re-render): {dummy}</p>
      
      <button onClick={incrementRef}>Increment Ref (no re-render)</button>
      <button onClick={forceReRender}>Force Re-render</button>
    </div>
  );
} 
export default RefPersistenceDemo;