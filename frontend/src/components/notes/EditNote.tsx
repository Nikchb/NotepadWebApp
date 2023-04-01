import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import NoteDTO from '../../models/noteDTO';
import { useAppDispatch } from '../../app/hooks';
import { updateNoteAsync, fetchNoteAsync } from '../../app/slices/notesSlice';
import { useNavigate } from 'react-router-dom';
import style from './EditNote.module.css';

type EditNoteParams = {
  id: string;
}

export function EditNote() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const params = useParams<EditNoteParams>();
  const noteId = Number(params.id);
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  let note: NoteDTO | undefined = undefined;
  useEffect(() => {
    dispatch(fetchNoteAsync(noteId)).then((value) => {
      note = value;
      if (note !== undefined) {
        console.log(note);
        setName(note.name);
        setText(note.text);
        setErrorMessage('');
      } else {
        setErrorMessage('Not not found');
      }
    });
  }, [noteId]);

  function validateInput(): boolean {
    if (!name) {
      setErrorMessage('Note must have a name');
      return false;
    }
    setErrorMessage('');
    return true;
  }
  async function editNote() {
    if (validateInput() == false) {
      return;
    }
    const model: NoteDTO = { id: noteId, name: name, text: text };
    const isSuccess = await dispatch(updateNoteAsync(model));
    if (isSuccess) {
      navigate('/notes');
    } else {
      setErrorMessage('Invalid login or password');
    }
  }
  return (
    <div className='container'>
      <h2>Create note</h2>
      <hr />
      <div className='form'>
        <div className='form-group my-2'>
          <label className='form-label'>Name</label>
          <input type='text' value={name} onChange={(e) => { setName(e.target.value); }} className='form-control'></input>
        </div>
        <div className='form-group my-2'>
          <label className='form-label'>Text</label>
          <textarea value={text} onChange={(e) => { setText(e.target.value); }} className='form-control' style={style}></textarea>
        </div>
        <button className='form-control my-3 btn btn-success' onClick={async () => await editNote()} >Save</button>
        <div className="alert alert-danger" role="alert" hidden={errorMessage.length === 0} >
          {errorMessage}
        </div>
      </div>
    </div>
  );
}
