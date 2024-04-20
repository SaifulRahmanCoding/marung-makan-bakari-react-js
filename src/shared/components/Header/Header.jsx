import { IconSettings2, IconDoorExit } from "@tabler/icons-react";
import { IconMenu2 } from "@tabler/icons-react";
import PropTypes from "prop-types";

export default function Header({ toggleSidebar }) {
  return (
    <div className="d-flex justify-content-between shadow-sm px-4 py-2">
      <div className="d-flex align-items-center">
        <button onClick={toggleSidebar} className="btn btn-link">
          <i>
            <IconMenu2 />
          </i>
        </button>
      </div>
      <button
        data-bs-toggle="dropdown"
        aria-expanded="false"
        className="btn btn-link"
      >
        <img
          className="rounded-circle cursor-pointer"
          width={32}
          height={32}
          src="https://cdn.iconscout.com/icon/free/png-256/free-avatar-372-456324.png"
          alt="avatar"
        />
      </button>
      <ul className="dropdown-menu">
        <li className="dropdown-item-text">
          <div className="flex-grow-1 ms-3">
            <h6 className="mb-1">Nikola Tesla</h6>
            <span>nikola.tesla@gmail.com</span>
          </div>
        </li>
        <hr />
        <li>
          <button className="dropdown-item" href="#">
            <i className="me-2">
              <IconSettings2 size={16} />
            </i>
            Sunting Profil
          </button>
        </li>
        <li>
          <button className="dropdown-item" href="#">
            <i className="me-2">
              <IconDoorExit size={16} />
            </i>
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
}

Header.propTypes = {
  toggleSidebar: PropTypes.func,
};
