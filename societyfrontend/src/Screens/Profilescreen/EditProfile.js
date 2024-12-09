import React from 'react'

export default function EditProfile() {
  return (
    <div className="flex-grow p-8 bg-blue-100 h-[30vh] w-full">
      <div className="mb-6 ml-[330px]">
        <h2 className="text-2xl font-semibold">Edit Profile</h2>

      </div>

      <div className="relative bg-white shadow-lg rounded-lg p-4 md:p-10 max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-10">
          <div className="text-center">
            <img
              src="https://s3-alpha-sig.figma.com/img/bd89/79e3/d38ee59b7d4615afd56d81811704ef21?Expires=1733702400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=E2xGcYVbyuCMeogpxbuUsamzaCnDbSIKnjXy7zB4G1LFvW2im0ZS7rRRSoQOH-5yFX-L6djlyLpSrGMyrm~V25iVpSdurU8xH5B1v8edClv0Kx1H1s2L~6y97TSUdo4U9zYu9v-wZKD2UnYh9ZQVr-~5tyBhRcSaTnORVnQX7R4YVOMAoIDWnspyMd~KT-dtk-xGL0zvpPfY7eUz5KYNMFP2JxuhmVHXeRhSVFwqGkyycIarqRUIzKy-2ebVaPeb6b6aM113gMNu1F8oyBhH5JqgcrXXphHEiTrgwQYE~-L8YFtMPO-Ny9K~8PjOcy4LFByn7-RyFg9GbsiZ9~GKkQ__"
              alt="Profile"
              className="w-24 h-24 rounded-full mx-auto mb-4 border border-gray-300"
            />
            <h3 className="text-lg font-semibold">Arlene McCoy</h3>
          </div>
          <form className="flex-1 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-600">First Name*</label>
                <input
                  type="text"
                  value="Arlene"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-gray-600">Last Name*</label>
                <input
                  type="text"
                  value="McCoy"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  readOnly
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-600">Phone Number*</label>
                <input
                  type="text"
                  value="+91 99130 44537"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-gray-600">Email Address*</label>
                <input
                  type="email"
                  value="ArleneMcCoy25@gmail.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  readOnly
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-600">Select Society*</label>
                <input
                  type="text"
                  value="Shantigram residency"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-gray-600">Country*</label>
                <input
                  type="text"
                  value="India"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  readOnly
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-600">State*</label>
                <input
                  type="text"
                  value="Gujarat"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-gray-600">City*</label>
                <input
                  type="text"
                  value="Baroda"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  readOnly
                />
              </div>
            </div>

            <div className="col-span-1 md:col-span-2 flex justify-end mt-4">
              <button className="bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg px-4 py-2 hover:bg-orange-600">
                Update Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
