(function () {
  "use strict";

  var lastRates = { eurusd: 1.0872, gbpusd: 1.2634, dax: 18247 };
  var clockEl = document.getElementById('ticker-clock');
  if (!clockEl && !document.getElementById('row-eurusd')) return;

  function updateClock() {
    if (clockEl) clockEl.textContent = new Date().toLocaleTimeString('de-DE');
  }

  function flashRow(rowId) {
    var row = document.getElementById(rowId);
    if (!row) return;
    row.classList.remove('updated');
    void row.offsetWidth;
    row.classList.add('updated');
  }

  function applyChange(priceId, changeId, rowId, oldVal, newVal, decimals) {
    var priceEl = document.getElementById(priceId);
    var changeEl = document.getElementById(changeId);
    if (!priceEl || !changeEl) return;
    var pct = oldVal ? ((newVal - oldVal) / oldVal) * 100 : 0;
    priceEl.textContent = newVal.toFixed(decimals);
    changeEl.textContent = (pct >= 0 ? '+' : '') + pct.toFixed(2) + '%';
    changeEl.classList.remove('up', 'down', 'flat');
    changeEl.classList.add(pct > 0.001 ? 'up' : pct < -0.001 ? 'down' : 'flat');
    flashRow(rowId);
  }

  function simulateStep() {
    var newEurUsd = lastRates.eurusd + (Math.random() - 0.5) * 0.0004;
    var newGbpUsd = lastRates.gbpusd + (Math.random() - 0.5) * 0.0004;
    var newDax = lastRates.dax + (Math.random() - 0.5) * 12;

    applyChange('price-eurusd', 'change-eurusd', 'row-eurusd', lastRates.eurusd, newEurUsd, 4);
    applyChange('price-gbpusd', 'change-gbpusd', 'row-gbpusd', lastRates.gbpusd, newGbpUsd, 4);
    applyChange('price-dax', 'change-dax', 'row-dax', lastRates.dax, newDax, 0);

    lastRates = { eurusd: newEurUsd, gbpusd: newGbpUsd, dax: newDax };
  }

  async function fetchRates() {
    try {
      var res = await fetch('https://api.frankfurter.dev/v1/latest?from=EUR&to=USD,GBP');
      if (!res.ok) throw new Error('bad response');
      var data = await res.json();
      var newEurUsd = data.rates && data.rates.USD ? data.rates.USD : lastRates.eurusd;
      var newGbpUsd = data.rates && data.rates.GBP ? (1 / data.rates.GBP) : lastRates.gbpusd;
      applyChange('price-eurusd', 'change-eurusd', 'row-eurusd', lastRates.eurusd, newEurUsd, 4);
      applyChange('price-gbpusd', 'change-gbpusd', 'row-gbpusd', lastRates.gbpusd, newGbpUsd, 4);
      lastRates.eurusd = newEurUsd;
      lastRates.gbpusd = newGbpUsd;
      /* DAX bleibt simuliert (klar gekennzeichnet) */
      var newDax = lastRates.dax + (Math.random() - 0.5) * 12;
      applyChange('price-dax', 'change-dax', 'row-dax', lastRates.dax, newDax, 0);
      lastRates.dax = newDax;
    } catch (err) {
      simulateStep();
    }
    updateClock();
  }

  updateClock();
  fetchRates();
  setInterval(fetchRates, 5000);
  setInterval(updateClock, 1000);
})();
