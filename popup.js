var req = new XMLHttpRequest();
var icibaAPIBaseURL = "http://dict-co.iciba.com/api/dictionary.php?w=";

function search() {
	var word = document.getElementById("searchInput").value.toLowerCase();
	var resultList = document.getElementById('resultList');
	resultList.innerHTML = "正在查询...";
	req.open("GET", icibaAPIBaseURL + word, true);
	req.onload = showProns;
	req.send(null);
}

function showProns() {
	var prons = req.responseXML.getElementsByTagName("pos");
	var resultList = document.getElementById('resultList');
	var innerHTMLText = "";
	if (prons.length == 0) {
		innerHTMLText = "无匹配的翻译."
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

function searchButtonOnClick(e) {
	search();
}

function searchInputKeydown(e) {
	if (e.keyCode == 13) {
		search();
	}
}

document.addEventListener('DOMContentLoaded', function() {
	var searchButton = document.getElementById('searchButton');
	searchButton.addEventListener('click', searchButtonOnClick);
	var searchInput = document.getElementById('searchInput');
	searchInput.addEventListener('keydown', searchInputKeydown);
	searchInput.focus();

	// translate the seletced word
	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.sendRequest(tab.id, {
			method: "getSelectedText"
		}, function(response) {
			if (response.method == "getSelectedText") {
				var selectedText = response.data;
				// TO-DO text validation
				if (selectedText.length != 0) {
					searchInput.value = selectedText;
					var event = document.createEvent("HTMLEvents");
					event.initEvent('click', true, true);
					searchButton.dispatchEvent(event);
				}
			}
		});
	});
});