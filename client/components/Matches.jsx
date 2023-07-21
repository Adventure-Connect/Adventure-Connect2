import React from "react";
import { useEffect, useState } from "react";

const Matches = () => {
  const [matchToDisplay, setMatchToDisplay] = useState(null)

  useEffect(()=> {
    fetch('/api/findMatches')
      .then(res => {
        // I don't know why res.locals does not exist on the object
        console.log(res, 'this is the response');
        return res.json()
      })
      .then(data => {
        console.log(JSON.stringify(data), 'this is the data');
        setMatchToDisplay(data)
      })
      .catch(error => {
        console.log(error);
      })
  }, [])

  if (!matchToDisplay) {
    return <div>Loading...</div>
  }

  return (
    <>
    <ul>
      {matchToDisplay.map(match => <li>{match.name} {match.email}</li>)}
    </ul>
    {/* look at the matches prop in the user model based on the email inside our cookie so we know who's account is logged in */}
    {/* then iterate through the array of matches which each element in the array should be the email or the _id.$oid */}
    {/* then check that user's matches prop to see if the current users email or id is in their matches array */}
    {/* if so, render a li element showing their name, email address, and pic */}
    </>
  )
}

export default Matches;