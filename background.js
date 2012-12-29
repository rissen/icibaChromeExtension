chrome.tabs.onUpdated.addListener(function(id, data, tab) {
	if (data.status == "complete") {
		chrome.tabs.sendMessage(tab.id, {
			"msg" : "on"
		});
	}
});