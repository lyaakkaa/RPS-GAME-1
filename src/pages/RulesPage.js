import React from "react";
import "./RulesPage.css";

const RulesPage = () => {
  return (
    <div className="rules-container">
      <div className="rules-image">
        <img src="/assets/giphy.gif" alt="Game Rules" />
      </div>
      <h2 className="rules-title">Правила игры</h2>
      <div className="rules-content">
        <p>
          Добро пожаловать в игру <strong>Камень, Бумага, Ножницы</strong>! Это
          классическая игра, адаптированная для блокчейн-платформы.
        </p>
        <h3>Основные правила:</h3>
        <ul>
          <li>
            Выберите один из трех вариантов: <strong>Камень</strong>,{" "}
            <strong>Бумага</strong> или <strong>Ножницы</strong>.
          </li>
          <li>
            Ставка для участия составляет <strong>0.0001 ETH</strong>.
          </li>
          <li>Ваш выбор сравнивается с выбором контракта.</li>
        </ul>
        <h3>Результаты игры:</h3>
        <ul>
          <li>Если вы выигрываете, ваш выигрыш удваивается (x2).</li>
          <li>В случае ничьей ставка возвращается.</li>
          <li>Если вы проигрываете, ваша ставка остается в контракте.</li>
        </ul>
        <h3>Как играть:</h3>
        <ol>
          <li>Подключите свой кошелек MetaMask.</li>
          <li>Выберите ход: Камень, Бумага или Ножницы.</li>
          <li>
            Следите за результатом, который отображается сразу после игры.
          </li>
        </ol>
        <p>
          Удачи! Пусть удача будет на вашей стороне, а стратегия приведет вас к
          победе!
        </p>
      </div>
    </div>
  );
};

export default RulesPage;
