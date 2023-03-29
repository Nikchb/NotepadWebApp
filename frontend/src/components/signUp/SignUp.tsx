import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';

export function SignUp() {
  return (
    <div className='row'>
      <div className='col-4'>
        <div className='form-group'>
          <label>Email</label>
          <input type='text'></input>
        </div>
      </div>
    </div>
  );
}
