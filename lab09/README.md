## Javascript & AJAX

### 9.1 - Event Handling (JS)

Write a simple HTML document called `colors.html` containing three colored links at the top of the page labeled **RED**, **GREEN**, and **BLUE**.
Under the links there should be a small paragraph of text (you make this up) with a starting color of BLACK.
Using `onMouseOver` and `onMouseOut` events of the links, when a user rolls over the each and any of the color labeled links, the color of the text in the paragraph below should change to the color corresponding to the link the user is hovering over.
When the user rolls off the link, the color of the text should go back to it's starting color of BLACK

Demo:

![image](https://user-images.githubusercontent.com/61298021/174215257-463470d1-cd97-405d-ac73-06f657d3bb44.png)

### 9.2 – Inheritance (JS)

Implement and try to understand the following source code

```js
var Person = function () {};
Person.prototype.initialize = function (name, age) {
  this.name = name;
  this.age = age;
};
Person.prototype.describe = function () {
  return this.name + ", " + this.age + " years old.";
};
var Student = function () {};
Student.prototype = new Person();
Student.prototype.learn = function (subject) {
  console.log(this.name + " just learned " + subject);
};
var me = new Student();
me.initialize("John", 25);
me.learn("Inheritance");
```

Next, create an object called Teacher derived from the Person class, and implement a method called teach
which receives a string called subject, and prints out:

`[teacher's name] is now teaching [subject]`

Demo:

![image](https://user-images.githubusercontent.com/61298021/174215544-43f92889-3bef-49b9-96eb-a736ba494be3.png)

### 9.3 – Validate inputs (JS)

Create a register form and validate inputs in the form (username… not null, email, telephone in the right
format…)

Demo:

![image](https://user-images.githubusercontent.com/61298021/174215821-5d408225-26a7-4872-9237-e8f267ad1c20.png)

### 9.4 – Search suggestions by AJAX

Develop a PHP application which allows users to search product information of your company. Whenever
users enter any character in the product name, provide suggestions corresponding with entered characters.
Using AJAX to complete the exercise.
