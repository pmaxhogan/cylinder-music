const tokenPath = document.cookie.split("; ").find(row => row.startsWith("media-user-token"));

if(tokenPath) {
    chrome.storage.sync.set({
        data: JSON.stringify({
            auth: "Bearer " + JSON.parse(decodeURIComponent(document.querySelector(`meta[name="desktop-music-app/config/environment"]`).getAttribute("content"))).MEDIA_API.token,
            token: tokenPath.replace("media-user-token=", "")
        })
    }, () => {
        if (location.href.endsWith("?closeMe")) close();
    })
}else{
    chrome.storage.sync.set({data: {}});
}
