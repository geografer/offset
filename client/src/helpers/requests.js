function isJSON(string) {
  if (string !== null && typeof string === 'object')
    return true;
  return false;
}

function parameterize(obj) {
  var parameterString = "";
  var firstParam = true;

  Object.keys(obj).forEach(function(k){
      if (!firstParam)
        parameterString += "&"

      parameterString += encodeURIComponent(k)+"="+encodeURIComponent(obj[k]);
      firstParam = false;
  });

  return parameterString;
}

export function APIRequest(endpoint, verb, params, done, error = function(err) { console.log(err) }) {
  if (isJSON(params))
    params = parameterize(params);

  var xhr = new XMLHttpRequest();
  xhr.open(verb, endpoint, true);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        done(JSON.parse(xhr.responseText));
      }
      else {
        error(xhr.responseText);
      }
    }
  }
  xhr.send(params);
}
