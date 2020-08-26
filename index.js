const axios = require("axios");

//register for a free account at fixer.io for the API key
const FIXER_API_KEY = "";
const FIXER_API = `http://data.fixer.io/api/latest?access_key=${FIXER_API_KEY}`;

const REST_COUNTRIES_API = `https://restcountries.eu/rest/v2/currency`;

//Async/Await

//fetch data about currencies

const getExchangeRate = async (fromCurrency, toCurrency) => {
  try {
    const {
      data: { rates },
    } = await axios.get(FIXER_API);

    const euro = 1 / rates[fromCurrency];
    const exchangeRate = euro * rates[toCurrency];

    return exchangeRate;
  } catch (error) {
    throw new Error(`Unable to get currency ${fromCurrency} and ${toCurrency}`);
  }
};

//fetch data about countries

const getCountries = async (currencyCode) => {
  try {
    const { data } = await axios.get(`${REST_COUNTRIES_API}/${currencyCode}`);

    return data.map((country) => country.name);
  } catch (error) {
    throw new Error(`Unable to get countries which use ${currencyCode}`);
  }
};

//output data

const convertCurrency = async (fromCurrency, toCurrency, amount) => {
  fromCurrency = fromCurrency.toUpperCase();
  toCurrency = toCurrency.toUpperCase();

  const [exchangeRate, countries] = await Promise.all([
    getExchangeRate(fromCurrency, toCurrency),
    getCountries(toCurrency),
  ]);

  const convertedAmount = (amount * exchangeRate).toFixed(2);

  return `${amount} ${fromCurrency} is worth ${convertedAmount} ${toCurrency}.\nYou can spend these in the following countries: ${countries}.`;
};

convertCurrency("USD", "PHP", 20)
  .then((result) => console.log(result))
  .catch((error) => console.log(error));
