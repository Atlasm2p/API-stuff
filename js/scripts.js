async function getData(countryCode) {
  const indicators = {
    gdp: 'NY.GDP.MKTP.CD',
    population: 'SP.POP.TOTL'
  };

  const urls = [
    `https://api.worldbank.org/v2/country/${countryCode}/indicator/${indicators.gdp}?format=json&date=2022`,
    `https://api.worldbank.org/v2/country/${countryCode}/indicator/${indicators.population}?format=json&date=2022`
  ];

  const [gdpRes, popRes] = await Promise.all(urls.map(url => fetch(url)));
  const gdpData = await gdpRes.json();
  const popData = await popRes.json();

  const gdp = gdpData[1]?.[0]?.value || 'N/A';
  const population = popData[1]?.[0]?.value || 'N/A';
  const country = gdpData[1]?.[0]?.country.value || countryCode.toUpperCase();

  return { country, gdp, population };
}

document.getElementById('searchBtn').addEventListener('click', async () => {
  const code = document.getElementById('countryInput').value.trim();
  const resultDiv = document.getElementById('result');

  if (!code) {
    resultDiv.innerHTML = '<p>Please enter a country code.</p>';
    return;
  }

  resultDiv.innerHTML = '<p>Loading...</p>';

  try {
    const data = await getData(code);
    resultDiv.innerHTML = `
      <h3>${data.country}</h3>
      <p><strong>GDP (USD):</strong> ${data.gdp.toLocaleString()}</p>
      <p><strong>Population:</strong> ${data.population.toLocaleString()}</p>
    `;
  } catch (err) {
    resultDiv.innerHTML = '<p>Error fetching data. Please try again.</p>';
  }
});
