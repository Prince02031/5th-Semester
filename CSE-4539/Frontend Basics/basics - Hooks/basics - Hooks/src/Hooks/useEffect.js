import { useState, useEffect } from 'react';

function DataFetcher() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('http://www.omdbapi.com/?i=tt3896198&apikey=22e614d2')
      .then(response => response.json())
      .then(result => setData(result));
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h2>{data.Title}</h2>
      <p>Year: {data.Year}</p>
      <p>Director: {data.Director}</p>
    </div>
  );
}

export default DataFetcher;
