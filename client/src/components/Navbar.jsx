import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="sticky top-0 z-20 border-b border-white/10 bg-white/5 backdrop-blur-xl">
      <div className="flex w-full items-center justify-between gap-2 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/dashboard" className="shrink-0">
          <Logo />
        </Link>

        <div className="hidden items-center gap-6 text-sm text-slate-200/80 md:flex">
          <Link to="/dashboard" className="hover:text-white">
            Dashboard
          </Link>
          <Link to="/budget" className="hover:text-white">
            Budget
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle />
          {user && <span className="hidden text-sm text-slate-300 sm:inline">{user.name}</span>}
          <button
            onClick={handleLogout}
            className="hidden rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-sm hover:bg-white/15 md:inline-block"
          >
            Log out
          </button>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-slate-200 md:hidden"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="flex flex-col gap-1 border-t border-white/10 px-4 py-3 text-sm text-slate-200/80 md:hidden">
          <Link to="/dashboard" className="rounded-lg px-2 py-2 hover:bg-white/10 hover:text-white" onClick={() => setMenuOpen(false)}>
            Dashboard
          </Link>
          <Link to="/budget" className="rounded-lg px-2 py-2 hover:bg-white/10 hover:text-white" onClick={() => setMenuOpen(false)}>
            Budget
          </Link>
          {user && <span className="px-2 py-1 text-xs text-slate-400">Signed in as {user.name}</span>}
          <button
            onClick={handleLogout}
            className="mt-1 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-left hover:bg-white/15"
          >
            Log out
          </button>
        </div>
      )}
    </nav>
  );
}
