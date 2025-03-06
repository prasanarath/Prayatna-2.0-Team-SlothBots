'use client';

import Link from "next/link"
import { useState } from "react"
import { Anchor, Ship, Cloud, UserCircle, Menu, X } from "lucide-react"
import { useAuth } from "../context/AuthContext"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isLoggedIn, logout } = useAuth()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="bg-[#1a1a1a] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center text-white hover:text-blue-400 font-bold text-xl transition duration-200">
                <Anchor className="h-6 w-6 mr-2" />
                <span>Straw-hat-compass</span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {isLoggedIn && (
                <>
                  <Link
                    href="/route-planner"
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-white hover:text-blue-400 transition duration-200"
                  >
                    <Ship className="h-4 w-4 mr-2" />
                    Route Planner
                  </Link>
                  <Link
                    href="/ship-info"
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-white hover:text-blue-400 transition duration-200"
                  >
                    <Ship className="h-4 w-4 mr-2" />
                    Ship Info
                  </Link>
                  <Link
                    href="/weather-info"
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-white hover:text-blue-400 transition duration-200"
                  >
                    <Cloud className="h-4 w-4 mr-2" />
                    Weather Info
                  </Link>
                  <Link
                    href="/profile"
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-white hover:text-blue-400 transition duration-200"
                  >
                    <UserCircle className="h-4 w-4 mr-2" />
                    Profile
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {!isLoggedIn ? (
              <Link
                href="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
              >
                Sign In
              </Link>
            ) : (
              <button
                onClick={logout}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
              >
                Sign Out
              </button>
            )}
          </div>
          <div className="flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-blue-400 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden bg-[#1a1a1a] border-t border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {isLoggedIn && (
              <>
                <Link
                  href="/route-planner"
                  className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-blue-400 hover:bg-gray-800 transition duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <Ship className="h-4 w-4 mr-2" />
                    Route Planner
                  </div>
                </Link>
                <Link
                  href="/ship-info"
                  className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-blue-400 hover:bg-gray-800 transition duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <Ship className="h-4 w-4 mr-2" />
                    Ship Info
                  </div>
                </Link>
                <Link
                  href="/weather-info"
                  className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-blue-400 hover:bg-gray-800 transition duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <Cloud className="h-4 w-4 mr-2" />
                    Weather Info
                  </div>
                </Link>
                <Link
                  href="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-blue-400 hover:bg-gray-800 transition duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <UserCircle className="h-4 w-4 mr-2" />
                    Profile
                  </div>
                </Link>
              </>
            )}
            <div className="px-3 py-2">
              {!isLoggedIn ? (
                <Link
                  href="/login"
                  className="block w-full text-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
              ) : (
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
                >
                  Sign Out
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar; 