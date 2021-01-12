const carBtn = document.querySelector('.carBtn');
const mobileBtn = document.querySelector('.mobileBtn');
const monoBtn = document.querySelector('.monoBtn');
const carImg = document.querySelector('#carImg');
const mobileImg = document.querySelector('.mobileImg');
const speakerImg = document.querySelector('.speakerImg');
const canvas = document.getElementById("canvas");

audio_file.onchange = function () {
    const AudioContext = window.AudioContext || window.webkitAudioContext;

    const audioElement = audio_player;
    const ctx = new AudioContext();

    //connect with reverb.js library
    reverbjs.extend(ctx);

    const mediaElement = ctx.createMediaElementSource(audioElement);
    let files = this.files;
    let file = URL.createObjectURL(files[0]);
    audio_player.src = file;

    mediaElement.connect(ctx.destination);

    ctx.resume();
    if (ctx.state === 'suspended') {
        ctx.resume();
    }

    ////////CAR STEREO SETUP////////

    //Setup and connect impulse response
    const reverbUrl = "./IR/henkesIr.wav";
    const reverbNode = ctx.createReverbFromUrl(reverbUrl, function () {
        reverbNode.connect(ctx.destination);
    });

    //Create filters for car stereo
    //LOWSHELF
    const lowShelf = ctx.createBiquadFilter();
    lowShelf.type = 'lowshelf';
    lowShelf.frequency.value = 320;
    lowShelf.gain.value = 10;
    //MID
    const mid = ctx.createBiquadFilter();
    mid.type = "peaking";
    mid.frequency.value = 1000;
    mid.Q.value = 0.5;
    mid.gain.value = 5.0;
    //HIGHSHELF
    const highShelf = ctx.createBiquadFilter();
    highShelf.type = "highshelf";
    highShelf.frequency.value = 3200;
    highShelf.gain.value = 5.0;
    //LOWPASS
    const lowPass = ctx.createBiquadFilter();
    lowPass.type = "lowpass";
    lowPass.frequency.value = 3500;
    //HIGHPASS
    const highPass = ctx.createBiquadFilter();
    highPass.type = "highpass";
    highPass.frequency.value = 2030;

    //Car stereo button
    carBtn.addEventListener('click', () => {
        const active = carBtn.getAttribute('data-active');
        if (active === 'false') {
            carImg.style.display = 'block';
            if (carImg.style.display == 'block') {
                carImg.classList.add('carAnimation')
            }
            carBtn.setAttribute('data-active', 'true')
            mobileBtn.setAttribute('data-active', 'false')
            monoBtn.setAttribute('data-active', 'false')
            carBtn.style.backgroundColor = '#ff0000';
            try {
                mediaElement.disconnect(ctx.destination);
            } catch (error) { };
            console.log('EQ1 ADDED');
            mediaElement.connect(reverbNode);
            mediaElement.connect(highPass).connect(lowPass).connect(lowShelf).connect(mid).connect(highShelf).connect(ctx.destination);
            mobileBtn.style.backgroundColor = '#d30202';
            mobileImg.style.display = 'none';
            try {
                mediaElement.disconnect(highPass2).disconnect(lowPass2).disconnect(lowShelf2).disconnect(mid2).disconnect(highShelf2).disconnect(ctx.destination);
            } catch (error) { };
            speakerImg.style.display = 'none';
            monoBtn.style.backgroundColor = '#d30202';
        } else if (active === 'true') {
            carBtn.setAttribute('data-active', 'false')
            carImg.style.display = 'none';
            carBtn.style.backgroundColor = '#d30202';
            mediaElement.connect(ctx.destination);
            try {
                mediaElement.disconnect(reverbNode);
                mediaElement.disconnect(highPass).disconnect(lowPass).disconnect(lowShelf).disconnect(mid).disconnect(highShelf).disconnect(ctx.destination);
            } catch (error) { };
            console.log('EQ1 REMOVED');
        }
    });

    ////////MOBILE SETUP////////

    mobileBtn.addEventListener('click', () => {
        const active = mobileBtn.getAttribute('data-active');
        if (active === 'false') {
            mobileImg.style.display = 'block';
            if (mobileImg.style.display == 'block') {
                mobileImg.classList.add('mobileAnimation')
            }
            mobileBtn.setAttribute('data-active', 'true')
            carBtn.setAttribute('data-active', 'false')
            monoBtn.setAttribute('data-active', 'false')
            carImg.style.display = 'none';
            speakerImg.style.display = 'none';
        } else if (active === 'true') {
            mobileImg.style.display = 'none';
            mobileBtn.setAttribute('data-active', 'false')
        }
    });


    ////////MONO AURATONE SETUP////////

    monoBtn.addEventListener('click', () => {
        const active = monoBtn.getAttribute('data-active');
        if (active === 'false') {
            speakerImg.style.display = 'block';
            if (speakerImg.style.display == 'block') {
                speakerImg.classList.add('speakerAnimation')
            }
            monoBtn.setAttribute('data-active', 'true')
            mobileBtn.setAttribute('data-active', 'false')
            carBtn.setAttribute('data-active', 'false')
            carImg.style.display = 'none';
            mobileImg.style.display = 'none';
        } else if (active === 'true') {
            speakerImg.style.display = 'none';
            monoBtn.setAttribute('data-active', 'false')
        }
    });

};


