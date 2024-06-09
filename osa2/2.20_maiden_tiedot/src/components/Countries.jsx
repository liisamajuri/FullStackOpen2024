import { useEffect, useState } from 'react';
import axios from 'axios';

const Country = ({ country, handleShowCountry }) => {
  return (
    <p key={country.name.common}>
      {country.name.common}
      <button onClick={() => handleShowCountry(country)}>show</button>
    </p>
  );
};

const CountryDetails = ({ country }) => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const api_key = import.meta.env.VITE_SOME_KEY;
    const capital = country.capital[0];
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}&units=metric`;

    axios.get(url)
      .then(response => {
        setWeather(response.data);
      });
  }, [country]);  

  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>Capital: {country.capital}</p>
      <p>Area: {country.area}</p>
      <h3>Languages:</h3>
      <ul>
        {Object.values(country.languages).map(language => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt={`Flag of ${country.name.common}`} />

      {weather && (
        <div>
          <h3>Weather in {country.capital}</h3>
          <p>Temperature: {weather.main.temp} Celsius</p>
          <img
            src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={`Weather icon for ${weather.weather[0].description}`}
          />
          <p>Wind: {weather.wind.speed} m/s</p>
        </div>
      )}
    </div>
  );
};

const Countries = ({ countries, handleShowCountry, selectedCountry }) => {
  if (selectedCountry) {
    return <CountryDetails country={selectedCountry} />;
  }

  if (countries.length === 1) {
    return <CountryDetails country={countries[0]} />;
  }

  return (
    <div>
      {countries.map(country => (
        <Country key={country.name.common} country={country} handleShowCountry={handleShowCountry} />
      ))}
    </div>
  );
};

export default Countries;