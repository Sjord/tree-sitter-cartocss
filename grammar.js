module.exports = grammar({
  name: 'cartocss',

  extras: $ => [
    $.comment,
    /[\s\u00A0\uFEFF\u3000]+/,
  ],

  rules: {
    source_file: $ => repeat($.statement),
    statement: $ => choice($.assignment, $.ruleset),
    assignment: $ => seq($.variable, ":", $.values, ";"),
    ruleset: $ => seq($.selectors, "{", repeat($.ruleset_body), "}"),
    ruleset_body: $ => choice($.declarations, $.ruleset),
    selectors: $ => seq($.selector, repeat(seq(",", optional($.selector)))),
    declarations: $ => seq($.declaration, repeat(seq(";", optional($.declaration)))),
    selector: $ => repeat1(choice("Map", $.layer, $.class, $.filter, $.attachment)),
    filter: $ => seq("[", 
      field("left", choice($.identifier, $.string)),
      field("comparison", $.comparison),
      field("right", choice($.number, $.string, $.boolean, "null")), "]"),
    attachment: $ => seq("::", $.identifier),
    class: $ => seq(".", $.identifier),
    layer: $ => seq("#", $.identifier),
    comparison: $ => choice("!=", ">=", ">", "=~", "=", "<=", "<"),
    url: $ => seq("url(", $.url_value, ")"),
    url_value: $ => choice($.string, $.unquoted_url),
    unquoted_url: $ => /[!#$%&*-~]+/,
    color_keyword: $ => choice("aliceblue", "antiquewhite", "aqua", "aquamarine", "azure", "beige", "bisque", "black", "blanchedalmond", "blue", "blueviolet", "brown", "burlywood", "cadetblue", "chartreuse", "chocolate", "coral", "cornflowerblue", "cornsilk", "crimson", "cyan", "darkblue", "darkcyan", "darkgoldenrod", "darkgray", "darkgreen", "darkgrey", "darkkhaki", "darkmagenta", "darkolivegreen", "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategrey", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgray", "dimgrey", "dodgerblue", "firebrick", "floralwhite", "forestgreen", "fuchsia", "gainsboro", "ghostwhite", "gold", "goldenrod", "gray", "grey", "green", "greenyellow", "honeydew", "hotpink", "indianred", "indigo", "ivory", "khaki", "lavender", "lavenderblush", "lawngreen", "lemonchiffon", "lightblue", "lightcoral", "lightcyan", "lightgoldenrodyellow", "lightgray", "lightgreen", "lightgrey", "lightpink", "lightsalmon", "lightseagreen", "lightskyblue", "lightslategray", "lightslategrey", "lightsteelblue", "lightyellow", "lime", "limegreen", "linen", "magenta", "maroon", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen", "mediumturquoise", "mediumvioletred", "midnightblue", "mintcream", "mistyrose", "moccasin", "navajowhite", "navy", "oldlace", "olive", "olivedrab", "orange", "orangered", "orchid", "palegoldenrod", "palegreen", "paleturquoise", "palevioletred", "papayawhip", "peachpuff", "peru", "pink", "plum", "powderblue", "purple", "red", "rosybrown", "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen", "seashell", "sienna", "silver", "skyblue", "slateblue", "slategray", "slategrey", "snow", "springgreen", "steelblue", "tan", "teal", "thistle", "tomato", "turquoise", "violet", "wheat", "white", "whitesmoke", "yellow", "yellowgreen", "transparent"),
    color_hex_long: $ => seq("#", /[0-9a-fA-F]{6}/),
    color_hex_short: $ => seq("#", /[0-9a-fA-F]{3}/),
    color: $ => choice($.color_hex_long, $.color_hex_short, $.color_keyword),
    number: $ => /[0-9.-]+/,
    values: $ => commaSep1($.value, ","),
    string: $ => choice(seq("'", /[^']*/, "'"), seq('"', /[^"]*/, '"')),
    percentage: $ => seq($.number, "%"),
    keyword: $ => $.identifier,
    variable: $ => seq("@", $.identifier),
    boolean: $ => choice("true", "false"),
    string_expr: $ => commaSep1(choice($.string, $.field), "+"),
    factor: $ => choice(seq("(", $.expression, ")"), $.number, $.variable),
    exp_term: $ => choice(seq($.factor, $.high_prec_operator, $.exp_term), $.factor),
    expression: $ => choice(seq($.exp_term, $.low_prec_operator, $.expression), $.exp_term),
    high_prec_operator: $ => choice("*", "/"),
    low_prec_operator: $ => choice("+", "-"),
    function: $ => seq($.identifier, "(", $.values, ")"),
    field: $ => seq("[", $.identifier, "]"),
    value: $ => choice($.url, $.boolean, $.string_expr, $.percentage, $.expression, $.color, $.function, $.keyword),
    declaration: $ => seq(optional(seq($.instance, "/")), $.property, ":", $.values),
    property: $ => $.identifier,
    instance: $ => $.identifier,
    identifier: $ => /[A-Za-z][A-Za-z0-9_-]*/,
    comment: $ => token(choice(
      seq('//', /[^\n\r]*/),
      seq(
        '/*',
        /[^*]*\*+([^/*][^*]*\*+)*/,
        '/'
      )
    )),
  }
});

function commaSep1(rule, separator) {
  return prec.left(seq(
    rule,
    repeat(seq(
      separator,
      rule
    ))
  ))
}
