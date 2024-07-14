import axios from 'axios';
const allUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all';
const countyNameUrl = 'https://studies.cs.helsinki.fi/restcountries/api/name/';

const getAll = () => {
  const request = axios.get(allUrl);
  return request.then(response => response.data);
};

const getCountry = country => {
  const address = `${countyNameUrl}${country}`;
  const request = axios.get(address);
  return request.then(response => response.data);
};

export default { getAll, getCountry };