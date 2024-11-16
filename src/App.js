import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { FaHandRock, FaHandPaper, FaHandScissors } from "react-icons/fa";

const contractAddress = "0x0EFAC9a906daC00D783dAC903983cfD0578d17dd";
const abi = [
  {
    inputs: [],
    name: "fundContract",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "player",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "win",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amountWon",
        type: "uint256",
      },
    ],
    name: "GameResult",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "enum RockPaperScissors.Move",
        name: "playerMove",
        type: "uint8",
      },
    ],
    name: "play",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "betAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "games",
    outputs: [
      {
        internalType: "address",
        name: "player",
        type: "address",
      },
      {
        internalType: "enum RockPaperScissors.Move",
        name: "playerMove",
        type: "uint8",
      },
      {
        internalType: "enum RockPaperScissors.Move",
        name: "contractMove",
        type: "uint8",
      },
      {
        internalType: "bool",
        name: "win",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "amountWon",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "getGame",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "enum RockPaperScissors.Move",
        name: "",
        type: "uint8",
      },
      {
        internalType: "enum RockPaperScissors.Move",
        name: "",
        type: "uint8",
      },
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getGameCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "rewardMultiplier",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const App = () => {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [gameHistory, setGameHistory] = useState([]); // Хранение истории игр

  // Подключение кошелька
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
        fetchBalance();
        fetchGameHistory(); // Загружаем историю игр после подключения
      } catch (error) {
        console.error("Wallet connection error:", error);
        setMessage("Ошибка подключения кошелька");
      }
    } else {
      alert("Пожалуйста, установите Metamask!");
    }
  };

  // Получение баланса контракта
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

  // Игра
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
      fetchBalance(); // Обновление баланса
      fetchGameHistory(); // Обновление истории
    } catch (error) {
      console.error("Ошибка при игре:", error);
      setMessage(`Ошибка: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Получение истории игр
  const fetchGameHistory = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, abi, provider);

      // Получаем количество игр
      const gameCount = await contract.getGameCount();

      // Запрашиваем данные о каждой игре
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

  // Перевод числовых значений ходов в текст
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

  useEffect(() => {
    if (window.ethereum) {
      fetchBalance();
      fetchGameHistory(); // Загружаем историю игр при загрузке
    }
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Rock-Paper-Scissors</h1>
      {account ? (
        <div>
          <p>
            <strong>Кошелек:</strong> {account}
          </p>
          <p>
            <strong>Баланс контракта:</strong> {balance} ETH
          </p>
          <div style={styles.buttons}>
            <button style={styles.button} onClick={() => playGame(0)}>
              <FaHandRock /> Камень
            </button>
            <button style={styles.button} onClick={() => playGame(1)}>
              <FaHandPaper /> Бумага
            </button>
            <button style={styles.button} onClick={() => playGame(2)}>
              <FaHandScissors /> Ножницы
            </button>
          </div>
          {loading && <p style={styles.loading}>Идет обработка...</p>}
          {message && <p style={styles.message}>{message}</p>}

          <div style={styles.historyContainer}>
            <h2>История игр</h2>
            {gameHistory.length === 0 ? (
              <p>История игр пуста.</p>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th>Игрок</th>
                    <th>Ход Игрока</th>
                    <th>Ход Контракта</th>
                    <th>Результат</th>
                    <th>Выигрыш (ETH)</th>
                  </tr>
                </thead>
                <tbody>
                  {gameHistory.map((game, index) => (
                    <tr key={index}>
                      <td>{game.player}</td>
                      <td>{game.playerMove}</td>
                      <td>{game.contractMove}</td>
                      <td>{game.win ? "Победа" : "Поражение"}</td>
                      <td>{game.amountWon}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      ) : (
        <button style={styles.connectButton} onClick={connectWallet}>
          Подключить кошелек
        </button>
      )}
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
    padding: "20px",
  },
  header: {
    fontSize: "2rem",
    marginBottom: "20px",
  },
  buttons: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginTop: "20px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    borderRadius: "5px",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  connectButton: {
    padding: "10px 20px",
    fontSize: "18px",
    cursor: "pointer",
    borderRadius: "5px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
  },
  loading: {
    color: "blue",
    marginTop: "20px",
  },
  message: {
    color: "green",
    marginTop: "20px",
  },
  historyContainer: {
    marginTop: "30px",
    textAlign: "left",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "10px",
  },
  th: {
    border: "1px solid #ddd",
    padding: "8px",
    textAlign: "left",
  },
  td: {
    border: "1px solid #ddd",
    padding: "8px",
  },
};

export default App;
