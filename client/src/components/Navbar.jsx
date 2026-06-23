import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "./Logo";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="sticky top-0 z-20 border-b border-white/10 bg-white/5 backdrop-blur-xl">
      <div className="flex w-full items-center justify-between px-8 py-3">
        <Link to="/">
          <Logo />
        </Link>

        <div className="flex items-center gap-6 text-sm text-slate-200/80">
          <Link to="/" className="hover:text-white">
            Dashboard
          </Link>
          <Link to="/budget" className="hover:text-white">
            Budget
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {user && <span className="text-sm text-slate-300">{user.name}</span>}
          <button
            onClick={handleLogout}
            className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-sm hover:bg-white/15"
          >
            Log out
          </button>
        </div>
      </div>
    </nav>
  );
}
