import React from "react";
import { FaHandRock, FaHandPaper, FaHandScissors } from "react-icons/fa";
import "./HistoryPage.css";

const HistoryPage = ({ gameHistory }) => {
  const renderChoiceIcon = (choice) => {
    switch (choice) {
      case "Камень":
        return <FaHandRock className="icon rock" />;
      case "Бумага":
        return <FaHandPaper className="icon paper" />;
      case "Ножницы":
        return <FaHandScissors className="icon scissors" />;
      default:
        return null;
    }
  };

  const renderResultIcon = (win, draw) => {
    if (draw) return "🤝"; // Ничья
    return win ? "🏆" : "😢"; // Победа или поражение
  };

  return (
    <div className="history-container">
      <h2 className="history-title">История игр</h2>
      {gameHistory.length === 0 ? (
        <p>История игр пуста.</p>
      ) : (
        <div className="cards-container">
          {gameHistory.map((game, index) => {
            const draw = game.playerMove === game.contractMove; // Проверяем ничью
            return (
              <div key={index} className="card">
                <div className="player-choice">
                  <h3>Вы</h3>
                  {renderChoiceIcon(game.playerMove)}
                </div>
                <div className="result">
                  <h3>Результат</h3>
                  <span className="result-icon">
                    {renderResultIcon(game.win, draw)}
                  </span>
                </div>
                <div className="contract-choice">
                  <h3>Противник</h3>
                  {renderChoiceIcon(game.contractMove)}
                </div>
                <div className="win-amount">
                  <h4>Выигрыш:</h4>
                  <p>{draw ? "Ничья" : `${game.amountWon} ETH🪙`}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
