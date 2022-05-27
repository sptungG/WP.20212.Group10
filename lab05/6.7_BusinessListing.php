<html>

<head>
    <title>Business Listings</title>
</head>

<body>
    <?php
    $servername = "localhost";
    $username = "root";
    $password = "";
    $mydb = "mydatabase";
    $table_name = "categories";
    // Create connection
    $connect = mysqli_connect($servername, $username, $password);

    // Check connection
    if (!$connect) {
        die("Connection failed: <br>" . mysqli_connect_error());
    } else {
        print("Connection success!!<br>");
    }
    $connect->select_db($mydb);
    ?>

    <h1>Business Listings</h1>

    <div style="float:left; width:30%">
        <table border="1px">
            <tr>
                <th>Click on a category to find business listings</th>
            </tr>

            <?php


            $SQLcmd = "SELECT * FROM $table_name";
            $result = mysqli_query($connect, $SQLcmd);

            if ($result) {
                while ($row = $result->fetch_assoc()) {
                    $link = "Business_list.php?cat_id={$row["cat_id"]}";
                    print("<tr><td><a href='$link'>" . $row["title"] . "</a></td></tr>");
                }
            } else {
                print("Result empty <br>");
            }



            ?>
        </table>
    </div>
    <div>
        <table border="1px">
            <?php
            if (array_key_exists("cat_id", $_GET)) {
                $cat_id = $_GET["cat_id"];
                $query = "SELECT * FROM businesses JOIN biz_categories ON businesses.bus_id = biz_categories.bus_id
                        WHERE biz_categories.cat_id = '$cat_id'";
                $result = $connect->query($query);
                if ($result) {
                    while ($row = $result->fetch_assoc()) {
                        echo "<tr>";
                        echo "<td>" . $row['bus_id'] . "</td>";
                        echo "<td>" . $row['business_name'] . "</td>";
                        echo "<td>" . $row['address'] . "</td>";
                        echo "<td>" . $row['city'] . "</td>";
                        echo "<td>" . $row['telephone'] . "</td>";
                        echo "<td>" . $row['url'] . "</td>";
                        echo "</tr>";
                    }
                }
            }
            ?>
        </table>
    </div>
</body>

</html>