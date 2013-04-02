var req = new XMLHttpRequest();
var clickPointX;
var clickPointY;
var isPopUpBoxSetted = false;

function doubleClickSearch(searchWord) {
	req.open("GET", "http://dict-co.iciba.com/api/dictionary.php?w=" + searchWord, true);
	req.onload = showProns;
	req.send(null);
}

function showProns() {
	var prons = req.responseXML.getElementsByTagName("pos");
	var resultList = document.getElementById('icibaResultList');
	var innerHTMLText = "";
	if (prons.length == 0) {
		innerHTMLText = "无匹配翻译";
	} else {
		for (var i = 0, pron; pron = prons[i]; i++) {
			var wordType = pron.textContent;
			var acceptation = pron.nextSibling;
			while (acceptation.nodeType != 1) {
				acceptation = acceptation.nextSibling;
			}
			var wordChinese = acceptation.textContent;
			innerHTMLText += "<li>" + wordType + ": " + wordChinese + "</li>"
		}
	}
	resultList.innerHTML = innerHTMLText;
}

function hideResult(e) {
	var icibaResultDiv = document.getElementById('icibaResultDiv');
	icibaResultDiv.setAttribute("style", "display:none;");
}

// double click function

function dblclick(e) {
	clickPointX = e.pageX;
	clickPointY = e.pageY;
	var selectWord = getSelectedText();
	//TO-DO selectWord validation
	if (selectWord.length == 0) {
		return;
	}
	var style = "position:absolute;left:" + clickPointX + "px;top:" + (clickPointY + 10) + "px;z-index:9999;background-color:#EFF3FF;border:1px solid #B5C6DE;padding:4px;";
	var icibaResultDiv = document.getElementById('icibaResultDiv');
	icibaResultDiv.setAttribute("style", style);
	document.getElementById('icibaResultList').innerHTML = "正在查询...";
	doubleClickSearch(selectWord);
}

function getSelectedText() {
	return window.getSelection().toString().toLowerCase().replace(/^\s+|\s+$/g, '');
}

chrome.extension.onMessage.addListener(function(req) {
	if (req.msg == 'on') {
		if (!isPopUpBoxSetted) {
			var div = document.createElement("div");
			var ol = document.createElement("ol");
			ol.setAttribute("id", "icibaResultList");
			div.setAttribute("id", "icibaResultDiv");
			div.appendChild(ol);
			document.body.appendChild(div);
			isPopUpBoxSetted = true;

			var link = document.createElement("link");
			link.href = chrome.extension.getURL("iciba_style.css");
			link.type = "text/css";
			link.rel = "stylesheet";
			link.id = "iciba_style";
			document.head.appendChild(link);
		}
		document.body.addEventListener('dblclick', dblclick);
		document.body.addEventListener('click', hideResult);
	}
});

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	if (request.method == "getSelectedText") {
		var text = getSelectedText();
		sendResponse({
			data: text,
			method: "getSelectedText"
		});
	}
});