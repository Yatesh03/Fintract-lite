import React, { useEffect, useRef, useState } from "react";
import {
  Menu, X, Home, History, BadgeDollarSign, Goal, UserCircle, SlidersVertical, Bot, PiggyBank
} from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAppContext } from "../contexts/AppProvider";
import SkeletonLoader from "../components/SkeletonLoader";
import ProfileMenu from "../components/ProfileMenu";

export default function UserLayout() {
  const { setSearch, logout, navigate, user, loading } = useAppContext();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const sidebarRef = useRef(null);
  const toggleRef = useRef(null);
  const userDropdownRef = useRef(null);

  const handleLogout = async () => {
    try {
      const res = await logout();
    } catch (error) {
      return null;
    }
  }

  const menuItems = [
    { name: "Dashboard", icon: <Home size={20} />, href: "/" },
    { name: "Add Transactions", icon: <BadgeDollarSign size={20} />, href: "/add-transactions" },
    { name: "Budgets", icon: <Goal size={20} />, href: "/budgets" },
    { name: "Set Budgets", icon: <SlidersVertical size={20} />, href: "/set-budgets" },
    { name: "Transactions", icon: <History size={20} />, href: "/transactions" },
    { name: "Savings Wallet", icon: <PiggyBank size={20} />, href: "/savings" },
    { name: "Scan & Pay", icon: <BadgeDollarSign size={20} />, href: "/scan-pay" },
    { name: "Request / Receive", icon: <BadgeDollarSign size={20} />, href: "/request-pay" },
    { name: "AI Advisor", icon: <Bot size={20} />, href: "/ai-advisor" },
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      const isMobile = window.innerWidth < 768;

      if (isMobile && isOpen &&
        !sidebarRef.current?.contains(e.target) &&
        !toggleRef.current?.contains(e.target)
      ) {
        setIsOpen(false);
      }

      if (showUserDropdown && !userDropdownRef.current?.contains(e.target)) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, showUserDropdown]);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed md:static z-40 top-0 left-0 h-full w-72 glass-card border-r border-white/20
        transform transition-all duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="flex items-center justify-between px-6 py-8 border-b border-white/10">
          <span
            onClick={() => navigate("/")}
            className="text-xl font-bold flex items-center gap-3 cursor-pointer group"
          >
            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 shadow-lg group-hover:scale-110 transition-transform duration-200">
              <img src="./logo.png" alt="" className="size-6 filter brightness-0 invert" />
            </div>
            <span className="gradient-text text-xl">FinTract-Lite</span>
          </span>
          <button
            ref={toggleRef}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <X size={20} className="text-slate-600" />
          </button>
        </div>

        <nav className="px-4 py-6 space-y-2">
          {menuItems.map(({ name, icon, href }) => (
            <Link
              key={href}
              to={href}
              className={`group flex items-center gap-4 py-3 px-4 font-medium rounded-xl transition-all duration-200
              ${location.pathname === href
                  ? "bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-700 border border-purple-200/50 shadow-lg"
                  : "text-slate-600 hover:bg-white/50 hover:text-slate-800 hover:shadow-md"
                }`}
            >
              <div className={`p-2 rounded-lg transition-all duration-200 ${
                location.pathname === href
                  ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg"
                  : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
              }`}>
                {React.cloneElement(icon, { size: 18 })}
              </div>
              <span className="text-sm font-semibold">{name}</span>
              {location.pathname === href && (
                <div className="ml-auto w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"></div>
              )}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full">
        {/* Header */}
        <header className="sticky top-0 z-30 glass-card border-b border-white/20 px-6 py-4 flex items-center justify-between gap-4">
          <button
            ref={toggleRef}
            className="md:hidden p-2 rounded-xl hover:bg-white/20 transition-colors"
            onClick={() => setIsOpen(true)}
          >
            <Menu size={20} className="text-slate-600" />
          </button>

          <div className={`flex items-center gap-4 ${
            (location.pathname === '/' || location.pathname === '/transactions')
              ? 'justify-between md:w-full'
              : 'ml-auto'
          }`}>
            {/* Search - Only show on Dashboard and Transactions pages */}
            {(location.pathname === '/' || location.pathname === '/transactions') && (
              <div className="hidden md:flex items-center px-4 gap-3 glass rounded-2xl h-12 w-full max-w-md border border-white/30">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search transactions..."
                  className="w-full bg-transparent text-sm text-slate-600 placeholder-slate-400 outline-none"
                  onChange={(e) => {
                    setSearch(e.target.value);
                    navigate("/transactions");
                  }}
                />
              </div>
            )}

            {/* User Dropdown */}
            <div className="relative" ref={userDropdownRef}>
              <button 
                onClick={() => setShowUserDropdown(prev => !prev)} 
                className="p-2 rounded-xl glass border border-white/30 hover:border-white/50 transition-all duration-200 group"
              >
                <UserCircle size={24} className="text-slate-600 group-hover:text-slate-800 transition-colors" />
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 mt-3 w-56 glass-card rounded-2xl border border-white/20 p-4 z-50 shadow-xl">
                  <div className="flex items-center gap-3 pb-3 border-b border-white/20">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                      <UserCircle size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{user.name || 'User'}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="space-y-2 pt-3">
                    <button
                      className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-white/50 rounded-lg transition-all duration-200 flex items-center gap-3"
                      onClick={() => {
                        setShowProfileMenu(true);
                        setShowUserDropdown(false);
                      }}
                    >
                      <UserCircle size={16} />
                      View Profile
                    </button>
                    <button
                      className="w-full text-left px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 flex items-center gap-3 border border-red-200"
                      onClick={handleLogout}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="p-6 flex-1 overflow-y-auto">
          {loading ? <SkeletonLoader /> : <Outlet />}
        </main>
      </div>

      {/* Profile Menu */}
      <ProfileMenu 
        isOpen={showProfileMenu} 
        onClose={() => setShowProfileMenu(false)} 
      />
    </div>
  );
}
