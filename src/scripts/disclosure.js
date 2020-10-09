const dorts = document.querySelector('#dorts');
const drup = document.querySelector('#drup');
const dortsConfirm = document.querySelector('#dorts-confirmation');
const drupConfirm = document.querySelector('#drup-confirmation');
const emailInput = document.querySelector('input[name="contact[email]"]');
const agreeBtn = document.querySelector('#agree-btn');

function enableRadioInput() {
  const radioInput = document.getElementById(`${this.id}-confirmation`);

  radioInput.disabled = false;

  document.querySelector(`#${this.id} + .tooltip`).classList.add('hidden');
}

function isEmailValid() {
  if (emailInput.value !== '' && /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(emailInput.value)) return true;

  return false;
}

function updateAgreeBtnState() {
  if (
    !dorts.disabled
    && !drup.disabled
    && dortsConfirm.checked
    && drupConfirm.checked
    && isEmailValid()
  ) {
    agreeBtn.classList.remove('disabled');
  }
}

dorts.addEventListener('click', enableRadioInput);
drup.addEventListener('click', enableRadioInput);
dortsConfirm.addEventListener('change', updateAgreeBtnState);
drupConfirm.addEventListener('change', updateAgreeBtnState);
emailInput.addEventListener('change', updateAgreeBtnState);

$('#disclosure-form').validate({
  rules: {
    'dorts-confirmation': 'required',
    'drup-confirmation': 'required',
    'contact[email]': {
      required: true,
      email: true
    }
  },
  errorPlacement: (error, element) => {
    if (element.attr('type') === 'radio') {
      element.parents('.disclosure-check-item').append(error);
    } else {
      error.insertAfter(element);
    }
  }
});

$('#agree-btn').on('click', (e) => {
  e.preventDefault();

  if ($('#disclosure-form').valid()) {
    const form = document.getElementById('disclosure-form');
    const formData = new FormData(form);

    const fetchUrl = 'assets/disclosure.php';

    fetch(fetchUrl, {
      method: 'POST',
      body: JSON.stringify(Object.fromEntries(formData.entries())),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          document.location.href = 'https://app.acuityscheduling.com/schedule.php?owner=18897016&appointmentType=16952235';
        }
      });
  }
});
