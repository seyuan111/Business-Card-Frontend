import React from 'react'
import NavBar from '../components/NavBar'

const Settings = () => {
  return (
    <div>
        <NavBar />
        <div className="flex flex-col justify-center items-center min-h-screen p-6 bg-gradient-to-br from-[#e6f0fa] via-[#f9e6f0] to-[#e6f0fa] text-gray-700">
          <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-600 mb-4">Settings</h2>
            <p className="text-sm text-gray-500 mb-4">Manage your account settings and preferences.</p>
            {/* Settings form or content goes here */}
        </div>
    </div>
    </div>
  )
}

export default Settings