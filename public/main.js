const sendMessage = () => chrome.runtime.sendMessage("afdbmklobajejkgldodnlniiifdjjjgo", "hello", data => {
    app.noExtensionData = false;
    if(data && data.auth && data.token){
        app.auth = data.auth;
        app.token = data.token;
        app.getImageUrls();
    }else if(data){
        app.noExtensionData = true;
    }
});

sendMessage();
onfocus = sendMessage;

function shuffle(array){
    for(let i = array.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * i)
        const temp = array[i]
        array[i] = array[j]
        array[j] = temp
    }
    return array;
}

Vue.component("simple-btn", {
    template: "#simple-btn-template",
    data: () => ({
        isInset: false
    }),
    methods: {
        click: function (){
            this.isInset = true;
            setTimeout(() => this.isInset = false, 250);
            this.$emit("click");
        }
    }
})

function downloadURI(uri, name) {
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

var app = new Vue({
    el: 'main',
    data: {
        path: './cover/',
        imgSize: 70,
        imgPos: 0,
        bkgSize: 100,
        albums: [],
        speed: 15,
        enableAnimation: true,
        showHeader: true,
        showDelete_: false,
        auth: null,
        token: null,
        loading: false,
        manual: false,
        noExtensionData: false,
        showManualInstructions: false
    },
    computed: {
        isChrome: () => window.chrome !== undefined,
        showDelete: {
            get: function () {
                console.log("get", this);
                return this.showDelete_;
            },
            set: function (val) {
                this.showDelete_ = val;
                if (val) {
                    setTimeout(() => this.showDelete_ = false, 3000);
                }
            }
        }
    },
    methods: {
        installExtension: () => {
            open("https://chrome.google.com/webstore/detail/_/gijoaonnheenchojibacemefgekdkkki");
        },
        getImageUrls: async function(){
            if(localStorage.getItem("albums")){
                this.albums = JSON.parse(localStorage.getItem("albums"));
                return;
            }
            if(!this.token || !this.auth) return;

            this.loading = true;
            const albums = await (await fetch(`https://cylinder-music.herokuapp.com/api/getAlbums?auth=${encodeURIComponent(this.auth)}&token=${encodeURIComponent(this.token)}`)).json()
            this.loading = false;

            this.albums = albums.filter(album => album.attributes.artwork && album.attributes.artwork.url).filter(Boolean).map(album => ({
                url: album.attributes.artwork.url,
                artist: album.attributes.artistName,
                name: album.attributes.name,
                trackCount: album.attributes.trackCount,
                releaseDate: new Date(album.attributes.releaseDate),
                genre: album.attributes.genreNames[0],
                position: 0
            }))
            localStorage.setItem("albums", JSON.stringify(this.albums));
        },
        deleteData: function(){
            this.albums = [];
            localStorage.removeItem("albums");
        },
        cardStyles: function(album){
            const baseSize = app.imgSize * (app.bkgSize / 100)
            const size = Math.ceil(baseSize <= 80 ? "80" : (baseSize <= 150 ? "150" : (baseSize <= 300 ? "300" : (baseSize <= 1000 ? "1000" : 150))));
            return {
                width: this.imgSize + 'px',
                height: this.imgSize + 'px',
                backgroundImage: `url(${album.url.replace("{w}", size).replace("{h}", size)})`,
                backgroundSize: `${this.bkgSize}% ${this.bkgSize}%`,
                backgroundPosition: `${album.position}px ${album.position}px`
            }
        },
        reverseOrder: function(){
            this.albums.reverse();
        },
        randomOrder: function(){
            shuffle(this.albums);

            // :(
            this.$forceUpdate();
        },
        sortByGenre: function(){
            this.albums.sort((a, b) => a.genre > b.genre ? 1 : (a.genre < b.genre ? -1 : 0))
        },
        sortByName: function(){
            this.albums.sort((a, b) => a.name > b.name ? 1 : (a.name < b.name ? -1 : 0))
        },
        sortByReleaseDate: function(){
            this.albums.sort((a, b) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime())
        },
        sortByTrackCount: function(){
            this.albums.sort((a, b) => a.trackCount - b.trackCount)
        },
        resetPos: function(){
            this.albums.forEach(album => album.position = 0);
        },
        imgSizeFit: function () {
            this.imgSize += (innerWidth % this.imgSize) / Math.floor(innerWidth / this.imgSize)
        }
    },
    mounted: function () {
        console.log("mounted");
        this.getImageUrls();

        let lastTime = 0;
        const animate = (timestamp) => {
            if(lastTime && this.speed > 0 && this.enableAnimation) this.albums.forEach(album => album.position += (timestamp - lastTime) / this.speed);
            requestAnimationFrame(animate);
            lastTime = timestamp;
        };
        requestAnimationFrame(animate);


        this.$el.addEventListener("keydown", function(e) {
            // space and arrow keys
            if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
                e.preventDefault();
            }
        }, false);
    }
})
