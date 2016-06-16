contract log {
  event Log(string _message);

  function log(string _message) {
    Log(_message);
  }
}
