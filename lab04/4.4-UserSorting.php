<html>

<head>
    <title>User Sort</title>
</head>

<body>
<?php
function user_sort($a, $b)
{
    if ($b == 'smarts') {
        return 1;
    } else if ($a == 'smarts') {
        return -1;
    }
    return ($a == $b) ? 0 : (($a < $b) ? -1 : 1);
}

$values = array('name' => 'Buzz Lightyear', 'email_address' => 'buzz@starcommand',
    'age' => 32, 'smarts' => 'some');
$values1 = array('name' => 'Buzz Lightyear', 'email_address' => 'buzz@starcommand',
    'age' => 32, 'smarts' => 'some');
$submitted = null;
$sort_type = null;
if (array_key_exists("submitted", $_POST)) {
    $submitted = $_POST['submitted'];
    $sort_type = $_POST['sort_type'];
    if ($submitted) {
        if ($sort_type == 'usort' || $sort_type == 'uksort' || $sort_type == 'uasort') {
            $sort_type($values, 'user_sort');
        } else {
            $sort_type($values);
        }
    }
}
$sortTypes['sort']='Standard sort';
$sortTypes['rsort']='Reverse sort';
$sortTypes['usdort']='User-defined sort';
$sortTypes['ksort']='Key sort';
$sortTypes['krsort']='Reverse key sort';
$sortTypes['uksort']='User-defined key sort';
$sortTypes['asort']='Value sort';
$sortTypes['usort']='Reverse value sort';
$sortTypes['uasort']='User-defined value sort';


?>

<form action="4.4-UserSorting.php" method="post">
    <p>
        <input type="radio" name="sort_type" value="sort" <?php echo $sort_type == "sort" ? "checked" : "" ?>>
        <label>Standard sort </label>
        <br>
        <input type="radio" name="sort_type" value="rsort" <?php echo $sort_type == "rsort" ? "checked" : "" ?>>
        <label>Reverse sort</label>
        <br>
        <input type="radio" name="sort_type" value="usort" <?php echo $sort_type == "usdort" ? "checked" : "" ?>>
        <label>User-defined sort</label>
        <br>
        <input type="radio" name="sort_type" value="ksort" <?php echo $sort_type == "ksort" ? "checked" : "" ?>>
        <label>Key sort</label>
        <br>
        <input type="radio" name="sort_type" value="krsort" <?php echo $sort_type == "krsort" ? "checked" : "" ?>>
        <label>Reverse key sort</label>
        <br>
        <input type="radio" name="sort_type" value="uksort" <?php echo $sort_type == "uksort" ? "checked" : "" ?>>
        <label>User-defined key sort</label>
        <br>
        <input type="radio" name="sort_type" value="asort" <?php echo $sort_type == "asort" ? "checked" : "" ?>>
        <label>Value sort</label>
        <br>
        <input type="radio" name="sort_type" value="arsort" <?php echo $sort_type == "usort" ? "checked" : "" ?>>
        <label>Reverse value sort</label>
        <br>
        <input type="radio" name="sort_type" value="uasort" <?php echo $sort_type == "uasort" ? "checked" : "" ?>>
        <label>User-defined value sort</label>
    </p>
    <p>
        <input type="submit" value="sort" name="submitted">
    </p>
    <p>
        Values unsorted(before sorted) :
    </p>
    <ul>
        <?php
        foreach ($values1 as $key => $value) {
            echo "<li><b>$key</b>: $value</li>";
        }
        ?>
    </ul>
    <?php
    if ($submitted) {
        print "<p>Values sorted by $sortTypes[$sort_type] : </p>";
        print "<ul>";
        foreach ($values as $key => $value) {
            print "<li><b>$key</b>: $value</li>";
        }
        print "</ul>";

    }
    ?>
</form>

</body>
</html>