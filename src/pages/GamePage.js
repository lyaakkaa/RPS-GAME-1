import React from "react";
import { FaHandRock, FaHandPaper, FaHandScissors } from "react-icons/fa";

const GamePage = ({ account, balance, playGame, loading, message }) => {
  return (
    <div>
      <h2>Игра</h2>
      {account && (
        <p>
          <strong>Баланс контракта:</strong> {balance} ETH
        </p>
      )}
      <div className="buttons">
        <button className="button" onClick={() => playGame(0)}>
          <FaHandRock /> Камень
        </button>
        <button className="button" onClick={() => playGame(1)}>
          <FaHandPaper /> Бумага
        </button>
        <button className="button" onClick={() => playGame(2)}>
          <FaHandScissors /> Ножницы
        </button>
      </div>
      {loading && <p className="loading">Идет обработка...</p>}
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default GamePage;
