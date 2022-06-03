## Lab 6-2. Layout with CSS

### 6.4. Modify 6.1 using DIV tag

Modify the example in 6.1 to use DIV tag for layout to get the same result

Before:

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN">
<html>
  <head>
    <title>My first styled page</title>
  </head>
  <body>
    <!-- Site navigation menu -->
    <ul class="navbar">
      <li><a href="index.html">Home page</a></li>
      <li><a href="musings.html">Musings</a></li>
      <li><a href="town.html">My town</a></li>
      <li><a href="links.html">Links</a></li>
    </ul>

    <!-- Main content -->
    <h1>My first styled page</h1>
    <p>Welcome to my styled page!</p>
    <p>
      It lacks images, but at least it has style. And it has links, even if they don't go
      anywhere&hellip;
    </p>
    <p>
      There should be more here, but I don't know what yet.
      <!-- Sign and date the page, it's only polite! -->
    </p>

    <address>Made 15 October 2009<br />by myself.</address>
  </body>
</html>
```

After:

```html
<div class="main-section">
  <div class="main-navbar">
    <div><a href="index.html">Home page</a></div>
    <div><a href="musings.html">Musings</a></div>
    <div><a href="town.html">My town</a></div>
    <div><a href="links.html">Links</a></div>
  </div>
  <div class="main-content">
    <div class="content-title">My first styled page</div>
    <div>Welcome to my styled page!</div>
    <div>
      It lacks images, but at least it has style. And it has links, even if they don't go
      anywhere&hellip;
    </div>
    <div>There should be more here, but I don't know what yet.</div>

    <div class="address">
      Made 15 October 2009<br />
      by myself.
    </div>
  </div>
</div>
```

DEMO:

![image](https://user-images.githubusercontent.com/61298021/171789503-58283efe-c54c-42ef-a6b9-b18d0d52c61a.png)

### 6.5. CSS Box Model

Follow the instruction in the slides to make the layout of your webpage which includes 4 areas: **header, main, side-bar and footer**.

Create other web pages (2-3 web pages) applying this layout and style.

![image](https://user-images.githubusercontent.com/61298021/171787535-621e26ed-19cc-4618-8b49-91e7a1b78668.png)

Code:

```html
<header class="header">Header</header>
<section class="section">
  <div class="section-content">
    Content stiae distinctio harum voluptates officia, reprehenderit quod, modi eos itaque fuga,
    ducimus quia laboriosam.
  </div>
  <div class="section-sidebar">Right</div>
</section>
<footer class="footer">Footer</footer>
```

DEMO:

![image](https://user-images.githubusercontent.com/61298021/171788990-3d460878-5cc1-46e4-a1f1-fed5498c4143.png)
