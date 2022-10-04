async function getVideosApi(playlistId, playlistIdIndex, reverse, nextPageToken) {
    let props = {};
    
    if(!Array.isArray(playlistId)) {
        playlistId = [playlistId];
    }
    
    if(nextPageToken === undefined) {
        props = {
            "part": ["snippet"],
            "maxResults": maxResults,
            "playlistId": playlistId[playlistIdIndex]
        };
    } else {
        props = {
            "part": ["snippet"],
            "maxResults": maxResults,
            "playlistId": playlistId[playlistIdIndex],
            "pageToken": nextPageToken
        };
    }
        
    let response = await gapi.client.youtube.playlistItems.list(props);
    
    let videos = processVideosApi(response.result.items);

    if(reverse && response.result.nextPageToken) {
        videos = videos.concat(await getVideosApi(playlistId, reverse, response.result.nextPageToken));
    }

    if(reverse && !response.result.nextPageToken && (playlistId.length - 1 > playlistIdIndex)) {
        videos = videos.concat(await getVideosApi(playlistId, (playlistIdIndex + 1), reverse, response.result.nextPageToken));
    }

    return videos;
}

function processVideosApi(videos) {
    return videos.map(item => {
        return {
            id: item.snippet.resourceId.videoId,
            name: item.snippet.title,
            date: new Date(item.snippet.publishedAt)
        };
    }).filter(item => item.name != "Deleted video" && item.name != "Private video");
}

function resizeIframe() {
    if(window.innerWidth < 1200) {
        document.querySelector(".main-video-iframe").width = window.innerWidth - 20;
        document.querySelector(".main-video-iframe").height = (window.innerWidth - 20) * 0.5625;
    } else {
        document.querySelector(".main-video-iframe").width = 1152;
        document.querySelector(".main-video-iframe").height = 648;
    }
}

function setMainVideo(video, channel) {
    let date = new Date(video.date);
    document.querySelector(".main-video-iframe").src = "https://www.youtube.com/embed/" + video.id + "?autoplay=1&controls=0&rel=0&showinfo=0";
    document.querySelector(".main-video-iframe").title = video.name;
    document.querySelector(".main-video-title").innerHTML = video.name;
    document.querySelector(".main-video-subtitle").innerHTML = channel.name + " - " + date.toLocaleDateString();
}

function watchVideo(thumbnail) {
    let date = new Date(thumbnail.dataset.videoDate);

    document.querySelector(".main-video-iframe").src = "https://www.youtube.com/embed/" + thumbnail.dataset.videoId + "?autoplay=1&controls=0&rel=0&showinfo=0";
    document.querySelector(".main-video-iframe").title = thumbnail.dataset.videoName;
    document.querySelector(".main-video-title").innerHTML = thumbnail.dataset.videoName;
    document.querySelector(".main-video-subtitle").innerHTML = thumbnail.dataset.videoGroup + " - " + date.toLocaleDateString();

    window.scrollTo({
        top: 0, 
        behavior: 'smooth'
    });
}

function createVideoContentDiv(video, channel) {
    let img = document.createElement('img');
    img.className = "object-cover";
    img.src = "https://i.ytimg.com/vi/" + video.id + "/hqdefault.jpg";
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
        watchVideo(this);
    });

    let videoContentDiv = document.createElement('div');
    videoContentDiv.className = "relative mx-3 bg-black shadow-lg sm:p-0";
    videoContentDiv.appendChild(videoBoxDiv);

    return videoContentDiv;
}

function createTitleContainerDiv(channel, showBack) {
    let h2 = document.createElement('h2');
    h2.className = "text-3xl float-left font-bold text-indigo-300";
    h2.innerHTML = channel.name;
    
    let link = document.createElement('a');
    link.className = "float-right bg-black text-white border-2 border-white border-solid px-3 py-1 transition duration-500 ease-in-out transform hover:bg-indigo-300 hover:border-indigo-300 hover:text-black";
    link.innerHTML = "Ver mais";
    
    if(showBack) {
        link.href = channel.url;
    } else {
        link.href = "canal/" + channel.link;
    }

    let titleDiv = document.createElement('div');
    titleDiv.className = "relative flex-1 mx-3 my-2 shadow-lg sm:p-0";
    titleDiv.appendChild(h2);
    titleDiv.appendChild(link);

    if(showBack) {
        let linkVoltar = document.createElement('a');
        linkVoltar.className = "float-right bg-black text-white border-2 border-white border-solid px-3 py-1 transition duration-500 ease-in-out transform hover:bg-indigo-300 hover:border-indigo-300 hover:text-black";
        linkVoltar.innerHTML = "Voltar para a home";
        linkVoltar.href = document.querySelector('base').href;
        
        titleDiv.appendChild(linkVoltar);
    }
    
    let titleContainerDiv = document.createElement('div');
    titleContainerDiv.className = "grid grid-cols-1 border-t-2";
    titleContainerDiv.appendChild(titleDiv);

    return titleContainerDiv;
}