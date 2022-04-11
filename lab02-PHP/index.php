<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <link rel="stylesheet" href="main.css" type="text/css">
  <title>2.9.Exercise</title>
</head>

<body>
<div class="wrapper">
  <h2 class="form-title">Your Profile</h2>
  <form action="process.php" method="POST" class="form-container">

    <div class="text-field">
      <label for="fullName">First name</label>
      <input type="text" id="fullName" name="fullName" placeholder="Enter your name..."/>
    </div>

    <div class="text-field">
      <label for="email">Last name</label>
      <input type="email" id="email" name="email" placeholder="Enter your email..."/>
    </div>

    <div class="form-group">
      <label>Gender?:</label>
      <div class="radios-wrapper">
        <label for="male"><input type="radio" name="gender" id="male" value="male"/> Male</label>
        <label for="female">
          <input type="radio" name="gender" id="female" value="female"/> Female
        </label>
        <label for="other">
          <input type="radio" name="gender" id="other" value="other"/> Other
        </label>
      </div>
    </div>

    <div class="form-group">
      <label>What topics do you like reading about? (Check all that apply):</label>
      <div class="checkboxes-wrapper">
        <label for="HTML"><input type="checkbox" name="topics[]" id="HTML"
                                 value="HTML"/> HTML</label>
        <label for="CSS"><input type="checkbox" name="topics[]" id="CSS" value="CSS"/> CSS</label>
        <label for="PHP"><input type="checkbox" name="topics[]" id="PHP" value="PHP"/> PHP</label>
        <label for="WordPress">
          <input type="checkbox" name="topics[]" id="WordPress" value="WordPress"/>
          WordPress</label>
      </div>
    </div>



    <div class="form-action">
      <button type="submit" class="btn btn-submit">Click to submit</button>
      <button type="reset" class="btn btn-reset">Reset</button>
    </div>

  </form>
</div>

</body>
</html>