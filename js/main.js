(function(){
    function $(idElem) {
        return document.querySelector(idElem);
    }

    let video   = $('#video'),
        playBtn = $('#play'),
        stopBtn = $('#stop'),
        rewindForward = $('#rewindForward'),
        rewindBack = $('#rewindBack'),
        volumeInc = $('#volumeInc'),
        volumeDecr = $('#volumeDecr'),
        volumeRange = $('#volumeRange'),
        progressBar = $('#progressBar'), 
        fullScreen = $('#fullScreen');
    
    //------------------- check the WebStorage ------------------------
    let playedVideo = localStorage.getItem('playedVideo');
    if(playedVideo != undefined) {
        video.src = playedVideo;
        volumeRange.innerHTML = Math.floor(video.volume*100) + "%";
        progressBar.style.width = 0 + "%";
    }
    else {
        volumeRange.innerHTML = video.volume*100 + "%";
        progressBar.style.width = 0 + "%";
    }

    //----------------- handler for fastForward button -----------------
    rewindForward.addEventListener('click', function(){
        video.currentTime += 5;
        if(video.currentTime == video.duration) {
            localStorage.playTime = 0;
        }
        else {
            localStorage.playTime = video.currentTime;
        }
    }, false);

    //---------------- handler for rewind button ----------------------
    rewindBack.addEventListener('click', function(){
        video.currentTime -= 5;
        localStorage.playTime = video.currentTime;
        playInProgress = false;
    }, false);

    //---------------- handler for increase volume button -------------
    volumeInc.addEventListener('click', function(){
        if(video.volume != 1) {
            video.volume += 0.1;
            volumeRange.innerHTML = Math.floor(video.volume*100) + "%";
        }
        else {
            video.volume = 1;
            volumeRange.innerHTML = video.volume*100 + "%";
        }
    }, false);
    
    //---------------- handler for decrease volume button -------------
    volumeDecr.addEventListener('click', function(){
        if(video.volume != 0) {
            video.volume -= 0.1;
            volumeRange.innerHTML = Math.floor(video.volume*100) + "%";
        }
        else {
            video.volume = 0;
            volumeRange.innerHTML = video.volume + "%";
        }
        
    }, false);

    //----------------- handler for play button -----------------------
    let playInProgress = false;
    playBtn.addEventListener('click', function() {
        if(!playInProgress) {
            let playTime = localStorage.getItem('playTime');
            if(playTime != 0) {
                video.currentTime = playTime;
                video.play();
                moveProgressBar();
                playInProgress = true;
                stopInProgress = false;
            }
            else {
                video.play();
                moveProgressBar();
                playInProgress = true;
                stopInProgress = false;
            }
        }
    }, false);

    //---------------- handler for stop button -------------------------
    let stopInProgress = false;
    stopBtn.addEventListener('click', function() {
        if(!stopInProgress) {
            video.pause();
            localStorage.playTime = video.currentTime;
            playInProgress = false;
            stopInProgress = true;
        }
    }, false);

    //-------------- handler for choice video button --------------------
    let addVideos = document.querySelectorAll('#btn-video');
    for(let i = 0; i < addVideos.length; i++) {
        addVideos[i].addEventListener('click', function(e){
            video.src = e.target.dataset.src;
            playInProgress = false;
            stopInProgress = false;
            progressBar.style.width = 0 + "%";
            localStorage.playedVideo = video.src;
            localStorage.playTime = 0;
        }, false);
    }
    
    //-------------- handlerfor fullscreen button ------------------------
    fullScreen.addEventListener('click', function (ev) {
        if (video.requestFullscreen) {
            video.requestFullscreen();
        } else if (video.mozRequestFullScreen) {
            video.mozRequestFullScreen();
        } else if (video.webkitRequestFullscreen) {
            video.webkitRequestFullscreen();
        }
        moveProgressBar();
        localStorage.playTime = video.currentTime;

    }, false)
    
    //-------------- function for progress bar----------------------------
    function moveProgressBar() {
        let posProgress;
        let widthProgress = setInterval(step, 1000);
        function step() {
            if (posProgress >= 100) 
            {
                clearInterval(widthProgress);
            } 
            else 
            {   
                posProgress = (100 * video.currentTime)/video.duration;
                progressBar.style.width = posProgress + '%';
            }
        }
    }
})();