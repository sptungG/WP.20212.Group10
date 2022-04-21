<!DOCTYPE html>

<head>
  <title>Convert radians and degress</title>
</head>

<style>
  .form-container {
    display: flex;
    flex-direction: column;
    row-gap: 8px;
    width: 100%;
    max-width: 240px;
    margin-bottom: 24px;
  }
  .radios-group {
    display: flex;
    flex-direction: column;
    row-gap: 4px;
    width: 100%;
  }
  .form-group {
    display: flex;
    flex-direction: column;
    row-gap: 4px;
  }
  .form-group>input {
    padding: 4px;
  }
  .btn-submit {
    padding: 4px;
    margin-top: 8px;
  }
</style>

<?php
$number = $_POST["number"] ?? "";
$type = $_POST["type"] ?? "";
?>

<body>
  <h3>Radians or degrees</h3>
  <form method="post" class="form-container">
    <div class="radios-group">
      <label for="r-to-d"><input type="radio" id="r-to-d" name="type" value="r-to-d" <?php echo ($type == "r-to-d") ?  "checked" : "";  ?>> Radians to Degrees</label>
      <label for="d-to-r"><input type="radio" id="d-to-r" name="type" value="d-to-r" <?php echo ($type == "d-to-r") ?  "checked" : "";  ?>> Degrees to Radians </label>
    </div>
    <div class="form-group">
      <label for="number">Number</label>
      <input type="number" name="number" id="number" value="<?php echo $number ?>" />
    </div>
    <button type="submit" class="btn-submit">Submit</button>
  </form>
  <?php
  $number = $_POST["number"] ?? "";

  function R_to_D($radians)
  {
    return $radians * (180 / pi());
  }
  function D_to_R($degrees)
  {
    return $degrees * pi() / 180;
  }

  if ($number == "" || empty($_POST["type"])) {
    print "<div>Please enter all!!</div>";
  } else {
    $type = $_POST["type"];
    if ($type == "r-to-d") {
      print "<div>Convert to degrees: " . R_to_D($number) . "</div>";
    } else {
      print "<div>Convert to radians: " . D_to_R($number) . "</div>";
    }
  }
  ?>
</body>

</html>