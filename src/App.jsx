import React, { useEffect, useState } from "react";
import CurrencyConverter from "./Components/CurrencyConverter";
import "./index.css";

let BASE_URL =
  "http://api.exchangeratesapi.io/v1/latest?access_key=7cfc74c4a107114cd7273010b9473388&symbols=USD,AUD,CAD,PLN,MXN&format=1";

const App = () => {
  let [currencyOption, setCurrencyOption] = useState([]);
  let [fromCurrency, setFromCurrency] = useState();
  let [toCurrency, setToCurrency] = useState();
  let [exchangeRate, setExchangeRate] = useState();
  let [amount, setAmount] = useState(1);
  let [amountInFromCurrency, setAmountInFromCurrency] = useState(true);

  let toAmount, fromAmount;
  if (amountInFromCurrency) {
    fromAmount = amount;
    toAmount = amount * exchangeRate;
  } else {
    toAmount = amount;
    fromAmount = amount / exchangeRate;
  }

  console.log(currencyOption);
  console.log(exchangeRate);
  useEffect(() => {
    fetch(BASE_URL)
      .then(res => res.json())
      .then(data => {
        let firstCurrency = Object.keys(data.rates)[0];
        setCurrencyOption([data.base, ...Object.keys(data.rates)]);
        setFromCurrency(data.base);
        setToCurrency(firstCurrency);
        setExchangeRate(data.rates[firstCurrency]);
      });
  }, []);

  useEffect(() => {
    if (fromCurrency != null && toCurrency != null) {
      fetch(`${BASE_URL}?base=${fromCurrency}&symbols=${toCurrency}`)
        .then(res => res.json())
        .then(data => setExchangeRate(data.rates[toCurrency]));
    }
  }, []);

  function handleFromAmountChange(e) {
    setAmount(e.target.value);
    setAmountInFromCurrency(true);
  }
  function handleToAmountChange(e) {
    setAmount(e.target.value);
    setAmountInFromCurrency(false);
  }
  return (
    <div>
      <h1>Convert Currency</h1>
      <CurrencyConverter
        currencyOption={currencyOption}
        selectedCurrency={fromCurrency}
        onChangeCurrency={e => setFromCurrency(e.target.value)}
        onChangeAmount={handleFromAmountChange}
        amount={fromAmount}
      />
      <div className="equals">=</div>
      <CurrencyConverter
        currencyOption={currencyOption}
        selectedCurrency={toCurrency}
        onChangeCurrency={e => setToCurrency(e.target.value)}
        onChangeAmount={handleToAmountChange}
        amount={toAmount}
      />
    </div>
  );
};

export default App;
