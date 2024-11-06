document.addEventListener('DOMContentLoaded', async () => {
    try {
      const response = await fetch('http://localhost:8000/api/tickers');
      const tickers = await response.json();
  
      const tbody = document.querySelector('#tickers tbody');
      tickers.forEach((ticker, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${index + 1}</td>
          <td>${ticker.name}</td>
          <td>₹ ${ticker.last}</td>
          <td>₹ ${ticker.buy} / ₹ ${ticker.sell}</td>
          <td>${(ticker.sell - ticker.buy).toFixed(2)}%</td>
          <td>₹ ${(ticker.sell - ticker.buy).toFixed(2)}</td>
        `;
        tbody.appendChild(row);
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  });
  