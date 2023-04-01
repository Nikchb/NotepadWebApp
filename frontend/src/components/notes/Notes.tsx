import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchNotesAsync, notes, deleteNoteAsync, loaded } from '../../app/slices/notesSlice';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export function Notes() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const notesList = useAppSelector(notes);
  const notesListLoaded = useAppSelector(loaded);
  useEffect(() => {
    if (notesListLoaded === false) {
      dispatch(fetchNotesAsync());
    }
  }, [0]);
  return (
    <div className='container'>
      <h2>Notes</h2>
      <hr />
      <table className='table'>
        <tbody>
          <tr>
            <td className='w-50'>
              Name
            </td>
            <td className='w-25'>
              <button className='btn btn-success form-control' onClick={() => navigate('/notes/create')}>Create</button>
            </td>
            <td className='w-25'>

            </td>
          </tr>
          {notesList.map(note =>
            <tr key={note.id}>
              <td className='w-50'>{note.name}</td>
              <td className='w-25'>
                <button className='btn btn-info form-control' onClick={() => navigate('/notes/' + note.id)}>Edit</button>
              </td>
              <td className='w-25'>
                <button className='btn btn-danger form-control' onClick={async () => await dispatch(deleteNoteAsync(note.id))}>Delete</button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
