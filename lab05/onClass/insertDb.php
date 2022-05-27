<html>

<head>
  <title>Ex2</title>
</head>

<style>
  .text-field{
    display: flex;
  }
  .text-field input {
    padding: 4px;
  }
  .text-field label {
    cursor: pointer;
    font-weight: 500;
    width: 120px;
  }
</style>

<?php
$description = $_POST["description"] ?? "";
$weight = $_POST["weight"] ?? "";
$cost = $_POST["cost"] ?? "";
$number = $_POST["number"] ?? "";
?>

<body>
  <form method="POST">
    <div class="text-field">
      <label for="description">Item Description: </label>
      <input type="text" id="description" name="description" placeholder="Enter description..." />
    </div>
    <div class="text-field">
      <label for="weight">Weight: </label>
      <input type="number" id="weight" name="weight" placeholder="Enter weight..." />
    </div>
    <div class="text-field">
      <label for="cost">Cost: </label>
      <input type="number" id="cost" name="cost" placeholder="Enter cost..." />
    </div>
    <div class="text-field">
      <label for="number">Available: </label>
      <input type="number" id="number" name="number" placeholder="Enter number..." />
    </div>
    <br>
    <button type="submit">Submit</button>
    <button type="reset">Reset</button>
  </form>
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
    $connect->select_db($mydb);
    $sqlq = "INSERT INTO products(Product_desc,Cost,Weight,Numb) VALUES ('$description',$cost,$weight,$number)";
    if ($connect->query($sqlq)) {
      echo "New records created successfully<br>";
    } else {
      echo "Error: " . $sqlq . "<br>" . $connect->error . "<br>";
    }
  } ?>
</body>

</html>