function get(url, cb) {
	var http = new XMLHttpRequest();
	http.onreadystatechange = function() {
		if (http.readyState === 4) {
			if (http.status === 200) {
				cb(null, http.responseText);
			} else {
				cb(new Error(http.statusText));
			}
		}
  };
	http.open('GET', url, true);
	http.send();
}

function a(href, type) {
	var el = document.createElement('a');
	el.href = href;
	el.target = '_blank';
	el.appendChild(icon(type));
	return el;
}

function icon(type) {
	var el = document.createElement('span');
	el.setAttribute('class', 'icon-' + type);
	switch (type) {
		case 'qr':
			el.title = 'Display as QR code';
			break;
		case 'clipboard':
			el.title = 'Copy link to clipboard';
			break;
		case 'info':
			el.title = 'Get info and stats';
			break;
		case 'expand':
			el.title = 'Showcase link';
			break;
		case 'open':
			el.title = 'Open link';
			break;
	}
	return el;
}

function onclick(icons, func) {
	var els = document.getElementsByClassName('icon-' + icons);
	for (var i = 0; i < els.length; i++) {
		els[i].onclick = func;
	}
}

function setClipboard(text) {
	var c = document.createElement('textarea');
	c.id = 'c';
	c.innerHTML = text;
	c.style = 'position: fixed; top: 0; left: 0; width: 2em; height: 2em; padding: 0; border: none; outline: none; box-shadow: none';
	document.body.append(c);
	c.focus();
	c.select();
	if (document.execCommand('copy')) document.execCommand('copy');
	else if (window.clipboardData.setData) window.clipboardData.setData('Text', text);
	else window.prompt('Your browser doesn\'t support copying, just press CTRL+C to copy the text', text);
	c.parentNode.removeChild(c);
}

function reload() {
	onclick('clipboard', function() {
		setClipboard(this.parentNode.parentNode.children[0].innerText);
		// No idea why firstChild won't work
	});
	var url = document.getElementById('url');
	var submit = document.getElementById('submit');
	var readable = document.getElementById('readable');
	var links = document.getElementsByClassName('links')[0];
	while (links.children.length >= 10) { links.removeChild(links.lastChild); }
	readable.checked = false;
	function create() {
		var value = url.value;
		url.value = '';
		get('/new?url=' + encodeURIComponent(value) + '&readable=' + readable.value, function(err, res) {
			if (err) return alert('Error: ' + err);
			var json = JSON.parse(res);
			console.log(json);
			var outer = document.createElement('div');
			var span = document.createElement('span');
			span.appendChild(document.createTextNode(location.protocol + '//' + location.host + '/' + json.short));
			outer.appendChild(span);
			var inner = document.createElement('div');
			inner.setAttribute('class', 'right');
			inner.appendChild(a('/qr/' + json.short, 'qr'));
			inner.appendChild(icon('clipboard'));
			inner.appendChild(icon('info'));
			inner.appendChild(a('/big/' + json.short, 'expand'));
			inner.appendChild(a('/' + json.short, 'open'));
			outer.appendChild(inner);
			if (links.children.length === 0) { document.getElementsByTagName('h3')[0].innerText = 'Your Links'; }
			links.insertBefore(outer, links.firstChild);
			reload();
		});
	}
	url.onkeydown = function(key) {	if (key.keyCode === 13) create(); };
	submit.onclick = function() { create(); };
}

document.addEventListener('DOMContentLoaded', reload);