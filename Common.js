/* Tout JavaScript présent ici sera exécuté par tous les utilisateurs à chaque chargement de page. */
var hooks = [];
var darkMode = [];
var lightMode = [];
/*/////////////////////////////////////////////////////*/
/* Ajustement de la largeur des bandeaux d'information */
/*/////////////////////////////////////////////////////*/

function recalculateSize(content) {
  var bandeaux = content.find("bandeau-generique");
  bandeaux.each(function (bandeau) {
    var previousSibling = bandeau.prev();
    if (previousSibling) {
      bandeau.css(
        width,
        previousSibling.offsetWidth -
          parseInt($(bandeau).css("padding-left")) -
          parseInt($(bandeau).css("padding-right")) +
          "px"
      );
    }
  });
}

hooks.push(recalculateSize);

/*/////////////////////////////////////////////////////*/
/*             Gère la couleur des bandeaux            */
/*/////////////////////////////////////////////////////*/

function darkifyBandeau(content) {
  var data = content.find(".darkmode-data");
  var bandeau = content.find(".bandeau-generique");
  var dark_color = data.data("darkmode-color");
  if (dark_color != "null") {
    white_color = bandeau.css("color");
    bandeau.css("color", dark_color);
    data.data("whitemode-color", white_color);
  }
  var dark_bg_color = data.data("darkmode-bg-color");
  if (dark_bg_color != "null") {
    white_bg_color = bandeau.css("background-color");
    bandeau.css("background-color", dark_bg_color);
    data.data("whitemode-bg-color", white_bg_color);
  }
  var dark_border_color = data.data("darkmode-border-color");
  if (dark_border_color != "null") {
    white_border_color = bandeau.css("border-color");
    bandeau.css("border-color", dark_border_color);
    data.data("whitemode-border-color", white_border_color);
  }
  data.attr("class", ".whitemode-data");
}

darkMode.push(darkifyBandeau);

function clarifyBandeau(content) {
  var data = content.find(".whitemode-data");
  var bandeau = content.find(".bandeau-generique");
  var white_color = data.data("whitemode-color");
  if (white_color != "null") {
    dark_color = bandeau.css("color");
    bandeau.css("color", white_color);
    data.data("darkmode-color", dark_color);
  }
  var white_bg_color = data.data("whitemode-bg-color");
  if (white_bg_color != "null") {
    dark_bg_color = bandeau.css("background-color");
    bandeau.css("background-color", white_bg_color);
    data.data("darkmode-bg-color", dark_bg_color);
  }
  var white_border_color = data.data("whitemode-border-color");
  if (white_border_color != "null") {
    dark_border_color = bandeau.css("border-color");
    bandeau.css("border-color", white_border_color);
    data.data("darkmode-border-color", dark_border_color);
  }
  data.attr("class", ".darkmode-data");
}

lightMode.push(clarifyBandeau);

function actOnBackground(content) {
  const checkIsDarkSchemePreferred = window.matchMedia && window.matchMedia("(prefers-color-scheme:dark)").matches;
  if (checkIsDarkSchemePreferred) {
    for (const hook of darkMode) {
      hook(content);
    }
  } else {
    for (const hook of lightMode) {
      hook(content);
    }
  }
}

hooks.push(actOnBackground);

/*/////////////////////////////////////////////////////*/
/*                  lance les hooks                    */
/*/////////////////////////////////////////////////////*/
mw.hook("wikipage.content").add(function (content) {
  var pageContent;
  const PARSER_OUTPUT = content.find(".mw-parser-output");
  if (PARSER_OUTPUT) {
    pageContent = PARSER_OUTPUT;
  } else if (PARSER_OUTPUT.hasClass("mw-parser-output")) {
    pageContent = PARSER_OUTPUT;
  } else return;
  for (const hook of hooks) {
    hook(pageContent);
  }
});
