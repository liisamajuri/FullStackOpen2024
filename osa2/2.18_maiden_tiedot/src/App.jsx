import { useState, useEffect } from 'react'
import Filter from './components/Filter';
import Countries from './components/Countries';
import countriesService from './services/countries'

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')


  useEffect(() => {
    countriesService
      .getAll()
        .then(allCountriesData => {
          setCountries(allCountriesData)
      })
  }, [])

  if (!countries) { 
    return null 
  }

  console.log('Render', countries.length, 'countries')


  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }
  
  const countriesToShow = filter === ''
    ? []
    : countries.filter(country =>
        country.name.common.toLowerCase().includes(filter.toLowerCase())
      );


  return (
    <div>
      <h2>Country search</h2>
  
      <Filter filter={filter} handleFilterChange={handleFilterChange} />

      {countriesToShow.length > 10 ? (
        <p>Too many matches, specify another filter</p>
      ) : (
        <Countries countries={countriesToShow} />
      )}
    </div>
  );
}


export default App