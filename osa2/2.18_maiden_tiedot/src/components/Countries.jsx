const Country = ({ country }) => {
  return (
    <p key={country.name.common}>
      {country.name.common}
    </p>
  );
};

const CountryDetails = ({ country }) => {
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
    </div>
  );
};

const Countries = ({ countries }) => {
  if (countries.length === 1) {
    return <CountryDetails country={countries[0]} />;
  }

  return (
    <div>
      {countries.map(country => (
        <Country key={country.name.common} country={country} />
      ))}
    </div>
  );
};

export default Countries;