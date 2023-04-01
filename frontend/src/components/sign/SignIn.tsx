import { useEffect, useState } from 'react';
import SignDTO from "../../models/signDTO"
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { signInAsync, isAuth } from '../../app/slices/authSlice';
import { useNavigate } from 'react-router-dom';

export function SignIn() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const auth = useAppSelector(isAuth);
  useEffect(() => {
    if (auth) {
      navigate("/notes");
    }
  }, [0]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  function validateInput(): boolean {
    if (email.length < 6) {
      setErrorMessage('Email must contain at least 6 characters');
      return false;
    }
    if (email.includes('@') === false) {
      setErrorMessage('Email must contain @ character');
      return false;
    }
    if (password.length < 6) {
      setErrorMessage('Password must contain at least 6 characters');
      return false;
    }
    setErrorMessage('');
    return true;
  }
  async function signIn() {
    if (validateInput() == false) {
      return;
    }
    const model: SignDTO = { email: email, password: password };
    const isSuccess = await dispatch(signInAsync(model));
    if (isSuccess) {
      navigate('/notes');
    } else {
      setErrorMessage('Invalid login or password');
    }
  }
  return (
    <div className='container'>
      <h2>Sign in</h2>
      <hr />
      <div className='row'>
        <div className='col-4'>
          <div className='form-group my-2'>
            <label className='form-label'>Email</label>
            <input type='text' value={email} onChange={(e) => { setEmail(e.target.value); }} className='form-control'></input>
          </div>
          <div className='form-group my-2'>
            <label className='form-label'>Password</label>
            <input type='password' value={password} onChange={(e) => { setPassword(e.target.value); }} className='form-control'></input>
          </div>
          <button className='form-control my-3' onClick={async () => await signIn()} >Sign in</button>
          <div className="alert alert-danger" role="alert" hidden={errorMessage.length === 0} >
            {errorMessage}
          </div>
        </div>
      </div>
    </div>
  );
}
