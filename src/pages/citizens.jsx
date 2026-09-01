import { Link } from "react-router-dom";
import {
ArrowLeft,
UserCog,
Info,
} from "lucide-react";

function Citizens() {
return ( <div className="admin-dashboard">


  <header className="admin-navbar">

    <Link to="/admin" className="admin-brand">

      <div className="admin-logo">
        R
      </div>

      <div>
        <h2>ResolveX</h2>

        <span>
          Administration Portal
        </span>
      </div>

    </Link>

    <nav className="admin-nav-links">

      <Link to="/admin">
        Dashboard
      </Link>

      <Link to="/admin/issues">
        Issues
      </Link>

      <Link to="/admin/officers">
        Officers
      </Link>

      <Link
        to="/admin/citizens"
        className="active"
      >
        Citizens
      </Link>

    </nav>

    <div className="admin-nav-right">

      <div className="admin-avatar">
        A
      </div>

      <div className="admin-profile">
        <strong>Admin</strong>
        <small>Administrator</small>
      </div>

    </div>

  </header>


  <main className="admin-content">

    <Link
      to="/admin"
      className="back-link"
    >
      <ArrowLeft size={15} />
      Back to Dashboard
    </Link>


    <section className="issues-page-header">

      <div>

        <h1>
          Citizen Management
        </h1>

        <p>
          View citizens registered on ResolveX.
        </p>

      </div>

    </section>


    <section className="admin-panel">

      <div className="admin-empty">

        <div className="admin-stat-icon purple">
          <UserCog size={28} />
        </div>

        <h2>
          Citizen list API is not available
        </h2>

        <p>
          The current backend does not provide a
          GET endpoint for retrieving all citizens.
          The available user API currently handles
          promotion of a citizen to an officer.
        </p>

        <div className="admin-info-box">

          <Info size={18} />

          <span>
            No fake citizen data is displayed.
            Once a citizen-list API is available,
            this page can be connected to it.
          </span>

        </div>

      </div>

    </section>

  </main>

</div>


);
}

export default Citizens;
