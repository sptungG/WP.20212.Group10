<?php

class Page
{

  private $page = null;
  private $title;
  private $year;
  private $copyright;

  public function get()
  {
    echo $this->page;
  }

  public function setYear($year)
  {
    $this->year = $year;
  }

  public function setTitle($title)
  {
    $this->title = $title;
  }

  public function setCopyright($copyright)
  {
    $this->copyright = $copyright;
  }

  private function addHeader()
  {
    $this->page = $this->page . "<h1>Title: $this->title </h1>";
  }

  private function addFooter()
  {
    $this->page = $this->page . "<div><span>Copyright by </span>" . $this->copyright . "</div>";
  }
  public function addContent($content)
  {
    $this->addHeader();
    $this->page = $this->page . $content ;
    $this->addFooter();
  }
}

$page = new Page();
$page->setTitle("Welcome to web-programming-10");
$page->setYear("2022");
$page->setCopyright("<b>Gr-10</b>");
$page->addContent("<div>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vitae purus faucibus ornare suspendisse. Senectus et netus et malesuada fames ac. Ipsum dolor sit amet consectetur. Elit ut aliquam purus sit. Vitae nunc sed velit dignissim sodales ut eu sem integer.</div>");

$page->get();
