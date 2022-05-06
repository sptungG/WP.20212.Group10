<html>

<head>
  <title>Create Table</title>
</head>

<body>
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
  } else {
    echo "Connected successfully <br>";
    $SQLcmd = "CREATE TABLE $table_name(
            ProductID INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
            Product_desc VARCHAR(50),
            Cost INT,
            Weight INT,
            Numb INT)";
    $connect->select_db($mydb);
    if ($connect->query($SQLcmd)) {

      print '<font size="4" color="blue" >Created Table';
      print "<i>$table_name</i> in database<i>$mydb</i><br></font>";
      print "<br>SQLcmd=$SQLcmd";
    } else {
      die("Table Create Creation Failed SQLcmd=$SQLcmd");
    }
    mysqli_close($connect);
  }

  ?>
</body>

</html>