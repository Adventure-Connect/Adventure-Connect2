import React from "react";
import Users from "../../server/models/userModel";

const handleFormSubmit = async (e) => {
  e.preventDefault()
  console.log('triggered handleFormSubmit');
  // const newZipCode = await Users.findOne({})
}

const EditAddress = () => {
  return (
    <>
      <h2>Update your zip code using the form below</h2>
      <form onSubmit={handleFormSubmit} action="/">
        <input type="text" />
        <input type="submit" />
      </form>
    </>
  )
}

export default EditAddress