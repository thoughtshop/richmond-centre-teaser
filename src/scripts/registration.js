import Cleave from 'cleave.js';
import 'cleave.js/dist/addons/cleave-phone.ca';

const cleavePhone = new Cleave('.input-phone', {
  phone: true,
  delimiter: '-',
  phoneRegionCode: 'CA'
});

const cleavePostal = new Cleave('.input-postal', {
  blocks: [3, 3],
  uppercase: true
});

$.validator.addMethod('valueMustEqual', (value, element, arg) => arg === value, 'Value must equal arg.');

$('#spark-registration-form').validate({
  rules: {
    'contact[first_name]': {
      required: true
    },
    'contact[last_name]': {
      required: true
    },
    'contact[email]': {
      required: true,
      email: true
    },
    'contact[postcode]': {
      required: true
    },
    'answers[4388][answers]': {
      required: true
    },
    'contact[date_of_birth]': {
      required: true
    },
    are_you_simulated: {
      valueMustEqual: ''
    },
    'answers[5184][answers]': {
      email: true
    }
  },
  errorPlacement: (error, element) => {
    if (element.attr('name') === 'answers[4388][answers]') {
      element.parents('.form-group').append(error);
    } else {
      error.insertAfter(element);
    }
  }
});

function hideRealtorDetails() {
  $("select[name='answers[4389][answers]']").val('No');
  $('#realtor-details').collapse('hide');
  $('input[name="answers[5184][answers]"]').rules('remove', 'required');
}

function hideAgentDetails() {
  $("select[name='agent']").val('false');
  $('#agent-details').collapse('hide');
  $('input[name="contact[postcode]"]').rules('add', {
    required: true
  });
}

function showRealtorDetails() {
  hideAgentDetails();

  $('#realtor-details').collapse('show');
  $('input[name="answers[5184][answers]"]').rules('add', {
    required: true
  });
}

function showAgentDetails() {
  hideRealtorDetails();

  $('#agent-details').collapse('show');
  $('input[name="contact[postcode]"]').rules('remove');
}

// handle 'are you working with a realtor?' question
$("select[name='answers[4389][answers]']").on('change', (e) => {
  if (e.currentTarget.value === 'Yes') {
    showRealtorDetails();
  } else {
    hideRealtorDetails();
  }
});

// handle 'are you a realtor?' question
$("select[name='agent']").on('change', (e) => {
  if (e.currentTarget.value === 'true') {
    showAgentDetails();
  } else {
    hideAgentDetails();
  }
});

$('.submit-btn').on('click', (e) => {
  e.preventDefault();
  // const formUrl = "https://spark.re/shape-marketing-corp/rc-1/register/rc1-registration";
  // form.attr("action", formUrl);

  if ($('#spark-registration-form').valid()) {
    const form = document.getElementById('spark-registration-form');
    const formData = new FormData(form);

    const fetchUrl = 'http://grid.thoughtshop.com/rc/assets/registration.php';

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
          document.location.href = $('input[name="redirect_success"]').val();
        }
      });
  }
});
