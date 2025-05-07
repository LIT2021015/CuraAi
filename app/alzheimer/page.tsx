"use client"
import React, { useState } from 'react'



const page = () => {
  const [formData, setFormData] = useState({
    firstname :"",
    lastname:"",
    phone:"",
    email:"",
    gender:"",
    age:"",
    file:null,
  });

  const handleChange = (e) => {
    const {name, value, type, files} = e.target;
    setFormData({
      ...formData,
      [name]:type==='file'?files[0]:value,
    });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    const res = await fetch('/api/resulta', {
      method : 'POST',
      body: data,
    });

    if(res.ok)
    {
      alert("Form Submitted Normally")
    }
    else
    {
      alert("Error Submitting Form")
    }

  };
  return (
    <>
      <div className='flex flex-col items-center justify-center mt-20'>

<h1 className='text-3xl font-extrabold'>Alzheimer Detection</h1>

</div>

<form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg space-y-6 mt-24"
      encType="multipart/form-data"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="firstname" className="block font-medium mb-1">
            Firstname
          </label>
          <input
            type="text"
            name="firstname"
            id="firstname"
            required
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg"
          />
        </div>
        <div>
          <label htmlFor="lastname" className="block font-medium mb-1">
            Lastname
          </label>
          <input
            type="text"
            name="lastname"
            id="lastname"
            required
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg"
          />
        </div>
      </div>

      <div>
        <label htmlFor="phone" className="block font-medium mb-1">
          Phone No.
        </label>
        <input
          type="number"
          name="phone"
          id="phone"
          required
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded-lg"
        />
        <small className="text-gray-500">* Include your area code</small>
      </div>

      <div>
        <label htmlFor="email" className="block font-medium mb-1">
          Email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          required
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded-lg"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="gender" className="block font-medium mb-1">
            Gender
          </label>
          <select
            name="gender"
            id="gender"
            required
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div>
          <label htmlFor="age" className="block font-medium mb-1">
            Age
          </label>
          <input
            type="number"
            name="age"
            id="age"
            required
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg"
          />
        </div>
      </div>

      <div>
        <label htmlFor="file" className="block font-medium mb-1">
          Upload your Brain MRI
        </label>
        <input
          type="file"
          name="file"
          id="file"
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded-lg"
        />
      </div>

      <div className="text-center">
        <button
          type="submit"
          className="w-full md:w-[700px] mt-6 px-4 py-2 border border-green-500 text-green-600 rounded-lg hover:bg-green-100"
        >
          Submit
        </button>
      </div>
    </form>
    </>



  )
}

export default page