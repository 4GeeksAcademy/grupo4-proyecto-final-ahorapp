import React from "react";

const Card = ({ title, description, onClick }) => {
  return (
    <div className="card" onClick={onClick}>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default Card;