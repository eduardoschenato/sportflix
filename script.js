var channels = [
    { 
        name: "MLB",
        url: "https://www.youtube.com/user/MLB",
        playlistId: "PLL-lmlkrmJalROhW3PQjrTD6pHX1R0Ub8",
        videos: []
    },
    { 
        name: "NHL",
        url: "https://www.youtube.com/user/NHLVideo",
        playlistId: "PL1NbHSfosBuHInmjsLcBuqeSV256FqlOO",
        videos: []
    },
    { 
        name: "Super Rugby Trans Tasman",
        url: "https://www.youtube.com/user/SanzarRugby",
        playlistId: "PL3Ypd5NbZr_GBj1n3Sk5pymwquWKoHMEu",
        videos: []
    },
    { 
        name: "Premiership Rugby",
        url: "https://www.youtube.com/user/PremiershipRugby",
        playlistId: "PL10-iuZDt9bTxMufBaKe0Fg3XBrMFNd46",
        videos: []
    },
    { 
        name: "Top 14",
        url: "https://www.youtube.com/channel/UCWrD2VhZdO-_W8QDBxiXmeg",
        playlistId: "PLrYk229EnmBqH2OW5W6uGNDNfIVbO3V5L",
        videos: []
    },
    { 
        name: "Pro14 Rainbow Cup SA",
        url: "https://www.youtube.com/user/RaboDirectPRO12",
        playlistId: "PLclPnIJd8nRueC0RjYM4JtB2aYt7Jezni",
        videos: []
    }
];

document.addEventListener("DOMContentLoaded", function(event) { 
    gapi.load("client:auth2", function() {
        gapi.auth2.init({client_id: "CLIENT_ID_HERE"});
        gapi.auth2.getAuthInstance().signIn({
            scope: "https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtubepartner"
        }).then(
            function() { }, 
            function(err) { }
        ).then(function() {
            gapi.client.setApiKey("API_KEY_HERE");
            gapi.client.load("https://content.googleapis.com/discovery/v1/apis/youtube/v3/rest").then(
                function() { 
                    channels.forEach(function(channel, channelIndex) {
                        let h2 = document.createElement('h2');
                        h2.className = "text-3xl float-left font-bold text-indigo-300";
                        h2.innerHTML = channel.name;
                        
                        let link = document.createElement('a');
                        link.className = "float-right bg-black text-white border-2 border-white border-solid px-3 py-1 transition duration-500 ease-in-out transform hover:bg-indigo-300 hover:border-indigo-300 hover:text-black";
                        link.innerHTML = "Ver mais";
                        link.href = channel.url;
                        link.target = "_blank";

                        let titleDiv = document.createElement('div');
                        titleDiv.className = "relative flex-1 mx-3 my-2 shadow-lg sm:p-0";
                        titleDiv.appendChild(h2);
                        titleDiv.appendChild(link);
                        
                        let titleContainerDiv = document.createElement('div');
                        titleContainerDiv.className = "grid grid-cols-1 border-t-2";
                        titleContainerDiv.appendChild(titleDiv);

                        let videoContainerDiv = document.createElement('div');
                        videoContainerDiv.className = "grid 2xl:grid-cols-6 xl:grid-cols-6 lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 grid-cols-2 border-double border-indigo-300 py-3";

                        gapi.client.youtube.playlistItems.list({
                            "part": ["snippet"],
                            "maxResults": 20,
                            "playlistId": channel.playlistId
                        }).then(
                            function(response) {
                                response.result.items.map(function(item) {

                                    return {
                                        id: item.snippet.resourceId.videoId,
                                        name: item.snippet.title,
                                        date: new Date(item.snippet.publishedAt)
                                    };

                                }).filter(function (item) {

                                    return item.name != "Deleted video" && item.name != "Private video"

                                }).slice(0, 6).forEach(function(video, videoIndex) {

                                    let img = document.createElement('img');
                                    img.className = "object-cover";
                                    img.src = "https://i.ytimg.com/vi/" + video.id + "/hq720.jpg";
                                    img.innerHTML = channel.name;
                                    
                                    let titleP = document.createElement('p');
                                    titleP.className = "text-lg text-center";
                                    titleP.innerHTML = video.name;
                                    
                                    let subtitleP = document.createElement('p');
                                    subtitleP.className = "text-center";
                                    subtitleP.innerHTML = video.date.toLocaleDateString();

                                    let videoBoxDiv = document.createElement('div');
                                    videoBoxDiv.className = "max-w-md mx-auto text-white cursor-pointer transition duration-500 ease-in-out transform hover:bg-indigo-300 hover:text-black video-list-element";
                                    videoBoxDiv.appendChild(img);
                                    videoBoxDiv.appendChild(titleP);
                                    videoBoxDiv.appendChild(subtitleP);
                                    videoBoxDiv.dataset.videoId = video.id;
                                    videoBoxDiv.dataset.videoName = video.name;
                                    videoBoxDiv.dataset.videoGroup = channel.name;
                                    videoBoxDiv.dataset.videoDate = video.date;
                                    
                                    videoBoxDiv.addEventListener("click", function() {
                                        let date = new Date(this.dataset.videoDate);

                                        document.querySelector(".main-video-iframe").src = "https://www.youtube.com/embed/" + this.dataset.videoId;
                                        document.querySelector(".main-video-iframe").title = this.dataset.videoName;
                                        document.querySelector(".main-video-title").innerHTML = this.dataset.videoName;
                                        document.querySelector(".main-video-subtitle").innerHTML = this.dataset.videoGroup + " - " + date.toLocaleDateString();

                                        window.scrollTo({
                                            top: 0, 
                                            behavior: 'smooth'
                                        });
                                    });

                                    let videoContentDiv = document.createElement('div');
                                    videoContentDiv.className = "relative mx-3 bg-black shadow-lg sm:p-0";
                                    videoContentDiv.appendChild(videoBoxDiv);
                                    
                                    videoContainerDiv.appendChild(videoContentDiv);

                                    if(channelIndex == 0 && videoIndex == 0) {
                                        let date = new Date(video.date);
                                        document.querySelector(".main-video-iframe").src = "https://www.youtube.com/embed/" + video.id;
                                        document.querySelector(".main-video-iframe").title = video.name;
                                        document.querySelector(".main-video-title").innerHTML = video.name;
                                        document.querySelector(".main-video-subtitle").innerHTML = channel.name + " - " + date.toLocaleDateString();
                                    }

                                });
                                    
                                document.querySelector(".main-frame").appendChild(titleContainerDiv);
                                document.querySelector(".main-frame").appendChild(videoContainerDiv);
                            }, function(err) { 
                                console.log("Erro ao buscar a playlist");
                            }
                        );
                    })
                }, function(err) { 
                    console.log("Erro ao carregar a API do Google"); 
                }
            );
        });
    });

    window.addEventListener('resize', function() {
        if(window.innerWidth < 1280) {
            document.querySelector(".main-video-iframe").width = window.innerWidth;
            document.querySelector(".main-video-iframe").height = window.innerWidth * 0.5625;
        } else {
            document.querySelector(".main-video-iframe").width = 1280;
            document.querySelector(".main-video-iframe").height = 720;
        }
    });
});