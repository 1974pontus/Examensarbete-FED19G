const car = document.querySelector('.carBtn');
const mobile = document.querySelector('.mobileBtn');
const mono = document.querySelector('.monoBtn');

audio_file.onchange = function () {
    const AudioContext = window.AudioContext || window.webkitAudioContext;

    const audioElement = audio_player;
    const ctx = new AudioContext();
    const mediaElement = ctx.createMediaElementSource(audioElement);
    let files = this.files;
    let file = URL.createObjectURL(files[0]);
    audio_player.src = file;
    ctx.resume();
    if (ctx.state === 'suspended') {
        ctx.resume();
    }


    mediaElement.connect(ctx.destination);


};