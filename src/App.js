import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { abi } from "./abi";
import Header from "./components/Header";
import "./App.css";
import RulesPage from "./pages/RulesPage";
import GamePage from "./pages/GamePage";
import HistoryPage from "./pages/HistoryPage";

const contractAddress = "0x0EFAC9a906daC00D783dAC903983cfD0578d17dd";

const App = () => {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [gameHistory, setGameHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState("rules");

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
        fetchBalance();
        fetchGameHistory();
      } catch (error) {
        console.error("Wallet connection error:", error);
        setMessage("Ошибка подключения кошелька");
      }
    } else {
      alert("Пожалуйста, установите Metamask!");
    }
  };

  const fetchBalance = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const balance = await provider.getBalance(contractAddress);
      setBalance(ethers.utils.formatEther(balance));
    } catch (error) {
      console.error("Ошибка получения баланса:", error);
      setMessage("Не удалось получить баланс контракта.");
    }
  };

  const fetchGameHistory = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, abi, provider);

      const gameCount = await contract.getGameCount();
      const games = [];
      for (let i = 0; i < gameCount; i++) {
        const game = await contract.getGame(i);
        games.push({
          player: game[0],
          playerMove: parseMove(game[1]),
          contractMove: parseMove(game[2]),
          win: game[3],
          amountWon: ethers.utils.formatEther(game[4]),
        });
      }
      setGameHistory(games);
    } catch (error) {
      console.error("Ошибка получения истории игр:", error);
      setMessage("Не удалось загрузить историю игр.");
    }
  };

  const parseMove = (move) => {
    switch (move) {
      case 0:
        return "Камень";
      case 1:
        return "Бумага";
      case 2:
        return "Ножницы";
      default:
        return "Неизвестно";
    }
  };

  const playGame = async (playerMove) => {
    setLoading(true);
    setMessage("");
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);

      const tx = await contract.play(playerMove, {
        value: ethers.utils.parseEther("0.0001"),
        gasLimit: 100000,
      });
      await tx.wait();

      setMessage("Игра успешно завершена! Проверьте свои транзакции.");
      fetchBalance();
      fetchGameHistory();
    } catch (error) {
      console.error("Ошибка при игре:", error);
      setMessage(`Ошибка: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case "rules":
        return <RulesPage />;
      case "game":
        return (
          <GamePage
            account={account}
            balance={balance}
            playGame={playGame}
            loading={loading}
            message={message}
          />
        );
      case "history":
        return <HistoryPage gameHistory={gameHistory} />;
      default:
        return <RulesPage />;
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      fetchBalance();
      fetchGameHistory();
    }
  }, []);

  return (
    <div className="container">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main>{renderPage()}</main>
      {!account && (
        <button className="connect-button" onClick={connectWallet}>
          Подключить кошелек
        </button>
      )}
    </div>
  );
};

export default App;
