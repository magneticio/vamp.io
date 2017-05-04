// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {

    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

function codeAddress() {

  var path = window.location.pathname.split('/').filter(function(n){ return n });

  if (path.length < 2 || path[0] != 'api') return;

  document.getElementById("versions").hidden = false;

  var current = document.getElementById("version").value;

  if (/^\d+\.\d+\.\d+$/.test(path[1]) && current != path[1])
    document.getElementById("version-note-1").hidden = false;
  else if (current != path[1])
    document.getElementById("version-note-2").hidden = false;

  var dropdown = document.getElementById("version-dropdown");
  var a = document.createElement("a");
  a.href = 'javascript:void(0)';
  a.className = 'dropbtn';
  a.text = path[1];
  a.onclick = function() {
    document.getElementById("version-selection").classList.toggle("show");
  };
  dropdown.appendChild(a);

  pegasus(base_url + "/index.json").then(function(e, n) {

    var versions = [];

    e.docs.map(function(t) {
      var item = t.location.split('/').filter(function(n){ return n });
      if (item.length < 2 || item[0] != 'api') return;

      var equal = false;
      if (path.length == item.length) {
         var equal = true;
         for (var i = 0; i < path.length; i++) {
           equal = equal && (i == 1 || path[i] == item[i]);
           if (!equal) break;
         }
      }

      if (equal) versions.push(item[1]);
    });

    var relative = path.slice(2);
    var dropdown = document.getElementById("version-selection");

    for (var i = 0; i < versions.length; i++) {
      var a = document.createElement("a");
        a.href = '/api/' + versions[i] + '/' + relative.join('/');
        a.text = versions[i];
        dropdown.appendChild(a);
    }

  }, function(t, e) {
      console.error(t, e.status)
  });
}
window.onload = codeAddress;
