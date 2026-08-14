import { NavLink } from "react-router-dom";

function Sidebar({ isAdmin = false }) {
  if (isAdmin) {
    return (
      <aside className="sidebar">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            isActive ? "side-link active" : "side-link"
          }
        >
          <span>📊</span>
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/admin/requests"
          className={({ isActive }) =>
            isActive ? "side-link active" : "side-link"
          }
        >
          <span>📋</span>
          <span>Manage Requests</span>
        </NavLink>

        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            isActive ? "side-link active" : "side-link"
          }
        >
          <span>👥</span>
          <span>Manage Users</span>
        </NavLink>

        <NavLink
          to="/admin/pickup-status"
          className={({ isActive }) =>
            isActive ? "side-link active" : "side-link"
          }
        >
          <span>🚚</span>
          <span>Pickup Status</span>
        </NavLink>

        <NavLink
          to="/admin/reports"
          className={({ isActive }) =>
            isActive ? "side-link active" : "side-link"
          }
        >
          <span>📈</span>
          <span>Reports</span>
        </NavLink>
      </aside>
    );
  }

  return (
    <aside className="sidebar">

      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          isActive ? "side-link active" : "side-link"
        }
      >
        <span>🏠</span>
        <span>Dashboard</span>
      </NavLink>

      <NavLink
        to="/request-pickup"
        className={({ isActive }) =>
          isActive ? "side-link active" : "side-link"
        }
      >
        <span>♻️</span>
        <span>Request Pickup</span>
      </NavLink>

      <NavLink
        to="/my-requests"
        className={({ isActive }) =>
          isActive ? "side-link active" : "side-link"
        }
      >
        <span>📋</span>
        <span>My Requests</span>
      </NavLink>

      <NavLink
        to="/rewards"
        className={({ isActive }) =>
          isActive ? "side-link active" : "side-link"
        }
      >
        <span>🏆</span>
        <span>Rewards</span>
      </NavLink>

      <NavLink
        to="/profile"
        className={({ isActive }) =>
          isActive ? "side-link active" : "side-link"
        }
      >
        <span>👤</span>
        <span>Profile</span>
      </NavLink>

    </aside>
  );
}

export default Sidebar;