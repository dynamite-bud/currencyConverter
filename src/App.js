import React, { useEffect, useState } from 'react';
import './App.css';
import CurrencyRow from './CurrencyRow'

const BASE_URL = 'https://api.exchangeratesapi.io/latest'



function App() {
  const [currencyOptions, setCurrencyOptions] = useState([])
  const [fromCurrency, setFromCurrency] = useState('AED')
  const [toCurrency, setToCurrency] = useState('AED')
  const [exchangeRate, setExchangeRate] = useState(1.0)
  const [amount, setAmount] = useState(1)
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true)
  const [paymentHistory, setPaymentHistory] = useState([])


  let toAmount=0, fromAmount=0;
  if (amountInFromCurrency) {
    fromAmount = amount
    toAmount = amount * exchangeRate
  } else {
    toAmount = amount
    fromAmount = amount / exchangeRate
  }

  useEffect(() => {
    fetch('https://openexchangerates.org/api/currencies.json')
      .then(res => res.json())
      .then(data => {
        const firstCurrency = Object.keys(data)[0]
        setCurrencyOptions([...Object.keys(data)])
        setFromCurrency('AED')
        setToCurrency(firstCurrency)
        setExchangeRate(1.0)
      })
  }, [])

  useEffect(() => {
    if (fromCurrency != null && toCurrency != null) {
      fetch(`http://localhost:8080/convert/${fromCurrency}/${toCurrency}/`)
        .then(res => res.json())
        .then(data => {setExchangeRate(parseFloat(data))})
    }
  }, [fromCurrency, toCurrency])

  function handleFromAmountChange(e) {
    setAmount(e.target.value)
    setPaymentHistory((oldPayments)=>[...oldPayments,<br/>,`${fromAmount} ${fromCurrency} -> ${toAmount} ${toCurrency}`]);
    setAmountInFromCurrency(true)
  }

  function handleToAmountChange(e) {
    setAmount(e.target.value)
    setPaymentHistory((oldPayments)=>[`${toAmount} ${toCurrency} -> ${fromAmount} ${fromCurrency}`,<br/>,...oldPayments]);
    setAmountInFromCurrency(false)
  }

  const ColoredLine = ({ color }) => (
    <hr
        style={{
            color: color,
            backgroundColor: color,
            height: 5
        }}
    />
  );

  return (
    <>
      <h1>Convert</h1>
      <CurrencyRow
        currencyOptions={currencyOptions}
        selectedCurrency={fromCurrency}
        onChangeCurrency={e => setFromCurrency(e.target.value)}
        onChangeAmount={handleFromAmountChange}
        amount={fromAmount}
      />
      <div className="equals">=</div>
      <CurrencyRow
        currencyOptions={currencyOptions}
        selectedCurrency={toCurrency}
        onChangeCurrency={e => setToCurrency(e.target.value)}
        onChangeAmount={handleToAmountChange}
        amount={toAmount}
      />
      <br/>
      <h2>Payment History</h2>
      <ColoredLine color="black"/>
      <h2>From-------->To</h2>
      <p>{paymentHistory}</p>
    </>
  );
}

export default App;