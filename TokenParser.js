module.exports = function TokenStream(input) {
  var current = null;
  return {
      next  : next,
      peek  : peek,
      eof   : eof,
      croak : input.croak
  };
  function is_digit(ch) {
      return /[0-9]/i.test(ch);
  }
  function is_op_char(ch) {
      return "+-*/%=&|<>!".indexOf(ch) >= 0;
  }
  function is_text(ch) {
    return "abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ_".indexOf(ch) >= 0;
  }
  function is_eql(ch) {
      return "=".indexOf(ch) >= 0;
  }
  function is_punc(ch) {
      return ",;(){}[]".indexOf(ch) >= 0;
  }
  function is_whitespace(ch) {
      return " \t\n\r".indexOf(ch) >= 0;
  }
  function read_while(predicate) {
      var str = "";
      while (!input.eof() && predicate(input.peek()))
          str += input.next();
      return str;
  }
  function read_number() {
      var has_dot = false;
      var number = read_while(function(ch){
          if (ch == ".") {
              if (has_dot) return false;
              has_dot = true;
              return true;
          }
          return is_digit(ch);
      });
      return { type: "num", value: parseFloat(number) };
  }
  function read_whole_text() {
    var tag = '';
    while (!input.eof()) {
      var ch = input.next();
      if (!is_text(ch)) {
        break;
      } else {
        tag += ch;
      }
    }
    return tag
  }
  function read_text() {
    return { type: "tag", value: read_whole_text() };
  }
  function read_escaped(end) {
      var escaped = false, str = "";
      input.next();
      while (!input.eof()) {
          var ch = input.next();
          if (escaped) {
              str += ch;
              escaped = false;
          } else if (ch == "\\") {
              escaped = true;
          } else if (ch == end) {
              break;
          } else {
              str += ch;
          }
      }
      return str;
  }
  function read_string() {
      return { type: "str", value: read_escaped('"') };
  }
  function skip_comment() {
      read_while(function(ch){ return ch != "\n" });
      input.next();
  }
  function read_next() {
      read_while(is_whitespace);
      if (input.eof()) return null;
      var ch = input.peek();

      if (ch == "#") {
          skip_comment();
          return read_next();
      }
      if (ch == '"') return read_string();
      if (is_digit(ch)) return read_number();
      if (is_punc(ch)) return {
          type  : "punc",
          value : input.next()
      };
      if (is_op_char(ch)) return {
          type  : "op",
          value : read_while(is_op_char)
      };
      if (is_text(ch)) return read_text();
      
      input.croak("Can't handle character: " + ch);
  }
  function peek() {
      return current || (current = read_next());
  }
  function next() {
      var tok = current;
      current = null;
      return tok || read_next();
  }
  function eof() {
      return peek() == null;
  }
}