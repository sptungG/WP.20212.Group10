<html>

<head>
    <title>Insert Results</title>
</head>

<body>
    <?php
    $host = 'db';
    $user = 'root';
    $passwd = '2642222';
    $database = 'db';
    $connect = mysqli_connect($host, $user, $passwd, $database);
    $table_name = 'Category';
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $CatID = $_POST["CatID"];
        $Title = $_POST["Title"];
        $Description = $_POST["Description"];
        $query = "Insert into  $table_name VALUES
        ('$CatID','$Title','$Description')";
        print "The Query is <i>$query</i><br>";
        if ($data = $connect->query($query)) {
            print "Insert into $database was successful!</font>";
        } else {
            print "Insert into $database failed!</font>";
        }
    }



    mysqli_close($connect);
    ?></body>

</html>