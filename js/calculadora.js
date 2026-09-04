(function () {
  const form = document.getElementById('calc-form');
  const resultCard = document.getElementById('result');

  function toNumber(id) {
    const el = document.getElementById(id);
    const value = parseFloat(el.value);
    return isNaN(value) ? 0 : value;
  }

  function formatBRL(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const ganhoBruto = toNumber('ganhoBruto');
    const horas = toNumber('horas');
    const km = toNumber('km');
    const precoCombustivel = toNumber('precoCombustivel');
    const consumo = toNumber('consumo');
    const manutencao = toNumber('manutencao');
    const seguro = toNumber('seguro');
    const kmMes = toNumber('kmMes');
    const valorCarro = toNumber('valorCarro');

    if (horas <= 0 || km <= 0 || consumo <= 0 || kmMes <= 0) {
      return;
    }

    const gastoCombustivel = (km / consumo) * precoCombustivel;

    const custosFixosMes = manutencao + seguro;
    const custoFixoPeriodo = (custosFixosMes / kmMes) * km;

    const DEPRECIACAO_ANUAL = 0.15;
    const depreciacaoMensal = (valorCarro * DEPRECIACAO_ANUAL) / 12;
    const depreciacaoPeriodo = (depreciacaoMensal / kmMes) * km;

    const ganhoLiquido = ganhoBruto - gastoCombustivel - custoFixoPeriodo - depreciacaoPeriodo;

    const ganhoPorHora = ganhoLiquido / horas;
    const ganhoPorKm = ganhoLiquido / km;

    document.getElementById('resHora').textContent = formatBRL(ganhoPorHora);
    document.getElementById('resKm').textContent = formatBRL(ganhoPorKm);

    document.getElementById('rBruto').textContent = formatBRL(ganhoBruto);
    document.getElementById('rComb').textContent = '- ' + formatBRL(gastoCombustivel);
    document.getElementById('rFixos').textContent = '- ' + formatBRL(custoFixoPeriodo);
    document.getElementById('rDeprec').textContent = '- ' + formatBRL(depreciacaoPeriodo);
    document.getElementById('rLiquido').textContent = formatBRL(ganhoLiquido);

    const note = document.getElementById('resultNote');
    if (ganhoLiquido < 0) {
      note.textContent = 'Atenção: no período informado, seus custos foram maiores que o ganho bruto. Vale revisar suas corridas e custos com atenção.';
    } else if (valorCarro <= 0) {
      note.textContent = 'Dica: informe o valor do seu carro para incluir a depreciação e ver o número mais realista possível.';
    } else {
      note.textContent = 'Esse valor considera combustível, manutenção, seguro e depreciação estimada do carro.';
    }

    resultCard.hidden = false;
    resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  const leadForm = document.getElementById('lead-form');
  if (leadForm) {
    leadForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const emailInput = leadForm.querySelector('input[name="email"]');

      fetch(leadForm.action, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(leadForm)
      }).catch(function () {
        // Envio ao endpoint de e-mail marketing é melhor-esforço;
        // a confirmação visual não depende dele.
      });

      try {
        localStorage.setItem('meuganhoreal_lead_email', emailInput.value);
      } catch (e) {}

      leadForm.hidden = true;
      document.getElementById('leadNote').hidden = false;
    });
  }
})();
