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
	switch(type) {
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
	// onclick('qr')
	onclick('clipboard', function() {
		setClipboard(location.protocol + '//' + this.parentNode.parentNode.children[0].innerText);
		// No idea why firstChild won't work
	});
}

document.addEventListener('DOMContentLoaded', function() {
	reload();
	var url = document.getElementById('url');
	var submit = document.getElementById('submit');
	var readable = document.getElementById('readable');
	var links = document.getElementsByClassName('links')[0];
	function create() {
		get('/new?url=' + encodeURIComponent(url.value) + '&readable=' + readable.value, function(err, res) {
			var json = JSON.parse(res);
			console.log(json);
			var outer = document.createElement('div');
			outer.appendChild(document.createTextNode(location.host + '/' + json.short));
			var inner = document.createElement('div');
			inner.appendChild(a('/qr/' + json.short, 'qr'));
			inner.appendChild(icon('qr'));
			inner.appendChild(icon('info'));
			inner.appendChild(a('/big/' + json.short, 'expand'));
			inner.appendChild(a('/' + json.short, 'open'));
			if (links.length === 10) { links.removeChild(links.lastChild); }
			links.insertBefore(outer, links.firstChild);
			reload();
		});
	}
	url.onkeydown = function(key) {	if (key.keyCode === 13) create(); };
	submit.onclick = function() { create(); };
});