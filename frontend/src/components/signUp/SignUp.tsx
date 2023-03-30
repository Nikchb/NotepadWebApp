import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';

export function SignUp() {
  return (
    <div className='container'>
      <h2>Sign up</h2>
      <hr />
      <div className='row'>
        <div className='col-4'>
          <div className='form-group'>
            <label className='form-label'>Email</label>
            <input type='text' className='form-control'></input>
          </div>
          <div className='form-group'>
            <label className='form-label'>Password</label>
            <input type='password' className='form-control'></input>
          </div>
          <div className='form-group'>
            <label className='form-label'>Password repeat</label>
            <input type='password' className='form-control'></input>
          </div>
          <button className='form-control mt-3'>Sign up</button>
        </div>
      </div>
    </div>
  );
}
