import React from 'react';
import { SignUp } from './components/signUp/SignUp';
import { Header } from './components/header/Header';

function App() {
  return (
    <div>
      <header className='mb-5'>
        <Header />
      </header>
      <body className='container-lg'>
        <SignUp />
      </body>
    </div>
  );
}

export default App;
