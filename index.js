const carBtn = document.querySelector('.carBtn');
const mobileBtn = document.querySelector('.mobileBtn');
const monoBtn = document.querySelector('.monoBtn');
const carImg = document.querySelector('.carImg');
const mobileImg = document.querySelector('.mobileImg');
const speakerImg = document.querySelector('.speakerImg');

audio_file.onchange = function () {
    const AudioContext = window.AudioContext || window.webkitAudioContext;

    const audioElement = audio_player;
    const ctx = new AudioContext();
    const mediaElement = ctx.createMediaElementSource(audioElement);
    let files = this.files;
    let file = URL.createObjectURL(files[0]);
    audio_player.src = file;

    mediaElement.connect(ctx.destination);

    ctx.resume();
    if (ctx.state === 'suspended') {
        ctx.resume();
    }



};


carBtn.addEventListener('click', () => {
    const active = carBtn.getAttribute('data-active');
    if (active === 'false') {
        carBtn.setAttribute('data-active', 'true')
        mobileBtn.setAttribute('data-active', 'false')
        monoBtn.setAttribute('data-active', 'false')
        body.style.backgroundColor = '#ff0000';
    } else if (active === 'true') {
        carBtn.setAttribute('data-active', 'false')
        body.style.backgroundColor = 'white';
    }
});


mobileBtn.addEventListener('click', () => {
    const active = mobileBtn.getAttribute('data-active');
    if (active === 'false') {
        mobileBtn.setAttribute('data-active', 'true')
        carBtn.setAttribute('data-active', 'false')
        monoBtn.setAttribute('data-active', 'false')
        body.style.backgroundColor = 'pink';
    } else if (active === 'true') {
        mobileBtn.setAttribute('data-active', 'false')
        body.style.backgroundColor = 'white';
    }
});


monoBtn.addEventListener('click', () => {
    const active = monoBtn.getAttribute('data-active');
    if (active === 'false') {
        monoBtn.setAttribute('data-active', 'true')
        mobileBtn.setAttribute('data-active', 'false')
        carBtn.setAttribute('data-active', 'false')
        console.log('mono')
        body.style.backgroundColor = 'orange';
    } else if (active === 'true') {
        monoBtn.setAttribute('data-active', 'false')
        body.style.backgroundColor = 'white';
    }
});
