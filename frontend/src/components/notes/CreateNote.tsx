import { useState } from 'react';
import CreateNoteDTO from '../../models/createNoteDTO';
import { useAppDispatch } from '../../app/hooks';
import { createNoteAsync } from '../../app/slices/notesSlice';
import { useNavigate } from 'react-router-dom';

export function SignIn() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  function validateInput(): boolean {
    if (!name) {
      setErrorMessage('Note must have a name');
      return false;
    }
    setErrorMessage('');
    return true;
  }
  async function createNote() {
    if (validateInput() == false) {
      return;
    }
    const model: CreateNoteDTO = { name: name, text: text };
    const isSuccess = await dispatch(createNoteAsync(model));
    if (isSuccess) {

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
            <label className='form-label'>Name</label>
            <input type='text' value={name} onChange={(e) => { setName(e.target.value); }} className='form-control'></input>
          </div>
          <div className='form-group my-2'>
            <label className='form-label'>Text</label>
            <textarea value={text} onChange={(e) => { setText(e.target.value); }} className='form-control'></textarea>
          </div>
          <button className='form-control my-3' onClick={async () => await createNote()} >Create</button>
          <div className="alert alert-danger" role="alert" hidden={errorMessage.length === 0} >
            {errorMessage}
          </div>
        </div>
      </div>
    </div>
  );
}
