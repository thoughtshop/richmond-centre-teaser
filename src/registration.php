<?php

header("Access-Control-Allow-Origin: *");

$rest_json = file_get_contents("php://input");
$_POST = json_decode($rest_json, true);

if (empty($_POST['contact[email]'])) die();

if (isset($_POST)) {

	// set response code - 200OK
  // http_response_code(200);

  $sparkTask = array(
    "complete" => false,
    "success" => false
  );

  $newContact = array(
    'contact' => array(
      'agent' => false,
      'email' => $_POST['contact[email]'],
      'registration_source_assignment_attributes' => array(
        'name' => 'RC1 Web Registration'
      )
    )
  );

  if (isSetNotEmpty('contact[first_name]')) {
    $newContact['contact']['first_name'] = $_POST['contact[first_name]'];
  }

  if (isSetNotEmpty('contact[last_name]')) {
    $newContact['contact']['last_name'] = $_POST['contact[last_name]'];
  }

  if (isSetNotEmpty('contact[first_name]') && isSetNotEmpty('contact[last_name]')) {
    $newContact['contact']['full_name'] = $_POST['contact[first_name]'] . ' ' . $_POST['contact[last_name]'];
  }

  if (isSetNotEmpty('contact[phone]')) {
    $newContact['contact']['phone'] = $_POST['contact[phone]'];
  }

  if (isSetNotEmpty('contact[postcode]')) {
    $newContact['contact']['postcode'] = $_POST['contact[postcode]'];
  }

  if (isSetNotEmpty('answers[4387][answers]')) {
    $newContact['contact']['answer_attributes']['4387'] = array(
      'answers' => array($_POST['answers[4387][answers]'])
    );
  }

  if (isSetNotEmpty('answers[4388][answers]')) {
    $newContact['contact']['answer_attributes']['4388'] = array(
      'answers' => array('YES')
    );
  }

  if (isSetNotEmpty('agent') && $_POST['agent'] === 'true') {
    $newContact['contact']['agent'] = true;

    if (isset($_POST['contact[brokerage_name]'])) {
      $newContact['contact']['brokerage_name'] = $_POST['contact[brokerage_name]'];
    }
  }

  $sparkContact = createSparkContact($newContact);
  $sparkTask['contact'] = $sparkContact;

  if (isset($sparkContact->id)) {
    // create a realtor contact if registrant is working with a realtor
    if ( 
      isSetNotEmpty('answers[4389][answers]') 
      && $_POST['answers[4389][answers]'] === 'Yes'
      && isSetNotEmpty('answers[5184][answers]')
    ) {
      $realtorContact = array(
        'contact' => array(
          'agent' => true,
          'assigned_client_ids' => array($sparkContact->id),
          'email' => $_POST['answers[5184][answers]'],
          'registration_source_assignment_attributes' => array(
            'name' => 'RC1 Web Registration'
          )
        )
      );
  
      if (isSetNotEmpty('answers[5181][answers]')) {
        $realtorContact['contact']['first_name'] = $_POST['answers[5181][answers]'];
      }
    
      if (isSetNotEmpty('answers[5183][answers]')) {
        $realtorContact['contact']['last_name'] = $_POST['answers[5183][answers]'];
      }

      if (isSetNotEmpty('answers[5181][answers]') && isSetNotEmpty('answers[5183][answers]')) {
        $realtorContact['contact']['full_name'] = $_POST['answers[5181][answers]'] . ' ' . $_POST['answers[5183][answers]'];
      }
  
      if (isSetNotEmpty('answers[5182][answers]')) {
        $realtorContact['contact']['brokerage_name'] = $_POST['answers[5182][answers]'];
      }
  
      $sparkRealtorContact = createSparkContact($realtorContact);
      $sparkTask['realtor_contact'] = $sparkRealtorContact;

      if (isset($sparkRealtorContact->id)) {
        $sparkTask['success'] = true;
        $sparkTask['complete'] = true;
      } else {
        $sparkTask['complete'] = true;
      }
    }
    // otherwise we're finished
    else {
      $sparkTask['success'] = true;
      $sparkTask['complete'] = true;
    }
  } else {
    $sparkTask['complete'] = true;
  }

  echo json_encode($sparkTask);
}

function isSetNotEmpty($inputName) {
  if (isset($_POST[$inputName]) && !empty($_POST[$inputName])) {
    return true;
  }
  return false;
}

function createSparkContact($data) {
  $cURLConnection = curl_init();

  curl_setopt($cURLConnection, CURLOPT_URL, 'https://api.spark.re/v1/contacts');
  curl_setopt($cURLConnection, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($cURLConnection, CURLOPT_POST, true);
  curl_setopt($cURLConnection, CURLOPT_HTTPHEADER, array(
    'Authorization: Token token="6accefcfac005701ecc85ddd36c06c003f82737f"',
    'Content-Type: application/json'
  ));
  curl_setopt($cURLConnection, CURLOPT_POSTFIELDS, json_encode($data));

  $response = curl_exec($cURLConnection);
  curl_close($cURLConnection);

  $jsonResponse = json_decode($response);
  
  if ($jsonResponse->status == 'success' && !empty($jsonResponse->data->contact)) {
    return $jsonResponse->data->contact;
  } else {
    return $jsonResponse;
  }
}

function getSparkContact($email) {
  $cURLConnection = curl_init();

  $sparkURL = 'https://api.spark.re/v1/contacts?email=' . $email . '&limit=1';

  curl_setopt($cURLConnection, CURLOPT_URL, $sparkURL);
  curl_setopt($cURLConnection, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($cURLConnection, CURLOPT_HTTPHEADER, array(
    'Authorization: Token token="6accefcfac005701ecc85ddd36c06c003f82737f"'
  ));

  $response = curl_exec($cURLConnection);
  curl_close($cURLConnection);

  $jsonResponse = json_decode($response);

  if ($jsonResponse->status == 'success' && !empty($jsonResponse->data->contacts)) {
    return $jsonResponse->data->contacts[0];
  } else {
    return $jsonResponse;
  }
}