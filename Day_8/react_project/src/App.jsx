import React from 'react';
import MovieProvider from "./Components/MovieProvider";
import MovieList from './Components/MovieList';

const App = () => {
  return (
    <MovieProvider>
      <MovieList />
    </MovieProvider>
  );
}

export default App;
