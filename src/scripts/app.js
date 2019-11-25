import 'intersection-observer'
import Rellax from 'rellax'
import Cleave from 'cleave.js'
import 'cleave.js/dist/addons/cleave-phone.ca'
import forEach from 'lodash/forEach'

const cleavePhone = new Cleave('.input-phone', {
  phone: true,
  delimiter: '-',
  phoneRegionCode: 'CA'
})

const cleavePostal = new Cleave('.input-postal', {
  blocks: [3, 3],
  uppercase: true
})

$.validator.addMethod("valueMustEqual", function(value, element, arg){
  return arg == value;
}, "Value must equal arg.");

$('#spark-registration-form').validate({
  rules: {
    'contact[first_name]': {
      required: true,
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
    'contact[date_of_birth]':{
      required: true
    },
    'are_you_simulated': {
      valueMustEqual: ''
    }
  },
  errorPlacement: (error, element) => {
    if (element.attr("name") === "answers[4388][answers]") {
      element.parents('.form-group').append(error)
    } else {
      error.insertAfter(element);
    }
  }
})

$("select[name='answers[4389][answers]']").on("change", (e) => {
  console.log('change')
  if (e.currentTarget.value === "Yes") {
    $("#realtor-details").collapse("show");
  } else {
    $("#realtor-details").collapse("hide");
  }
})

const sections = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver(sections => {
  forEach(sections, section => {
    if (section.isIntersecting) {
      section.target.classList.add('in-viewport')
    }
  })
}, {
  threshold: 0.4
})

forEach(sections, section => {
  observer.observe(section);
})

$(() => {

  const useJS = $('html').hasClass('js');

  if (useJS) {
    const formUrl = "https://spark.re/shape-marketing-corp/rc-1/register/rc1-registration";
    $("#spark-registration-form").attr("action", formUrl);
  }

  const rellax = new Rellax('.rellax');
})


