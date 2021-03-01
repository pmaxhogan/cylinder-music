const data = {
    auth: "Bearer " + JSON.parse(decodeURIComponent(document.querySelector(`meta[name="desktop-music-app/config/environment"]`).getAttribute("content"))).MEDIA_API.token,
    token: document.cookie.split("; ").find(row => row.startsWith("media-user-token")).replace("media-user-token=", "")
};
