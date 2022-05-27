<html>

<head>
    <title>Business Registration</title>
</head>

<body>
    <font size="6" style="font-weight: bold">Business Registration</font>
    <br><br>
    <form action="<?php echo $_SERVER["PHP_SELF"] ?>" method="post">
        <div style="float: left; width: 30%">
            <p>Click on one, or control-click on <br>multiple categories</p>
            <select name="category[]" multiple="multiple">
                <?php
                $server = "localhost";
                $username = "root";
                $password = "";
                $my_db = "mydatabase";

                // Create connection
                $conn = mysqli_connect($server, $username, $password, $my_db);
                // Check connection

                $table_name = 'categories';

                if (!$conn) {
                    die("Connection failed: " . mysqli_connect_error());
                }

                $SQLcmd = "SELECT * FROM $table_name";
                $result = mysqli_query($conn, $SQLcmd);
                if ($result) {
                    $categories = [];

                    while ($row = $result->fetch_assoc()) {
                        $item = array();
                        $item["cat_id"] = $row["cat_id"];
                        $item["title"] = $row["title"];
                        $item["description"] = $row["description"];

                        $categories[] = $item;
                    }
                    foreach ($categories as $item) {
                        print "<option value=\"" . $item["title"] . "\">" . $item["title"] . "</option>";
                    }
                }
                ?>
            </select>
        </div>

        <div>
            <table>
                <tr>
                    <td>Business Name: </td>
                    <td><input type="text" maxlength="100" size="30" name="business_name"></td>
                </tr>

                <tr>
                    <td>Address: </td>
                    <td><input type="text" maxlength="100" size="30" name="address"></td>
                </tr>

                <tr>
                    <td>City: </td>
                    <td><input type="text" maxlength="100" size="30" name="city"></td>
                </tr>

                <tr>
                    <td>Telephone: </td>
                    <td><input type="text" maxlength="100" size="30" name="telephone"></td>
                </tr>

                <tr>
                    <td>URL: </td>
                    <td><input type="text" maxlength="100" size="30" name="url"></td>
                </tr>
            </table>
        </div>
        <br><br><br>
        <input type="submit" value="Add Business" name="submit">
    </form>
    <?php
    if (isset($_POST["submit"])) {
        $business_name = $_POST["business_name"];
        $address = $_POST["address"];
        $city = $_POST["city"];
        $telephone = $_POST["telephone"];
        $url = $_POST["url"];

        $sql = "INSERT INTO businesses (business_name, address, city, telephone, url) VALUES ('$business_name', '$address', '$city', '$telephone', '$url')";
        if (mysqli_query($conn, $sql)) {

            $business_id = $conn->insert_id;
            print "$business_id";
            $list_category = $_POST["category"];
            foreach ($list_category as $category) {
                print "$category";
                $query1 = "SELECT * FROM categories WHERE title='$category'";
                $result = mysqli_query($conn, $query1);
                $row = mysqli_fetch_array($result);
                $cat_id = $row["cat_id"];

                $query2 = "INSERT INTO  biz_categories (bus_id,cat_id) VALUES ($business_id, '$cat_id')";
                mysqli_query($conn, $query2);
            }
            echo "New business is inserted successfully <br>";
        } else {
            echo "Error: " . $sql . "<br>" . mysqli_error($conn);
        }
    }
    ?>

    <?php


    ?>


</body>

</html>