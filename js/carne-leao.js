(function () {
  const form = document.getElementById('cl-form');
  const resultCard = document.getElementById('cl-result');

  const FAIXAS = [
    { ate: 2428.80, aliquota: 0, deduzir: 0 },
    { ate: 2826.65, aliquota: 0.075, deduzir: 182.16 },
    { ate: 3751.05, aliquota: 0.15, deduzir: 394.16 },
    { ate: 4664.68, aliquota: 0.225, deduzir: 675.49 },
    { ate: Infinity, aliquota: 0.275, deduzir: 908.73 },
  ];

  function formatBRL(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function calcularImpostoTeto(baseCalculo) {
    if (baseCalculo <= 5000) return 0;
    const faixa = FAIXAS.find((f) => baseCalculo <= f.ate);
    const imposto = baseCalculo * faixa.aliquota - faixa.deduzir;
    return Math.max(imposto, 0);
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const ganhoMes = parseFloat(document.getElementById('ganhoMes').value);
    if (isNaN(ganhoMes) || ganhoMes <= 0) return;

    const parcelaIsenta = ganhoMes * 0.4;
    const baseTributavel = ganhoMes * 0.6;

    document.getElementById('clIsenta').textContent = formatBRL(parcelaIsenta);
    document.getElementById('clBase').textContent = formatBRL(baseTributavel);

    const semImposto = document.getElementById('clSemImposto');
    const comImposto = document.getElementById('clComImposto');

    if (baseTributavel <= 5000) {
      semImposto.hidden = false;
      comImposto.hidden = true;
    } else {
      const impostoTeto = calcularImpostoTeto(baseTributavel);
      document.getElementById('clImposto').textContent = formatBRL(impostoTeto);
      comImposto.hidden = false;
      semImposto.hidden = true;
    }

    resultCard.hidden = false;
    resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
})();
