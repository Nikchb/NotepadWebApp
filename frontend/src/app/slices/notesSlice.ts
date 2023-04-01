import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../store';
import axios, { AxiosResponse } from "axios";
import ServiceResponse from "../../models/serviceResponse";
import NoteListItemDTO from '../../models/noteListItemDTO';
import NoteDTO from '../../models/noteDTO';
import CreateNoteDTO from '../../models/createNoteDTO';

export interface NotesState {
  loaded: boolean,
  notes: NoteListItemDTO[]
};

const notesState: NotesState = {
  loaded: false,
  notes: []
};

export const notesSlice = createSlice({
  name: 'notes',
  initialState: notesState,
  reducers: {
    setNotes: (state, action: PayloadAction<NoteListItemDTO[]>) => {
      state.notes = action.payload;
      state.loaded = true;
    },
    addNote: (state, action: PayloadAction<NoteListItemDTO>) => {
      state.notes.push(action.payload);
    },
    updateNote: (state, action: PayloadAction<NoteDTO>) => {
      const note = state.notes.find(v => v.id === action.payload.id);
      if (note !== undefined) {
        //note.name = action.payload.name;
      } else {
        state.notes.push({ id: action.payload.id, name: action.payload.name });
      }
    },
    deleteNote: (state, action: PayloadAction<number>) => {
      state.notes = state.notes.filter(note => note.id !== action.payload);
    },
    removeNotes: (state) => {
      state.notes = [];
      state.loaded = false;
    }
  },
});

export const { setNotes, addNote, updateNote, deleteNote, removeNotes } = notesSlice.actions;

export const fetchNotesAsync =
  (): AppThunk<Promise<boolean>> =>
    async (dispatch): Promise<boolean> => {
      try {
        const response = (await axios.get('/notes')) as AxiosResponse<ServiceResponse<NoteListItemDTO[]>>;
        if (response.data.success && response.data.data) {
          dispatch(setNotes(response.data.data));
          return true;
        }
      } catch (e: any) {
        console.error(e.message);
      }
      return false;
    };

export const fetchNoteAsync =
  (id: number): AppThunk<Promise<NoteDTO | undefined>> =>
    async (): Promise<NoteDTO | undefined> => {
      try {
        const response = (await axios.get(`/notes/${id}`)) as AxiosResponse<ServiceResponse<NoteDTO>>;
        if (response.data.success && response.data.data) {
          return response.data.data;
        }
      } catch (e: any) {
        console.error(e.message);
      }
      return undefined;
    };

export const createNoteAsync =
  (model: CreateNoteDTO): AppThunk<Promise<boolean>> =>
    async (dispatch): Promise<boolean> => {
      try {
        const response = (await axios.post('/notes', model)) as AxiosResponse<ServiceResponse<NoteDTO>>;
        if (response.data.success && response.data.data) {
          const note = response.data.data;
          dispatch(addNote({ id: note.id, name: note.name }));
          return true;
        }
      } catch (e: any) {
        console.error(e.message);
      }
      return false;
    };

export const updateNoteAsync =
  (model: NoteDTO): AppThunk<Promise<boolean>> =>
    async (dispatch): Promise<boolean> => {
      try {
        const response = (await axios.put('/notes', model)) as AxiosResponse<ServiceResponse<undefined>>;
        if (response.data.success) {
          dispatch(updateNote(model));
          return true;
        }
      } catch (e: any) {
        console.error(e.message);
      }
      return false;
    };

export const deleteNoteAsync =
  (id: number): AppThunk<Promise<boolean>> =>
    async (dispatch): Promise<boolean> => {
      try {
        const response = (await axios.delete(`/notes/${id}`)) as AxiosResponse<ServiceResponse<undefined>>;
        if (response.data.success) {
          dispatch(deleteNote(id));
          return true;
        }
      } catch (e: any) {
        console.error(e.message);
      }
      return false;
    };

export const notes = (state: RootState) => state.notes.notes;

export const loaded = (state: RootState) => state.notes.loaded;

export default notesSlice.reducer;