import { useAppSelector } from '../../app/hooks';
import { Link } from "react-router-dom";
import { isAuth } from '../../app/slices/authSlice';
import { removeAuthToken } from '../../app/store';

export function Header() {
  const auth = useAppSelector(isAuth);
  return (
    <nav className="navbar navbar-expand-sm navbar-dark bg-dark px-4">
      <div className='container-fluid'>
        {auth === false ? (
          <ul className="navbar-nav me-auto">
          </ul>
        ) : (
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className='nav-link' to="/notes">Notes</Link>
            </li>
            <li className="nav-item">
              <Link className='nav-link' to="/notes/create">Create note</Link>
            </li>
          </ul>
        )}
        {auth === false ? (
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className='nav-link' to="/sign-in">Sign in</Link>
            </li>
            <li className="nav-item">
              <Link className='nav-link' to="/sign-up">Sign up</Link>
            </li>
          </ul>
        ) : (
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className='nav-link' onClick={() => removeAuthToken()} to="/sign-in">Sign out</Link>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
}
