<!DOCTYPE html>

<head>
    <title>DateTimeProcessing</title>
</head>

<body>
<?php
if(array_key_exists("name", $_POST)) {
    $name = $_POST['name'];
    $day = $_POST['day'];
    $month = $_POST['month'];
    $year = $_POST['year'];
    $hours = $_POST['hours'];
    $minutes = $_POST['minutes'];
    $seconds = $_POST['seconds'];
} else {
    $name = "";
    $day = 1;
    $month = 1;
    $year = 2000;
    $hours = 00;
    $minutes = 00;
    $seconds = 00;
}
?>
<form method="post">
    Enter your name and select date and time for the appointment:<br>
    <br>

    <table>
        <tr>
            <td>
                Name:
            </td>
            <td>
                <input type="text" size="12" maxlength="30" name="name" value="<?php echo $name ?>">
            </td>
        </tr>
        <tr>
            <td>Date:</td>
            <td>
                <select name="day">
                    <?php
                    for ($i = 1; $i <= 31; $i++) {
                        if($day==$i) {
                            print("<option selected>$i</option>");
                        } else {
                            print("<option>$i</option>");
                        }
                    }
                    ?>
                </select>
                <select name="month">
                    <?php
                    for ($i = 1; $i <= 12; $i++) {
                        if($month==$i) {
                            printf("<option selected>$i</option>");
                        }else {
                            print("<option>$i</option>");
                        }
                    }
                    ?>
                </select>
                <select name="year">
                    <?php
                    for ($i = 1000; $i <= 2030; $i++) {
                        if($year==$i) {
                            print("<option selected>$i</option>");
                        } else {
                            print("<option>$i</option>");
                        }
                    }
                    ?>
                </select>
            </td>
        </tr>
        <tr>
            <td>Time:</td>
            <td>
                <select name="hours" id="">
                    <?php
                    for ($i = 00; $i <= 23; $i++) {
                        if($hours==$i) {
                            print("<option selected>$i</option>");
                        } else {
                            print("<option>$i</option>");
                        }
                    }
                    ?>
                </select>
                <select name="minutes" id="">
                    <?php
                    for ($i = 00; $i < 60; $i++) {
                        if($minutes==$i) {
                            print("<option selected>$i</option>");
                        } else {
                            print("<option>$i</option>");
                        }
                    }
                    ?>
                </select>
                <select name="seconds" id="">
                    <?php
                    for ($i = 00; $i < 60; $i++) {
                        if($seconds==$i) {
                            print("<option selected>$i</option>");
                        } else {
                            print("<option>$i</option>");
                        }
                    }
                    ?>
                </select>
            </td>
        </tr>
    </table>
    <input type="submit" value="submit">
</form>
</body>


</html>
<?php
if (array_key_exists("name", $_POST)) {
    $name = $_POST['name'];
    $day = $_POST['day'];
    $month = $_POST['month'];
    $year = $_POST['year'];
    $hours = $_POST['hours'];
    $minutes = $_POST['minutes'];
    $seconds = $_POST['seconds'];


    print "Hi $name!<br>";
    print "You have choose to have an appointment on $hours:$minutes:$seconds ,$day/$month/$year <br><br>";
    if ($hours <= 12) {
        print "More information<br><br>";
        print "In 12 hours, the time and date is $hours:$minutes:$seconds AM ,$day/$month/$year <br><br>";
    } else {
        $hours = $hours - 12;
        print " More information<br>";
        print "In 12 hours, the time and date is $hours:$minutes:$seconds PM ,$day/$month/$year <br>";
    }

    if ($month == 2 && ($year % 400 == 0) || ($year % 4 == 0 && $year % 100 != 0)) {
        print " This month has 29 days!<br>";
    } elseif ($month == 2) {
        print " This month has 28 days<br>";
    } elseif ($month == 4 || $month == 6 || $month == 9 || $month == 11) {
        print " This month has 30 days<br>";
    } else {
        print " This month has 31 days<br>";
    }

}