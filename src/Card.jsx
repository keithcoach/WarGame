import * as React from 'react';

const Card = ({ flipped, cardFace }) => {
  return (
    <div className="cardContainer">
      {flipped ? (
        <div className="cardFront">
          <div>{cardFace}</div>
        </div>
      ) : (
        <div className="cardBack"></div>
      )}
    </div>
  );
};

export default Card;
