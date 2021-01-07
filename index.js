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


    carBtn.addEventListener('click', () => {
        const active = carBtn.getAttribute('data-active');
        if (active === 'false') {
            carImg.style.display = 'block';
            carBtn.setAttribute('data-active', 'true')
            mobileBtn.setAttribute('data-active', 'false')
            monoBtn.setAttribute('data-active', 'false')
        } else if (active === 'true') {
            carBtn.setAttribute('data-active', 'false')
            carImg.style.display = 'none';
        }
    });
    
    
    mobileBtn.addEventListener('click', () => {
        const active = mobileBtn.getAttribute('data-active');
        if (active === 'false') {
            mobileImg.style.display = 'block';
            mobileBtn.setAttribute('data-active', 'true')
            carBtn.setAttribute('data-active', 'false')
            monoBtn.setAttribute('data-active', 'false')
        } else if (active === 'true') {
            mobileImg.style.display = 'none';
            mobileBtn.setAttribute('data-active', 'false')
        }
    });
    
    
    monoBtn.addEventListener('click', () => {
        const active = monoBtn.getAttribute('data-active');
        if (active === 'false') {
            speakerImg.style.display = 'block';
            monoBtn.setAttribute('data-active', 'true')
            mobileBtn.setAttribute('data-active', 'false')
            carBtn.setAttribute('data-active', 'false')
            console.log('mono')
        } else if (active === 'true') {
            speakerImg.style.display = 'none';
            monoBtn.setAttribute('data-active', 'false')
        }
    });

};


