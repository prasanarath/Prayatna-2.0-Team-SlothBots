"use client"

import { useAuth } from "../context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { User, Settings, Shield, Bell, Clock } from "lucide-react"

export default function ProfilePage() {
  const { isLoggedIn } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("profile")

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login')
    }
  }, [isLoggedIn, router])

  if (!isLoggedIn) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <User className="h-8 w-8 mr-2 text-blue-600 dark:text-blue-400" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Profile</h1>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Sidebar */}
            <div className="md:w-64 bg-gray-50 dark:bg-gray-900 p-4">
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`flex items-center px-3 py-2 w-full text-left rounded-md ${
                    activeTab === "profile"
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <User className="mr-3 h-5 w-5" />
                  <span>Profile Information</span>
                </button>

                <button
                  onClick={() => setActiveTab("preferences")}
                  className={`flex items-center px-3 py-2 w-full text-left rounded-md ${
                    activeTab === "preferences"
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <Settings className="mr-3 h-5 w-5" />
                  <span>Preferences</span>
                </button>

                <button
                  onClick={() => setActiveTab("security")}
                  className={`flex items-center px-3 py-2 w-full text-left rounded-md ${
                    activeTab === "security"
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <Shield className="mr-3 h-5 w-5" />
                  <span>Security</span>
                </button>

                <button
                  onClick={() => setActiveTab("notifications")}
                  className={`flex items-center px-3 py-2 w-full text-left rounded-md ${
                    activeTab === "notifications"
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <Bell className="mr-3 h-5 w-5" />
                  <span>Notifications</span>
                </button>

                <button
                  onClick={() => setActiveTab("history")}
                  className={`flex items-center px-3 py-2 w-full text-left rounded-md ${
                    activeTab === "history"
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <Clock className="mr-3 h-5 w-5" />
                  <span>Voyage History</span>
                </button>
              </nav>
            </div>

            {/* Main content */}
            <div className="flex-1 p-6 bg-white dark:bg-gray-800">
              {activeTab === "profile" && (
                <div>
                  <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Profile Information</h2>
                  <div className="max-w-md">
                    <div className="space-y-4">
                      <div className="border dark:border-gray-700 rounded-md p-4">
                        <h3 className="font-medium mb-2 text-gray-900 dark:text-white">User Profile</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Name:</span>
                            <span className="text-gray-900 dark:text-white">Demo User</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Email:</span>
                            <span className="text-gray-900 dark:text-white">admin@example.com</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Role:</span>
                            <span className="text-gray-900 dark:text-white">Captain</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "preferences" && (
                <div>
                  <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">User Preferences</h2>
                  <div className="space-y-6 max-w-md">
                    <div>
                      <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-white">Display Settings</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700 dark:text-gray-300">Dark Mode</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200">
                      Save Preferences
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "security" && (
                <div>
                  <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Security Settings</h2>
                  <div className="space-y-6 max-w-md">
                    <div>
                      <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-white">Change Password</h3>
                      <form className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Current Password</label>
                          <input
                            type="password"
                            className="w-full p-2 border dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="Enter current password"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">New Password</label>
                          <input
                            type="password"
                            className="w-full p-2 border dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="Enter new password"
                          />
                        </div>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200">
                          Update Password
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "notifications" && (
                <div>
                  <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Notification Settings</h2>
                  <div className="space-y-6 max-w-md">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">Email Notifications</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Receive notifications via email</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200">
                      Save Notification Settings
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "history" && (
                <div>
                  <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Voyage History</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-900">
                        <tr>
                          <th className="py-3 px-4 text-left text-gray-900 dark:text-white">Date</th>
                          <th className="py-3 px-4 text-left text-gray-900 dark:text-white">Route</th>
                          <th className="py-3 px-4 text-left text-gray-900 dark:text-white">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t border-gray-200 dark:border-gray-700">
                          <td className="py-3 px-4 text-gray-900 dark:text-white">2024-03-05</td>
                          <td className="py-3 px-4 text-gray-900 dark:text-white">New York to London</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                              Completed
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-gray-900 text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Smart Voyage Optimization. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

