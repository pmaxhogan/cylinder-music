chrome.storage.sync.get("data", (data) => {
    if(!data || !data.data){
        chrome.tabs.create({url: "https://music.apple.com/us/browse?closeMe"}, console.log)
    }
});

chrome.runtime.onMessageExternal.addListener((_, data, reply) => {
    if(data.origin !== "https://cylinder-music.web.app") return;

    chrome.storage.sync.get("data", ({data}) => reply(JSON.parse(data)));
});
