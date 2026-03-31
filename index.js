let track_name = document.querySelector(".track-name");
let playpause_btn = document.querySelector(".playpause-track");
let next_btn = document.querySelector(".next-track");
let prev_btn = document.querySelector(".prev-track");
let seek_slider = document.querySelector(".seek_slider");
let curr_time = document.querySelector(".current-time");
let total_duration = document.querySelector(".total-duration");
let file_input = document.getElementById("file-upload");


let track_index = 0;
let isPlaying = false;
let isLooping = false;
let isShuffle = false;
let updateTimer;
let curr_track = document.createElement('audio');
let track_list = []; 


function triggerUpload() {
    file_input.click();
}

function loadUploadedFiles(event) {
    let files = event.target.files;
    
    
    for (let i = 0; i < files.length; i++) {
        track_list.push({
            name: files[i].name,
            path: URL.createObjectURL(files[i]) 
        });
    }
    if (track_list.length > 0 && !isPlaying) {
        loadTrack(track_index);
    }
}
function loadTrack(index) {
    clearInterval(updateTimer);
    resetValues();

    if (track_list.length === 0) return;

    curr_track.src = track_list[index].path;
    curr_track.load();
    track_name.textContent = track_list[index].name;
    updateTimer = setInterval(seekUpdate, 1000);
    curr_track.addEventListener("ended", nexttrack);
}

function resetValues() {
    curr_time.textContent = "00:00";
    total_duration.textContent = "00:00";
    seek_slider.value = 0;
}

function playpause() {
    if (track_list.length === 0) {
        alert("Please upload a song first!");
        return;
    }
    
    if (!isPlaying) {
        curr_track.play();
        isPlaying = true;
    } else {
        curr_track.pause();
        isPlaying = false;
    }
}

function nexttrack() {
    if (track_list.length === 0) return;
    if (isShuffle) {
        let randomIndex = Math.floor(Math.random() * track_list.length);
        while (track_list.length > 1 && randomIndex === track_index) {
            randomIndex = Math.floor(Math.random() * track_list.length);
        }
        track_index = randomIndex;
    }else{
    if (track_index < track_list.length - 1) {
        track_index += 1;
    } else {
        return;
    }}
    loadTrack(track_index);
    curr_track.play();
    isPlaying = true;
}

function prevtrack() {
    if (track_list.length === 0) return;

    if (track_index > 0) {
        track_index -= 1;
    } else {
        return;
    }
    
    loadTrack(track_index);
    curr_track.play();
    isPlaying = true;
}
function seekTo() {
    if (track_list.length === 0) return;
    let seekto = curr_track.duration * (seek_slider.value / 100);
    curr_track.currentTime = seekto;
}

function seekUpdate() {
    let seekPosition = 0;

   
    if (!isNaN(curr_track.duration)) {
        seekPosition = curr_track.currentTime * (100 / curr_track.duration);
        seek_slider.value = seekPosition;

        let currentMinutes = Math.floor(curr_track.currentTime / 60);
        let currentSeconds = Math.floor(curr_track.currentTime - currentMinutes * 60);
        let durationMinutes = Math.floor(curr_track.duration / 60);
        let durationSeconds = Math.floor(curr_track.duration - durationMinutes * 60);


        if (currentSeconds < 10) { currentSeconds = "0" + currentSeconds; }
        if (durationSeconds < 10) { durationSeconds = "0" + durationSeconds; }
        if (currentMinutes < 10) { currentMinutes = "0" + currentMinutes; }
        if (durationMinutes < 10) { durationMinutes = "0" + durationMinutes; }

        curr_time.textContent = currentMinutes + ":" + currentSeconds;
        total_duration.textContent = durationMinutes + ":" + durationSeconds;
    }
}
function toggleLoop() {
    isLooping = !isLooping;
    curr_track.loop = isLooping;
    
    if (isLooping) {
        alert("Looping current track");
    } else {
        alert("Looping disabled");
    }
}
function toggleShuffle() {
    isShuffle = !isShuffle;
}