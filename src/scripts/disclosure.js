const dorts = document.querySelector('#dorts');
const drup = document.querySelector('#drup');
const dortsConfirm = document.querySelector('#dorts-confirmation');
const drupConfirm = document.querySelector('#drup-confirmation');
const agreeBtn = document.querySelector('#agree-btn');

function enableRadioInput() {
  const radioInput = document.getElementById(`${this.id}-confirmation`);

  radioInput.disabled = false;

  document.querySelector(`#${this.id} + .tooltip`).classList.add('hidden');
}

function updateAgreeBtnState() {
  if (!(dorts.disabled) && !(drup.disabled) && dortsConfirm.checked && drupConfirm.checked) {
    agreeBtn.classList.remove('disabled');
  }
}

dorts.addEventListener('click', enableRadioInput);
drup.addEventListener('click', enableRadioInput);
dortsConfirm.addEventListener('change', updateAgreeBtnState);
drupConfirm.addEventListener('change', updateAgreeBtnState);