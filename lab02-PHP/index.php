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
      <label for="email">Email</label>
      <input type="email" id="email" name="email" placeholder="Enter your email..."/>
    </div>

    <div class="text-field">
      <label for="fullName"> University </label>
      <input type="text" id="university" name="university" placeholder="Enter your university..."/>
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
      <label>Your school:</label>
      <div class="checkboxes-wrapper">
        <label for="SoIct"><input type="checkbox" name="topics[]" id="SoIct"
            value="SoIct"/> SoIct</label>
        <label for="Physic"><input type="checkbox" name="topics[]" id="Physic" value="Physic"/> Physic</label>
        <label for="Chemistry"><input type="checkbox" name="topics[]" id="Chemistry" value="Chemistry"/> Chemistry</label>
        <label for="Other">
          <input type="checkbox" name="topics[]" id="Other" value="Other"/>
          Other</label>
      </div>
    </div>

    <div class="text-field">
      <label for="Bio"> Bio</label>
      <textarea id="w3review" name="Bio" rows="4" cols="50">

      </textarea>
  
    </div>


    <div class="form-action">
      <button type="submit" class="btn btn-submit">Click to submit</button>
      <button type="reset" class="btn btn-reset">Reset</button>
    </div>

  </form>
</div>

</body>
</html>