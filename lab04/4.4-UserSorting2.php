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

$users_sorted = $users;

$sort_types = array(
    'sort' => 'Standard sort',
    'rsort' => 'Reverse sort',
    'uasort' => 'User-defined sort',
    'ksort' => 'Key sort',
    'krsort' => 'Reverse key sort',
    'uksort' => 'User-defined key sort',
    'asort' => 'Value sort',
    'usort' => 'Reverse value sort',
    'uasort' => 'User-defined value sort',
);

function user_sort($a, $b)
{
    // smarts is all-important, so sort it first
    if ($b == 'smarts') {
        return 1;
    } else if ($a == 'smarts') {
        return -1;
    }
    return ($a == $b) ? 0 : (($a < $b) ? -1 : 1);
}

if (array_key_exists("sort_type", $_POST)) {
    if ($sort_type == 'usort' || $sort_type == 'uksort' || $sort_type == 'uasort') {
        $sort_type($users_sorted, 'user_sort');
    } else {
        $sort_type($users_sorted);
    }
}
?>

<body>
    <form method="post">
        <?php
        foreach ($sort_types as $type => $name) {
            if ($sort_type == $type) {
                echo "<label for=$type>" . "<input id=$type type='radio' name='sort_type' value=$type  checked/>" . $name . "</label>";
            } else {
                echo "<label for=$type>" . "<input id=$type type='radio' name='sort_type' value=$type />" . $name . "</label>";
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
            echo "<p>Values sorted by $sort_types[$sort_type] : </p>";
            echo "<ul>";
            foreach ($users_sorted as $key => $value) {
                echo "<li><b>$key</b>: $value</li>";
            }
            echo "</ul>";
        }
        ?>
    </div>
</body>

</html>