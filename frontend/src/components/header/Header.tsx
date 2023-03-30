import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { Link } from "react-router-dom";
import { authService } from '../../services/authService';

function renderSignSection() {
  if (authService.auth == false) {
    return (
      <ul className="navbar-nav ms-auto">
        <li className="nav-item">
          <Link className='nav-link' to="/sign-in">Sign in</Link>
        </li>
        <li className="nav-item">
          <Link className='nav-link' to="/sign-up">Sign up</Link>
        </li>
      </ul>
    );
  }
  return (
    <ul className="navbar-nav ms-auto">
      <li className="nav-item">
        <Link className='nav-link' to="/sign-in">Sign out</Link>
      </li>
    </ul>
  );
}

export function Header() {
  return (
    <nav className="navbar navbar-expand-sm navbar-dark bg-dark px-4">
      <div className='container-fluid'>
        <ul className="navbar-nav me-auto">
          <li className="nav-item">
            <a className="nav-link" href="#">Home</a>
          </li>
        </ul>
        {renderSignSection()}
      </div>
    </nav>
  );
}
