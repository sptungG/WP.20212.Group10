<html>

<head>
  <title>Tuna Cafe</title>
</head>

<body>
  <font size=4 color="blue">Welcome to the Tuna Cafe Survey!</font>
  <form action="TunaResults.php" method="GET">
    <?php
    $menu = array("Turna Cesserole", "Tuna Sandwich", "Tuna Pie");
    $bestseller = 2;
    print "<div>Please indicate all your favorite dishes.</div>";
    for ($i = 0; $i < count($menu); $i++) {
      print "<label for='$i'><input type='checkbox' name='prefer[]' id='$i' value=$i> $menu[$i] </label>";
      if ($i == $bestseller) {
        print "<font color=red> Our Best Seller!!!</font>";
      }
      print "<br>";
    }
    ?>
    <input type="submit" value="Submit">
    <input type="reset" value="Reset">
  </form>
</body>

</html>