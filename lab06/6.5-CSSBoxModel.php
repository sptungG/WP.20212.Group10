<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Layout</title>
    <style>
      * {
        padding: 0;
        margin: 0;
        box-sizing: border-box;
      }
      body {
        display: flex;
        flex-direction: column;
        height: 100vh;
      }
      .header {
        background-color: #f62682;
      }
      .section {
        display: flex;
        flex-wrap: nowrap;
        width: 100%;
        height: 100%;
      }

      .section-sidebar {
        margin-left: auto;
        width: 20%;
        background-color: #20e3b2;
      }
      .footer {
        margin-top: auto;
        background-color: #2cccff;
      }
    </style>
  </head>
  <body>
    <header class="header">Header</header>
    <section class="section">
      <div class="section-content">
        Content stiae distinctio harum voluptates officia, reprehenderit quod, modi eos itaque fuga,
        ducimus quia laboriosam.
      </div>
      <div class="section-sidebar">Right</div>
    </section>
    <footer class="footer">Footer</footer>
  </body>
</html>
