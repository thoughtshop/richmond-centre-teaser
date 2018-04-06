import Flickity from 'flickity';
import 'slick-carousel';

import Cleave from 'cleave.js';
import 'cleave.js/dist/addons/cleave-phone.ca';

var cleavePhone = new Cleave('.input-phone', {
  phone: true,
  delimiter: '-',
  phoneRegionCode: 'CA'
});

var cleavePostal = new Cleave('.input-postal', {
  blocks: [3, 3],
  uppercase: true
});

$('.callout').popover({
  trigger: 'hover',

});

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
    }
  }
});

var formUrl = "https://spark.re/shape-marketing-corp/rc-1/register/rc1-registration";

$(function() {
  var useJS = $('html').hasClass('js');
  
  if (useJS) {
    $("#spark-registration-form").attr("action", formUrl);
  }

  let flickity = new Flickity('.carousel', {
    autoPlay: false,
    pageDots: true,
    wrapAround: true
  });
});