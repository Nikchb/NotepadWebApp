import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { Link } from "react-router-dom";
import { isAuth, revoke } from '../../app/slices/authSlice';

export function Header() {
  const auth = useAppSelector(isAuth);
  const dispatch = useAppDispatch();
  return (
    <nav className="navbar navbar-expand-sm navbar-dark bg-dark px-4">
      <div className='container-fluid'>
        <ul className="navbar-nav me-auto">
          <li className="nav-item">
            <a className="nav-link" href="#">Home</a>
          </li>
        </ul>
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
              <Link className='nav-link' onClick={() => dispatch(revoke())} to="/sign-in">Sign out</Link>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
}
