import { SignUp } from './components/sign/SignUp';
import { SignIn } from './components/sign/SignIn';
import { Header } from './components/header/Header';
import { Notes } from './components/notes/Notes';
import { CreateNote } from './components/notes/CreateNote';
import { EditNote } from './components/notes/EditNote';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector } from 'react-redux';
import { isAuth } from './app/slices/authSlice';

function App() {
  const auth = useSelector(isAuth);
  return (
    <BrowserRouter>
      <div className='mb-5'>
        <Header />
      </div>
      <div className='container-lg'>
        {auth === true ? (
          <Routes>
            <Route path="/" element={<SignIn />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/notes/create" element={<CreateNote />} />
            <Route path="/notes/:id" element={<EditNote />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/" element={<SignIn />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
          </Routes>
        )}
      </div>
    </BrowserRouter>
  );
}
export default App;
