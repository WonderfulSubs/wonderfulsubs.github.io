// videojs.Hls.xhr.beforeRequest = function (options) {
//   if (options.uri.indexOf('.xyz') === -1) return options;
//   var xhttp = new XMLHttpRequest();
//   xhttp.onreadystatechange = function () {
//     if (this.readyState == 4 && this.status == 200) {
//       console.log(xhttp.responseText);
//       options.uri = 'yolo';
//       return options;
//     }
//   };
//   xhttp.open("GET", "/api/v1/media/segment?link=" + encodeURIComponent(options.uri), true);
//   xhttp.send();
// };