<?php
class PropertyTest {
    private $data = array();

    public $declared = 1;

    private $hidden = 2;

    public function __set($name, $value) {
        echo "Setting '$name' to '$value'<br>";
        $this->data[$name] = $value;
    }

    public function __get($name) {
        echo "Getting '$name'<br>";
        if (array_key_exists($name, $this->data)) {
            return $this->data[$name];
        }
    }

    public function __isset($name)
    {
        echo "Is '$name' set?<br>";
        return isset($this->data[$name]);
    }

    public function __unset($name) {
        echo "Unsetting '$name' <br>";
        unset($this->data[$name]);
    }

    public function getHidden() {
        return $this->hidden;
    }
}

echo "<pre>\n";

$obj = new PropertyTest;

$obj->a = 1;
echo $obj->a . "\n\n";

var_dump(isset($obj->a));
unset($obj->a);
var_dump(isset($obj->a));
echo "\n";

echo $obj->declared . "\n\n";

echo "Let's experiment with the private property named 'hidden':\n";
echo "Privates are visible inside the class, so __get() not used...\n";
echo $obj->getHidden() . "\n";
echo "Privates not visible outside of class, so __get() is used...\n";
echo $obj->hidden . "\n";
?>