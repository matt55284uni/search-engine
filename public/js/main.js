const Search = {};
Search.INPUT = $("#search");
Search.BUTTON = $("#searchButton");
Search.RESULT = $(".result");

Search.query = () => { 
    "ENTER";
    window.location.href = `?search=${Search.INPUT.val()}`;
}

Search.follow = (event) => {
    let url = $(event.target).find("#url").attr("data-url");
    window.location = url;
}

(Search.init = () => {
    Search.BUTTON.on("click", Search.query);
    Search.RESULT.on("click", Search.follow);
    Search.INPUT.bind("enterKey", Search.query);
    Search.INPUT.keyup(function(event) { if (event.keyCode == 13) $(this).trigger("enterKey")});
})();