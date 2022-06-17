<?php
header("Content-Type: text/xml");
$people = array(
  "Abraham Lincoln", "Martin Luther King", "Jimi Hendrix",
  "John Wayne", "John Carpenter", "Elizabeth Shue", "Benny Hill",
  "Lou Costello", "Bud Abbott", "Albert Einstein", "Rich Hall",
  "Anthony Soprano", "Michelle Rodriguez", "Carmen Miranda",
  "Sandra Bullock", "Moe Howard", "Ulysses S. Grant", "Stephen Fry",
  "Kurt Vonnegut", "Yosemite Sam", "Ed Norton", "George Armstrong Custer",
  "Alice Kramden", "Evangeline Lilly", "Harlan Ellison"
);
if (!$query) $query = $_GET['query'];
echo "<?xml version=\"1.0\"?>\n";
echo "<names>\n";
foreach ($people as $v) {
  if (stristr($v, $query))
    echo "<name>$v</name>\n";
}
echo '</names>';
