import * as React from 'react';
import { useState, useEffect } from 'react';

import Card from './Card.jsx';

const App = () => {
  const [playerHand, setPlayerHand] = useState([]);
  const [flipped, setFlipped] = useState(false);
  const [computerHand, setComputerHand] = useState([]);
  const [playerCard, setPlayerCard] = useState('');
  const [computerCard, setComputerCard] = useState('');
  const [playerDetails, setPlayerDetails] = useState({
    wins: 0,
    losses: 0,
    cards: 26,
  });
  const [computerDetails, setComputerDetails] = useState({
    wins: 0,
    losses: 0,
    cards: 26,
  });

  useEffect(() => {
    if (flipped === true) winningHand();
  }, [flipped]);

  const suits = ['d', 'h', 'c', 's'];
  const ranks = [
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    'J',
    'Q',
    'K',
    'A',
  ];

  const ranking = {};
  const deck = [];

  ranks.forEach((rank) => {
    suits.forEach((suit) => {
      deck.push(rank + suit);
    });
  });
  ranks.forEach((rank) => {
    suits.forEach((suit) => {
      if (rank === 'A') {
        ranking[`${rank}${suit}`] = 14;
      } else if (rank === 'K') {
        ranking[`${rank}${suit}`] = 13;
      } else if (rank === 'Q') {
        ranking[`${rank}${suit}`] = 12;
      } else if (rank === 'J') {
        ranking[`${rank}${suit}`] = 11;
      } else {
        ranking[`${rank}${suit}`] = parseInt(rank);
      }
    });
  });

  const shuffle = () => {
    // initial shuffle of deck
    for (let i = 0; i <= 350; i++) {
      let firstIdx = Math.floor(Math.random() * deck.length);
      let secondIdx = Math.floor(Math.random() * deck.length);
      let temp = deck[firstIdx];
      deck[firstIdx] = deck[secondIdx];
      deck[secondIdx] = temp;
    }
    // cut cards and assign each half to respective player
    setPlayerHand(deck.slice(0, 26));
    setComputerHand(deck.slice(26));
    console.log({ ranking });
  };

  const flip = () => {
    // handle condition for when player is out of cards
    setPlayerCard(playerHand[0]);
    setComputerCard(computerHand[0]);
    setPlayerHand(playerHand.slice(1));
    setComputerHand(computerHand.slice(1));

    setFlipped(true);
  };

  const winningHand = () => {
    if (ranking[playerCard] > ranking[computerCard]) {
      // add cards to players hand
      setPlayerHand([...playerHand, playerCard, computerCard]);

      // update player details for win
      setPlayerDetails({
        ...playerDetails,
        wins: playerDetails.wins + 1,
        cards: playerDetails.cards + 1,
      });

      // update computer details for loss
      setComputerDetails({
        ...computerDetails,
        losses: computerDetails.losses + 1,
        cards: computerDetails.cards - 1,
      });

      if (computerHand.length === 0) {
        console.log('YOU WON PLAYER');
      }
    } else if (ranking[playerCard] < ranking[computerCard]) {
      setComputerHand([...computerHand, computerCard, playerCard]);

      //update computer details for win
      setComputerDetails({
        ...computerDetails,
        wins: computerDetails.wins + 1,
        cards: computerDetails.cards + 1,
      });

      //update player details for loss
      setPlayerDetails({
        ...playerDetails,
        losses: playerDetails.losses + 1,
        cards: playerDetails.cards - 1,
      });

      if (playerHand.length === 0) {
        console.log(
          'SORRY PLAYER THE COMPUTER WON. HIT SHUFFLE AND TRY AGAIN!'
        );
      }
    } else {
      //new playerCard is the playerHand[4] because we had a face card, then dealt 3 card, then that 5th card is the new player card
      if (playerHand[3] > computerHand[3]) {
        // add 5 player cards  and 5 computer cards to end of players hand
        const playerWonWarCards = playerHand.slice(0, 5);
        const computerLostWarCards = computerHand.slice(0, 5);

        const pUpdated = playerHand.slice(5);

        setPlayerHand([
          ...pUpdated,
          playerCard,
          computerCard,
          ...playerWonWarCards,
          ...computerLostWarCards,
        ]);

        const cUpdated = computerHand.slice(5);
        setComputerHand([...cUpdated]);

        setPlayerDetails({
          ...playerDetails,
          wins: playerDetails.wins + 1,
          cards: playerDetails.cards + 5,
        });

        // update computer details for loss
        setComputerDetails({
          ...computerDetails,
          wins: computerDetails.wins + 1,
          cards: computerDetails.cards - 5,
        });

        if (computerHand.length === 0) {
          console.log('YOU WON PLAYER');
        }
      } else {
        const computerWonWarCards = computerHand.slice(0, 5);
        const playerLostWarCards = playerHand.slice(0, 5);

        const cUpdated = computerHand.slice(5);

        setComputerHand([
          ...cUpdated,
          computerCard,
          playerCard,
          ...computerWonWarCards,
          ...playerLostWarCards,
        ]);

        const pUpdated = playerHand.slice(5);
        setPlayerHand([...pUpdated]);

        // update computer details for win
        setComputerDetails({
          ...computerDetails,
          wins: computerDetails.wins + 1,
          cards: computerDetails.cards + 5,
        });
        // update player for loss
        setPlayerDetails({
          ...playerDetails,
          losses: playerDetails.wins + 1,
          cards: playerDetails.cards - 5,
        });

        if (playerHand.length === 0) {
          console.log(
            'SO SORRY THE COMPUTER WON, CLICK SHUFFLE UP AND DEAL TO TRY AGAIN!'
          );
        }
      }
    }

    // flip cards after 1.5 seconds
    setTimeout(() => {
      setFlipped(false);
    }, 100);
  };

  return (
    <div>
      <button onClick={shuffle}>Shuffle Up and Deal Cards</button>
      {flipped ? (
        <button className="battleBtn" onClick={flip} disabled>
          Click to Battle!
        </button>
      ) : (
        <button className="battleBtn" onClick={flip}>
          Click to Battle!
        </button>
      )}
      <div className="player">
        <h3 className="title">Player Hand</h3>
        <div className="container">
          <div className="details">
            <h4>Player Details: </h4>
            <p>Wins: {playerDetails.wins}</p>
            <p>Losses: {playerDetails.losses}</p>
            <p>Cards: {playerDetails.cards}</p>
          </div>
          <div>
            <Card flipped={flipped} cardFace={playerCard} />
          </div>
        </div>
      </div>
      <div className="player">
        <div className="container">
          <div className="details">
            <h4>Computer Details: </h4>
            <p>Wins: {computerDetails.wins}</p>
            <p>Losses: {computerDetails.losses}</p>
            <p>Cards: {computerDetails.cards}</p>
          </div>
          <div>
            <Card flipped={flipped} cardFace={computerCard} />
          </div>
        </div>
        <h3 className="player">Computer Hand</h3>
      </div>
    </div>
  );
};

export default App;
