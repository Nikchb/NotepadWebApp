import { SignUp } from './components/sign/SignUp';
import { SignIn } from './components/sign/SignIn';
import { Header } from './components/header/Header';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div className='mb-5'>
        <Header />
      </div>
      <div className='container-lg'>
        <Routes>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
export default App;
