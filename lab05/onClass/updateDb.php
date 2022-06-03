<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>

<?php
function getAll($connect, $table_name)
{
  $query = "SELECT * from $table_name";
  $results_id = mysqli_query($connect, $query);
  return  $results_id;
}
function updateProduct($connect, $table_name, $Product)
{
  $query = "UPDATE $table_name SET Numb = Numb-1 WHERE (Product_desc = '$Product')";
  $results_id = $connect->query($query);
  if ($results_id) return true;
  return false;
}
function renderSelect($connect, $table_name)
{
  $query = "SELECT * from $table_name";
  $results_id = mysqli_query($connect, $query);
  if ($results_id->num_rows > 0) {
    // output data of each row
    print "<tr><th>Num</th><th>Product</th><th>Cost</th><th>Weight</th><th>Count</th></tr>";
    while ($row = mysqli_fetch_row($results_id)) {
      print "<label border=1>";
      echo "<tr>";
      foreach ($row as $field) {
        print "<td>$field</td> ";
      }
      echo "</tr>";
      print "</label>";
    }
  } else {
    echo "0 results";
  }
}
function renderAll($connect, $table_name)
{
  $query = "SELECT * from $table_name";
  $results_id = mysqli_query($connect, $query);
  if ($results_id->num_rows > 0) {
    // output data of each row
    print "<table border=1>";
    print "<tr><th>Num</th><th>Product</th><th>Cost</th><th>Weight</th><th>Count</th></tr>";
    while ($row = mysqli_fetch_row($results_id)) {
      echo "<tr>";
      foreach ($row as $field) {
        print "<td>$field</td> ";
      }
      echo "</tr>";
    }
    print "</table>";
  } else {
    echo "0 results";
  }
}
?>

<body>
  <font size="5" color="blue">Select items we has sold</font>
  <form action="update.php" method="POST">
    <?php
          // foreach (get_all($connect, $table_name) as $item) {
          //   echo "<label for=$item>" . "<input id=$item type='radio' name='Product' value=$item />" . $item . "</label>";
          // }
          ?>
    <button type="submit">Submit</button>
  </form>

  <?php
  $Product = $_POST["Product"] ?? null;
  $servername = "localhost";
  $username = "root";
  $password = "";
  $mydb = "demo-mysql";
  $table_name = "products";
  // Create connection
  $connect = mysqli_connect($servername, $username, $password);

  // Check connection
  if (!$connect) {
    die("Connection failed: <br>" . mysqli_connect_error());
  }

  $connect->select_db($mydb);
  renderAll($connect, $table_name);

  // function Show_all($connect, $table_name)
  // {
  //   $query = "SELECT * from $table_name";
  //   $results_id = mysqli_query($connect, $query);
  // print '<table border=1><th> Num </th>
  // <th>Product</th><th>Cost</th>
  // <th>Weight</th><th>Count</th>';
  //   while ($row = mysqli_fetch_row($results_id)) {
  //     print '<tr>';
  // foreach ($row as $field) {
  //   print "<td>$field</td> ";
  // }
  //     print '</tr>';
  //   }
  // }

  // print '<font size="5" color="blue">';
  // print "Update Results for Table $table_name</font><br>\n";

  // $query = "UPDATE $table_name SET Numb = Numb-1 WHERE (Product_desc = '$Product')";
  // print "The query is <i> $query </i> <br><br>\n";
  // $results_id = $connect->query($query);
  // if ($results_id) {
  //   Show_all($connect, $table_name);
  // } else {
  //   print "Update=$query failed";
  // }
  mysqli_close($connect);
  ?>
</body>

</html>