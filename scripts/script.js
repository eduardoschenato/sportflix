document.addEventListener("DOMContentLoaded", event => { 
    gapi.load("client:auth2", () => {
        gapi.auth2.init({client_id: clientId});
        gapi.auth2.getAuthInstance().signIn({
            scope: "https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtubepartner"
        }).then(() => {}, err => {}).then(() => {
            gapi.client.setApiKey(apiKey);
            gapi.client.load("https://content.googleapis.com/discovery/v1/apis/youtube/v3/rest").then(
                async () => { 
                    await channels.forEach(async (channel, channelIndex) => {
                        let videos = await getVideosApi(channel.playlistId, 0, channel.reverseOrder, undefined);
                        channel.videos = channel.videos.concat(videos);

                        let titleContainerDiv = createTitleContainerDiv(channel, false);

                        let videoContainerDiv = document.createElement('div');
                        videoContainerDiv.className = "grid 2xl:grid-cols-6 xl:grid-cols-6 lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 grid-cols-2 border-double border-indigo-300 py-3";

                        if(channel.reverseOrder) {
                            channel.videos.reverse();
                        }

                        channel.videos.slice(0, 6).forEach((video, videoIndex) => {
                            videoContainerDiv.appendChild(createVideoContentDiv(video, channel));

                            if(channelIndex == 0 && videoIndex == 0) {
                                setMainVideo(video, channel);
                            }
                        });
                            
                        document.querySelector(".main-frame").appendChild(titleContainerDiv);
                        document.querySelector(".main-frame").appendChild(videoContainerDiv);
                        
                        document.querySelector("#loader").style.display = "none";
                        document.querySelector("#content").style.display = "flex";
                        document.querySelector("#footer").style.display = "grid";
                    });
                }, err => console.log("Erro ao carregar a API do Google")
            );
        });
    });

    window.addEventListener('resize', resizeIframe());

});