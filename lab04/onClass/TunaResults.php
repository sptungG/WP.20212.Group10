<html>

<head>
  <title>Tuna Cafe</title>
</head>

<body>
  <?php
  $menu = array("Turna Cesserole", "Tuna Sandwich", "Tuna Pie");
  $prefer = $_GET["prefer"];
  if (count($prefer) == 0) {
    print("Please pick some favorite <br>");
  } else {
    print("Your selection are <br> <ul>");
    foreach ($prefer as $item) {
      print("<li> $menu[$item] </li>");
    }
    print("</ul>");
  }
  ?>
</body>

</html>