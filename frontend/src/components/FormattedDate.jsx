// import the necessary libraries and objects
import React from 'react';

// defines the formatteddate functional component that takes a 'date' prop
const FormattedDate = date => {
  // formats the incoming date using toLocaleDateString
  const formattedDate = new Date(date.date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // returns the formatted date
  return <>{formattedDate}</>;
};

// exports the formatteddate component
export default FormattedDate;
