<html>
<title>Search product</title>

<?php
$description = $_POST["description"] ?? "";
?>

<body>
  <font size="5" color="blue">Inventory search</font>
  <form method="POST">
    <div class="text-field">
      <label for="description">Enter description to search: </label>
      <input type="text" id="description" name="description" placeholder="Enter description..." />
    </div>
    <button type="submit">Submit</button>
  </form>

  <div>
    <?php
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

    echo '<font size="5" color="blue">';
    echo "$table_name Data</font><br>";
    $query = "SELECT * FROM $table_name WHERE Product_desc like '%$description%'";
    echo "The query is <i>$query </i><br>";
    $connect->select_db($mydb);
    $results_id = $connect->query($query);
    if ($results_id->num_rows > 0) {
      echo '<table border=1>';
      echo '<th>Num<th>Product<th>Cost<th>Weight<th>Count';

      while ($row = $results_id->fetch_assoc()) {
        echo '<tr>';
        foreach ($row as $field) {
          echo "<td>$field</td> ";
        }
        echo '</tr>';
      }
      echo '</table>';
    } else {
      die("Query=$query failed!");
    }
    mysqli_close($connect);
    ?>
  </div>
</body>

</html>