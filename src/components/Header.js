import React from "react";
import "./Header.css";

const Header = ({ currentPage, setCurrentPage }) => {
  return (
    <header className="header">
      <div className="logo">
      🪙
      </div>
      <nav className="nav">
        <button
          className={`nav-button ${currentPage === "rules" ? "active" : ""}`}
          onClick={() => setCurrentPage("rules")}
        >
          Правила
        </button>
        <button
          className={`nav-button ${currentPage === "game" ? "active" : ""}`}
          onClick={() => setCurrentPage("game")}
        >
          Игра
        </button>
        <button
          className={`nav-button ${currentPage === "history" ? "active" : ""}`}
          onClick={() => setCurrentPage("history")}
        >
          История
        </button>
      </nav>
    </header>
  );
};

export default Header;
