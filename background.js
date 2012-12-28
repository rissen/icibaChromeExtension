/*
function updateIcon() {
	chrome.browserAction.setPopup({popup:"popup.html"});
	var searchInput = document.getElementById('searchInput');
	searchInput.value='add';
}

chrome.browserAction.onClicked.addListener(updateIcon);
//updateIcon();
 */

//chrome.tabs.onCreated.addListener(function(tab) {
//	chrome.tabs.sendMessage(tab.id, {"msg": "on"});
//});
chrome.tabs.onUpdated.addListener(function(id, data, tab) {
	if (data.status == "complete") {
		chrome.tabs.sendMessage(tab.id, {
			"msg" : "on"
		});
	}
});
