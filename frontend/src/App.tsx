import React from 'react';
import { SignUp } from './components/signUp/SignUp';
import { SignIn } from './components/signIn/SignIn';
import { Header } from './components/header/Header';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div>
      <BrowserRouter>
        <header className='mb-5'>
          <Header />
        </header>
        <body className='container-lg'>
          <Routes>
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
          </Routes>
        </body>
      </BrowserRouter>
    </div>
  );
}
export default App;
