(function () {
  "use strict";

  var ESMA_LEVERAGE = { 'DAX': 20, 'EUR/USD': 30, 'Gold': 20, 'Bitcoin': 2, 'Einzelaktie': 5 };
  var instrumentEl = document.getElementById('instrument');
  var positionEl = document.getElementById('position');
  var hebelEl = document.getElementById('hebel');
  var resMargin = document.getElementById('res-margin');
  var resPuffer = document.getElementById('res-puffer');
  var resTotal = document.getElementById('res-total');

  if (!instrumentEl || !positionEl || !hebelEl || !resMargin || !resPuffer || !resTotal) return;

  function formatEUR(n) {
    return n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
  }

  function calculate() {
    var position = parseFloat(positionEl.value) || 0;
    var hebel = parseFloat(hebelEl.value) || 1;
    var margin = position / hebel;
    var puffer = margin * 3;
    var minKapital = margin + puffer;

    resMargin.textContent = formatEUR(margin);
    resPuffer.textContent = formatEUR(puffer);
    resTotal.textContent = formatEUR(minKapital);
  }

  instrumentEl.addEventListener('change', function () {
    hebelEl.value = ESMA_LEVERAGE[instrumentEl.value] || 1;
    calculate();
  });
  positionEl.addEventListener('input', calculate);
  hebelEl.addEventListener('input', calculate);
  calculate();
})();
