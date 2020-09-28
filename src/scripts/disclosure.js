let dorts = document.querySelector('#dorts'),
    drup = document.querySelector('#drup'),
    dortsConfirm = document.querySelector('#dorts-confirmation'),
    drupConfirm = document.querySelector('#drup-confirmation'),
    agreeBtn = document.querySelector('#agree-btn');

function enableRadioInput() {
  let radioInput = document.getElementById(this.id + '-confirmation')

  radioInput.disabled = false
  radioInput.classList.add('enabled')

  let tooltipSelector = '#' + this.id + ' + .tooltip'

  document.querySelector(tooltipSelector).classList.add('hidden')
}

function checkAgreeBtnState() {
  if (!(dorts.disabled) && !(drup.disabled) && dortsConfirm.checked === true && drupConfirm.checked === true) {
    agreeBtn.classList.add('enabled')
  }
}

dorts.addEventListener('click', enableRadioInput)
drup.addEventListener('click', enableRadioInput)
dortsConfirm.addEventListener('change', checkAgreeBtnState)
drupConfirm.addEventListener('change', checkAgreeBtnState)
