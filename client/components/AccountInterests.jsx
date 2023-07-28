import React from "react";

const AccountInterests = () => {
  return (
    <>
      {/* decide where to send the info once submitted */}
      <form action="/">
        <h1>Interests</h1>
        <h4>Your interests</h4>
        <h4>Add more interests</h4>
        <p>You can either browse by category or search by keyword</p>
        <input type="submit" value="Save Changes" />
      </form>
    </>
  );
};

export default AccountInterests;
