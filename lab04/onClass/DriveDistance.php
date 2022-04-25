<!doctype html>
<html>

<head>
  <title>Distance from Chicago!</title>
</head>

<body>
  <h1>Welcome to the Distance Calculator</h1>
  <p>This page calculates the distance from Chicago.</p>
  <hr>
  <form action="CheckDistance.php" method="POST">
    <label for="destination">Select a destination</label><br>
    <select name="destination[]" size=5 multiple class="select">
      <?php
      $destination = array("Boston", "Dallas", "Miami", "Nashville", "Las Vegas", "Pittsburgh", "San Francisco", "Toronto", "Washington, DC");
      print "<div>Please indicate all your favorite dishes.</div>";
      for ($i = 0; $i < count($destination); $i++) {
        print "<option value=$destination[$i]> $destination[$i] </option>";
      }
      ?>
    </select>
    <br>
    <input type="submit" value="Submit">
    <input type="reset" value="Reset">
  </form>
</body>

</html>