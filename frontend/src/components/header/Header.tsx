import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';

export function Header() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <div className='container-fluid'>
        <ul className="navbar-nav me-auto">
          <li className="nav-item">
            <a className="nav-link" href="#">Home</a>
          </li>
        </ul>
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <a className="nav-link" href="#">Sign In</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">Sign Up</a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
