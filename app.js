const $ = (s) => document.querySelector(s);
$('#year').textContent = new Date().getFullYear();

$('#menuToggle').addEventListener('click', () => {
  const nav = $('#nav');
  nav.classList.toggle('open');
  $('#menuToggle').setAttribute('aria-expanded', nav.classList.contains('open'));
});
$('#nav').querySelectorAll('a').forEach(a => a.addEventListener('click', () => $('#nav').classList.remove('open')));

// Planejador local: as tarefas ficam apenas nesta sessão do navegador.
$('#addTask').addEventListener('click', addTask);
$('#taskInput').addEventListener('keydown', e => { if (e.key === 'Enter') addTask(); });
function addTask() {
  const input = $('#taskInput');
  const value = input.value.trim();
  if (!value) return;
  const list = $('#taskList');
  if (list.querySelector('.empty')) list.innerHTML = '';
  const li = document.createElement('li');
  const check = document.createElement('input');
  check.type = 'checkbox';
  const label = document.createElement('span');
  label.textContent = value;
  check.addEventListener('change', () => { label.style.textDecoration = check.checked ? 'line-through' : 'none'; });
  li.append(check, label);
  list.append(li);
  input.value = '';
}

// Questionário reflexivo sem pontuação diagnóstica.
const prompts = [
  'Tenho dificuldade para organizar etapas de uma tarefa.',
  'Às vezes me distraio antes de concluir o que comecei.',
  'Esqueço compromissos ou coisas importantes do cotidiano.',
  'Sinto dificuldade para estimar quanto tempo uma atividade levará.'
];
const choices = ['Nunca ou raramente', 'Às vezes', 'Frequentemente'];
$('#quizOpen').addEventListener('click', () => {
  $('#quizQuestions').innerHTML = prompts.map((q,i) => `<div class="question"><p>${i+1}. ${q}</p><select aria-label="${q}" data-q="${i}"><option value="">Selecione uma resposta</option>${choices.map((c,j)=>`<option value="${j}">${c}</option>`).join('')}</select></div>`).join('');
  $('#quizSummary').innerHTML = '';
  $('#quizModal').classList.add('open');
  $('#quizModal').setAttribute('aria-hidden','false');
});
function closeQuiz(){ $('#quizModal').classList.remove('open'); $('#quizModal').setAttribute('aria-hidden','true'); }
$('#quizClose').addEventListener('click', closeQuiz);
$('#quizModal').addEventListener('click', e => { if (e.target === $('#quizModal')) closeQuiz(); });
$('#quizResult').addEventListener('click', () => {
  const selects = [...$('#quizQuestions').querySelectorAll('select')];
  const answered = selects.filter(s => s.value !== '').length;
  $('#quizSummary').innerHTML = `<div class="quiz-result">${answered < prompts.length ? `Você respondeu ${answered} de ${prompts.length} perguntas. ` : 'Você concluiu a reflexão. '}Use suas respostas apenas como ponto de partida para observar hábitos. Se dificuldades persistentes estiverem afetando sua rotina, converse com um responsável de confiança e procure orientação de um profissional habilitado. Este recurso não interpreta resultados nem identifica TDAH.</div>`;
});

$('#buyButton').addEventListener('click', async () => {
  const button = $('#buyButton');
  const msg = $('#checkoutMessage');
  button.disabled = true; button.textContent = 'Preparando checkout…';
  try {
    const response = await fetch('/api/create-checkout', {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({productId:'planner'})
    });
    const data = await response.json();
    if (!response.ok || !data.checkoutUrl) throw new Error(data.error || 'Checkout indisponível.');
    window.location.href = data.checkoutUrl;
  } catch (err) {
    msg.textContent = err.message + ' O site ainda está em configuração/teste.';
    button.disabled = false; button.textContent = 'Tentar novamente ↗';
  }
});

$('#newsletterForm').addEventListener('submit', e => {
  e.preventDefault();
  $('#newsletterMessage').textContent = 'Demonstração: o cadastro ainda não está conectado a um serviço de e-mail.';
});
const paymentState = new URLSearchParams(location.search).get('pagamento');
if (paymentState) {
  const messages = {
    sucesso: 'Você retornou do checkout. A confirmação real depende da consulta do pagamento no servidor.',
    falhou: 'O pagamento não foi concluído. Você pode tentar novamente.',
    pendente: 'Pagamento pendente. Aguarde a confirmação do provedor.'
  };
  $('#checkoutMessage').textContent = messages[paymentState] || '';
}
