const dorts = document.querySelector('#dorts');
const drup = document.querySelector('#drup');
const dortsConfirm = document.querySelector('#dorts-confirmation');
const drupConfirm = document.querySelector('#drup-confirmation');
const agreeBtn = document.querySelector('#agree-btn');

function enableRadioInput() {
  const radioInput = document.getElementById(`${this.id}-confirmation`);

  radioInput.disabled = false;

  const tooltipSelector = `#${this.id} + .tooltip`;

  document.querySelector(tooltipSelector).classList.add('hidden');
}

function checkAgreeBtnState() {
  if (!(dorts.disabled) && !(drup.disabled) && dortsConfirm.checked && drupConfirm.checked) {
    agreeBtn.classList.remove('disabled');
  }
}

dorts.addEventListener('click', enableRadioInput);
drup.addEventListener('click', enableRadioInput);
dortsConfirm.addEventListener('change', checkAgreeBtnState);
drupConfirm.addEventListener('change', checkAgreeBtnState);
