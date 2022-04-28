<html>

<head>
    <title>User Sort</title>
</head>

<style>
    label {
        display: block;
    }
</style>

<?php
$sort_type = $_POST['sort_type'] ?? "";

$users = array(
    'name' => 'Buzz Lightyear', 'email_address' => 'buzz@starcommand',
    'age' => 32, 'smarts' => 'some'
);

$sort_type_list = array(
    'sort' => 'Standard sort',
    'rsort' => 'Reverse sort',
    'usort' => 'User-defined sort',
    'ksort' => 'Key sort',
    'krsort' => 'Reverse key sort',
    'uksort' => 'User-defined key sort',
    'asort' => 'Value sort',
    'arsort' => 'Reverse value sort',
    'uasort' => 'User-defined value sort',
);

function get_sorted($sort_type, $arr)
{
    $arr_sorted = $arr;
    $user_sort_list = array('usort', 'uksort', 'uasort');
    if (in_array($sort_type, $user_sort_list)) {
        $sort_type($arr_sorted, function ($a, $b) {return strcmp($a, $b);});
    } else {
        $sort_type($arr_sorted);
    }
    return $arr_sorted;
}
?>

<body>
    <form method="post">
        <?php
        foreach ($sort_type_list as $key => $name) {
            if ($sort_type == $key) {
                echo "<label for=$key>" . "<input id=$key type='radio' name='sort_type' value=$key  checked/>" . $name . "</label>";
            } else {
                echo "<label for=$key>" . "<input id=$key type='radio' name='sort_type' value=$key />" . $name . "</label>";
            }
        }
        ?>
        <button type="submit">Sort</button>
    </form>

    <div class="unsorted">
        <p>Values unsorted(before sorted) :</p>
        <ul>
            <?php
            foreach ($users as $key => $value) {
                echo "<li><b>$key</b>: $value</li>";
            }
            ?>
        </ul>
    </div>

    <div class="sorted">
        <?php
        if (array_key_exists("sort_type", $_POST)) {
            echo "<p>Values sorted by $sort_type_list[$sort_type] - <i>$sort_type</i> : </p>";
            echo "<ul>";
            foreach (get_sorted($sort_type, $users) as $key => $value) {
                echo "<li><b>$key</b>: $value</li>";
            }
            echo "</ul>";
        }
        ?>
    </div>
</body>

</html>