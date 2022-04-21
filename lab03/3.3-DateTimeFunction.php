<!DOCTYPE html>
<html lang="en">

<head>
  <title>DateTimeFunction</title>
</head>

<style>
  body {
    padding: 0 24px;
  }

  .form-wrapper {
    width: 100%;
    max-width: max-content;
  }

  .form-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    row-gap: 12px;
  }

  .form-group>label {
    width: 80px;
    display: inline-block;
  }

  .form-group>input {
    width: 100%;
    max-width: 160px;
    padding: 8px;
  }

  .btn-submit {
    width: 100%;
    margin-top: 24px;
    padding: 8px;
  }

  hr {
    width: 100%;
    height: 1px;
    background-color: gray;
    border: none;
  }
</style>
<?php
function formatDate($date)
{
  $newDate = $date ? date("l, F d, Y", strtotime($date)) : "";
  return $newDate;
}

function differenceDate($start, $end, $type = "d")
{
  if ($start && $end) {
    $diff = abs(strtotime($start) - strtotime($end));
    $years = floor($diff / (365*60*60*24));
    $months = floor($diff / (30*60*60*24));
    $days = floor($diff / (60*60*24));
    if($type == "d") return $days; 
    if($type == "m") return $months; 
    if($type == "y") return $years; 
  }
  return 0;
}
?>
<?php
  $name1 = $_POST["name1"] ?? "";
  $name2 = $_POST["name2"] ?? "";
  $birthday1 = $_POST["birthday1"] ?? "";
  $birthday2 = $_POST["birthday2"] ?? "";
?>
<body>
  <div class="form-wrapper">
    <h2>DateTimeFunction</h2>
    <form method="post" class="form-container">
      <div class="form-group">
        <label for="name1">User 01</label>
        <input type="text" id="name1" name="name1" placeholder="Enter name" value="<?php echo $name1 ?>"/>
      </div>
      <div class="form-group">
        <label for="birthday1">Birthday</label>
        <input type="date" id="birthday1" name="birthday1" value="<?php echo $birthday1 ?>"/>
      </div>
      <hr />
      <div class="form-group">
        <label for="name2">User 02</label>
        <input type="text" id="name2" name="name2" placeholder="Enter name" value="<?php echo $name2 ?>"/>
      </div>
      <div class="form-group">
        <label for="birthday2">Birthday</label>
        <input type="date" id="birthday2" name="birthday2" value="<?php echo $birthday2 ?>"/>
      </div>
      <button type="submit" class="btn-submit">Submit</button>
    </form>
  </div>
  <?php
  $name1 = $_POST["name1"] ?? "";
  $name2 = $_POST["name2"] ?? "";
  $birthday1 = $_POST["birthday1"] ?? "";
  $birthday2 = $_POST["birthday2"] ?? "";
  print "<p>User1 's name : $name1</p>";
  print "<p>User1 's birthday : " . formatDate($birthday1) . "</p>";
  print "<p>User1 is " . differenceDate("now", $birthday1, "y") . " years old.</p>";
  print "<p>User2 's name : $name2</p>";
  print "<p>User2 's birthday : " . formatDate($birthday2) . "</p>";
  print "<p>User2 is " . differenceDate("now", $birthday2, "y") . " years old.</p>";
  print "<p>The difference in days between two dates : " . differenceDate($birthday1, $birthday2, "d") . " days</p>";
  print "<p>The difference years between two persons : " . differenceDate($birthday1, $birthday2, "y") . " years </p>";
  ?>
</body>

</html>