$(document).ready(function() {
  //   $(".tap-target").tapTarget();
  //   $(".tap-target").tapTarget("open");
  $("#scrape-button").on("click", function(event) {
    let queryURL = "/article-search";
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function(response) {
      console.log(response.data);
      console.log(response);
    });
  });
});
