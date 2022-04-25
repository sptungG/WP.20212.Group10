<!doctype html>
<html>

<head>
  <title>Distance and Time Calculations</title>
</head>

<body>
  <?php
  $cities = array(
    'Dallas' => 803,
    'Toronto' => 435,
    'Boston' => 848,
    'Nashville' => 406,
    'Las Vegas' => 1526,
    'San Francisco' => 1835,
    'Washington, DC' => 595,
    'Miami' => 1189,
    'Pittsburgh' => 409
  );
  if (array_key_exists("destination", $_POST)) {
    $destination = $_POST["destination"];
  }
  function calcDriveTime($ct, $dest)
  {
    return round(($ct[$dest] / 60), 2);
  }
  function calcWalkTime($ct, $dest)
  {
    return round(($ct[$dest] / 5), 2);
  }
  ?>
  <font color="blue" size="+2">Distance table from <strong>Chicago</strong><br></font>
  <table border=3>
    <thead>
      <th>No.</th>
      <th>Destination</th>
      <th>Distance</th>
      <th>Driving time</th>
      <th>Walking time</th>
    </thead>
    <?php
    $i = 1;
    if (isset($destination)) {
      foreach ($destination as $dest) {
        // $dest = $destination[$i];
        print "<tr><td>" .  (int)$i . "</td>";
        if (isset($cities[$dest])) {
          print "<td>$dest</td>";
          print "<td>$cities[$dest]km</td>";
          print "<td>" . calcDriveTime($cities, $dest) . "h</td>";
          print "<td>" . calcWalkTime($cities, $dest) . "h</td></tr>";
        }
        $i++;
      }
    } else {
      print "<tr><td colspan=5>No city selected!</td></tr>"; //colspan to merge cells into 1 cell
    }
    ?>
  </table>
</body>

</html>