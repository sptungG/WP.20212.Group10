<?php $q = $_GET["q"];
$con = mysqli_connect('localhost', 'root', '');
if (!$con) {
    die('Could not connect: ' ); 
}
mysqli_select_db($con,'ajax_demo');
$sql = "SELECT * FROM users WHERE id = $q";
$result = mysqli_query($con,$sql);
echo "<table border='1'> <tr> <th>Firstname</th> <th>Lastname</th> <th>Age</th> <th>Hometown</th> <th>Job</th> </tr>";
while ($row = mysqli_fetch_array($result)) {
    echo "<tr>";

    echo "<td>" . $row['Firstname'] . "</td>";
    echo "<td>" . $row['Lastname'] . "</td>";
    echo "<td>" . $row['Age'] . "</td>";
    echo "<td>" . $row['Hometown'] . "</td>";
    echo "<td>" . $row['Job'] . "</td>";
    echo "</tr>";
}
echo "</table>";
mysqli_close($con);
