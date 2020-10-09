<?php

$rest_json = file_get_contents("php://input");
$_POST = json_decode($rest_json, true);

if (empty($_POST['contact[email]'])) die();

if (isset($_POST)) {
  $sparkTask = array(
    "complete" => false,
    "success" => false
  );

  $date = date('Y-m-d');

  $newContact = array(
    'contact' => array(
      'email' => $_POST['contact[email]'],
      'registration_source_assignment_attributes' => array(
        'name' => 'RECBC Form'
      ),
      'answer_attributes' => array(
        '7406' => array(
          'answers' => array($date)
        ),
        '7407' => array(
          'answers' => array($date)
        )
      )
    )
  );

  $sparkContact = createSparkContact($newContact);
  $sparkTask['contact'] = $sparkContact;

  if (isset($sparkContact->id)) {
    $sparkTask['success'] = true;
    $sparkTask['complete'] = true;
  } else {
    $sparkTask['complete'] = true;
  }

  echo json_encode($sparkTask);
}

function createSparkContact($data) {
  $cURLConnection = curl_init();

  curl_setopt($cURLConnection, CURLOPT_URL, 'https://api.spark.re/v1/contacts');
  curl_setopt($cURLConnection, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($cURLConnection, CURLOPT_POST, true);
  curl_setopt($cURLConnection, CURLOPT_HTTPHEADER, array(
    'Authorization: Token token="3ca00c07530612331fa34aad6ea423396cbc7797"',
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