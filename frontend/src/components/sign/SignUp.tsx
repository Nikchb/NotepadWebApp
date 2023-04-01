import { useState } from 'react';
import { useAppDispatch } from '../../app/hooks';
import { useNavigate } from 'react-router-dom';
import SignDTO from '../../models/signDTO';
import { signUpAsync } from '../../app/slices/authSlice';

export function SignUp() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
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
    if (password !== passwordRepeat) {
      setErrorMessage('Passwords are not the same');
      return false;
    }
    setErrorMessage('');
    return true;
  }
  async function signUp() {
    if (validateInput() == false) {
      return;
    }
    const model: SignDTO = { email: email, password: password };
    const isSuccess = await dispatch(signUpAsync(model));
    if (isSuccess) {
      navigate('/notes');
    } else {
      setErrorMessage('Invalid login or password');
    }
  }
  return (
    <div className='container'>
      <h2>Sign up</h2>
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
          <div className='form-group my-2'>
            <label className='form-label'>Password repeat</label>
            <input type='password' value={passwordRepeat} onChange={(e) => { setPasswordRepeat(e.target.value); }} className='form-control'></input>
          </div>
          <button className='form-control my-3' onClick={async () => await signUp()}>Sign up</button>
          <div className="alert alert-danger" role="alert" hidden={errorMessage.length === 0} >
            {errorMessage}
          </div>
        </div>
      </div>
    </div>
  );
}
