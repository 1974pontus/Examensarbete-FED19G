const carBtn = document.querySelector('.carBtn');
const mobileBtn = document.querySelector('.mobileBtn');
const monoBtn = document.querySelector('.monoBtn');
const carImg = document.querySelector('#carImg');
const mobileImg = document.querySelector('.mobileImg');
const speakerImg = document.querySelector('.speakerImg');
const canvas = document.getElementById("canvas");

const myAudio = document.getElementById('audio_player');

const play = document.getElementById('play');
const pause = document.getElementById('pause');

//Create the Audio context
const AudioContext = window.AudioContext || window.webkitAudioContext;

const audioElement = audio_player;
const ctx = new AudioContext();

const mediaElement = ctx.createMediaElementSource(audioElement);

//load the audioElement with the audio file of choice
audio_file.onchange = function () {
    let files = this.files;
    let file = URL.createObjectURL(files[0]);
    audio_player.src = file;
    function playAudio() {
        myAudio.play();
        myAudio.volume = 0.2;
        console.log('play')
        play.style.backgroundColor = '#ff0000';
        pause.style.backgroundColor = '#a30000';
    }

    function pauseAudio() {
        myAudio.pause();
        console.log('pause')
        pause.style.backgroundColor = '#ff0000';
        play.style.backgroundColor = '#a30000';
    }
    play.onclick = playAudio;
    pause.onclick = pauseAudio;
};

mediaElement.connect(ctx.destination);

//connect with reverb.js library
reverbjs.extend(ctx);

// associate functions with the 'onclick' events


ctx.resume();
if (ctx.state === 'suspended') {
    ctx.resume();
}

////////CAR STEREO SETUP////////

//Setup and connect impulse response
const reverbUrlCar = "./IR/carV2.wav";
const reverbNodeCar = ctx.createReverbFromUrl(reverbUrlCar, function () {
    reverbNodeCar.connect(ctx.destination);
});


//Create filters for car stereo
//LOWSHELF
const lowShelf = ctx.createBiquadFilter();
lowShelf.type = 'lowshelf';
lowShelf.frequency.value = 100;
lowShelf.gain.value = 0;
//MID
const mid = ctx.createBiquadFilter();
mid.type = "peaking";
mid.frequency.value = 1000;
mid.Q.value = 0.5;
mid.gain.value = 0;
//HIGHSHELF
const highShelf = ctx.createBiquadFilter();
highShelf.type = "highshelf";
highShelf.frequency.value = 6000;
highShelf.Q.value = 1;
highShelf.gain.value = 1;
//LOWPASS
const lowPass = ctx.createBiquadFilter();
lowPass.type = "lowpass";
lowPass.frequency.value = 7470;
lowPass.Q.value = 6;
//HIGHPASS
const highPass = ctx.createBiquadFilter();
highPass.type = "highpass";
highPass.frequency.value = 65;
highPass.Q.value = 2;


//Car stereo button
carBtn.addEventListener('click', () => {
    const active = carBtn.getAttribute('data-active');
    if (active === 'false') {
        carBtn.setAttribute('data-active', 'true')
        mobileBtn.setAttribute('data-active', 'false')
        monoBtn.setAttribute('data-active', 'false')
        carBtn.style.backgroundColor = '#ff0000';
        try {
            mediaElement.disconnect(ctx.destination);
        } catch (error) { };
        console.log('EQ1 ADDED');
        mediaElement.connect(reverbNodeCar);
        mediaElement.connect(highPass).connect(lowPass).connect(lowShelf).connect(mid).connect(highShelf).connect(ctx.destination);
        mobileBtn.style.backgroundColor = '#a30000';
        try {
            mediaElement.disconnect(reverbNodeMobile)
            mediaElement.disconnect(highPass2).disconnect(lowPass2).disconnect(lowShelf2).disconnect(mid2).disconnect(highShelf2).disconnect(reverbNodeMobile).disconnect(eq2Level).disconnect(ctx.destination);
        } catch (error) { };
        monoBtn.style.backgroundColor = '#a30000';
        try {
            mono.disconnect(ctx.destination);
        } catch (error) { };
    } else if (active === 'true') {
        carBtn.setAttribute('data-active', 'false')
        carBtn.style.backgroundColor = '#a30000';
        mediaElement.connect(ctx.destination);
        try {
            mediaElement.disconnect(reverbNodeCar);
            mediaElement.disconnect(highPass).disconnect(lowPass).disconnect(lowShelf).disconnect(mid).disconnect(highShelf).disconnect(ctx.destination);
        } catch (error) { };
        console.log('EQ1 REMOVED');
    }
});

////////MOBILE SETUP////////

const reverbUrlMobile = "./IR/phoneV2.wav";
const reverbNodeMobile = ctx.createReverbFromUrl(reverbUrlMobile, function () {
    reverbNodeMobile.connect(ctx.destination);
});

//Create filters for mobile phone speakers

//LOWSHELF
const lowShelf2 = ctx.createBiquadFilter();
lowShelf2.type = 'lowshelf';
lowShelf2.frequency.value = 420;
lowShelf2.gain.value = 20;
//MID
const mid2 = ctx.createBiquadFilter();
mid2.type = "peaking";
mid2.frequency.value = 1200;
mid2.Q.value = 3.6;
mid2.gain.value = -1.5;
//HIGHSHELF
const highShelf2 = ctx.createBiquadFilter();
highShelf2.type = "highshelf";
highShelf2.frequency.value = 2200;
highShelf2.gain.value = 3.0;
//LOWPASS
const lowPass2 = ctx.createBiquadFilter();
lowPass2.type = "lowpass";
lowPass2.frequency.value = 4250;
lowPass2.Q.value = 2.2

//HIGHPASS
const highPass2 = ctx.createBiquadFilter();
highPass2.type = "highpass";
highPass2.frequency.value = 910;
highPass2.Q.value = 2.2

//GAIN COMPENSATION
const eq2Level = ctx.createGain();
eq2Level.gain.value = 1;

mobileBtn.addEventListener('click', () => {
    const active = mobileBtn.getAttribute('data-active');
    if (active === 'false') {
        mobileBtn.setAttribute('data-active', 'true')
        carBtn.setAttribute('data-active', 'false')
        monoBtn.setAttribute('data-active', 'false')
        mobileBtn.style.backgroundColor = '#ff0000';
        try {
            mediaElement.disconnect(ctx.destination);
        } catch (error) { };
        mediaElement.connect(highPass2).connect(mid2).connect(lowPass2).connect(reverbNodeMobile).connect(eq2Level).connect(ctx.destination);
        carBtn.style.backgroundColor = '#a30000';
        try {
            mediaElement.disconnect(reverbNodeCar);
            mediaElement.disconnect(highPass).disconnect(lowPass).disconnect(lowShelf).disconnect(mid).disconnect(highShelf).disconnect(ctx.destination);
        } catch (error) { };
        monoBtn.style.backgroundColor = '#a30000';
        console.log('EQ1 REMOVED');
        console.log('EQ2 ADDED');
        try {
            mono.disconnect(ctx.destination);
        } catch (error) { };
    } else if (active === 'true') {
        mobileBtn.setAttribute('data-active', 'false')
        mobileBtn.style.backgroundColor = '#a30000';
        console.log('EQ2 Removed');
        mediaElement.connect(ctx.destination);
        try {
            mediaElement.disconnect(highPass2).connect(mid2).disconnect(lowPass2).disconnect(reverbNodeMobile).disconnect(eq2Level).disconnect(ctx.destination);
        } catch (error) { };
    }
});


////////MONO AURATONE SETUP////////

//Create filters for Mono Auratone

const splitter = ctx.createChannelSplitter(2);
mediaElement.connect(splitter);

const gainL = ctx.createGain();
const gainR = ctx.createGain();

const merger = ctx.createChannelMerger(2);
const mono = ctx.createGain();
mono.gain.value = 0.4;

splitter.connect(mono, 0); // left channel mix into mono-gain
splitter.connect(mono, 1); // right channel mix into mono-gain
gainL.connect(merger, 0, 0);
gainR.connect(merger, 0, 1);

monoBtn.addEventListener('click', () => {
    const active = monoBtn.getAttribute('data-active');
    if (active === 'false') {
        monoBtn.setAttribute('data-active', 'true');
        mobileBtn.setAttribute('data-active', 'false');
        carBtn.setAttribute('data-active', 'false');
        monoBtn.style.backgroundColor = '#ff0000';
        try {
            mediaElement.disconnect(ctx.destination);
        } catch (error) { };
        mono.connect(ctx.destination);
        carBtn.style.backgroundColor = '#a30000';
        try {
            mediaElement.disconnect(reverbNodeCar);
            mediaElement.disconnect(highPass).disconnect(lowPass).disconnect(lowShelf).disconnect(mid).disconnect(highShelf).connect(ctx.destination);
        } catch (error) { };
        mobileBtn.style.backgroundColor = '#a30000';
        try {
            mediaElement.disconnect(highPass2).disconnect(lowPass2).disconnect(lowShelf2).disconnect(mid2).disconnect(highShelf2).disconnect(reverbNodeMobile).disconnect(eq2Level).disconnect(ctx.destination);
        } catch (error) { };
    } else if (active === 'true') {
        monoBtn.setAttribute('data-active', 'false');
        monoBtn.style.backgroundColor = '#a30000';
        mediaElement.connect(ctx.destination);
        try {
            mono.disconnect(ctx.destination);
        } catch (error) { };
    }
});



////////VU METER////////

/*Check volume*/
const checkVolume = function (analyser, meter) {

    let frequencyData = new Uint8Array(1);
    analyser.getByteFrequencyData(frequencyData);
    let volume = frequencyData[0];
    let rotation = (parseInt(volume * .54)) + 20;
    let needles = document.getElementById(meter).getElementsByClassName('needle');
    let needle = needles[0];
    needle.style.transform = "rotate(" + rotation + "deg)";

}

/* Create two analyzers */
let analyserLeft = ctx.createAnalyser();
let analyserRight = ctx.createAnalyser();


/* Connect analyzers */
splitter.connect(analyserLeft, 1);
splitter.connect(analyserRight, 0)


setInterval(function () {
    checkVolume(analyserLeft, "meterLeft");
    checkVolume(analyserRight, "meterRight")
}, 50);



////////VISUAL ANALYSER////////

//Setup Canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const analCtx = canvas.getContext("2d");

//Create Analyser
const analyser = ctx.createAnalyser();
mediaElement.connect(analyser);

//Analyser fftSize
analyser.fftSize = 8192;
/* (FFT) is an algorithm that samples a signal over a period of time
and divides it into its frequency components (single sinusoidal oscillations).
It separates the mixed signals and shows what frequency is a violent vibration.
(FFTSize) represents the window size in samples that is used when performing a FFT
Lower the size, the less bars (but wider in size)*/

const bufferLength = analyser.frequencyBinCount; // (read-only property)
// Unsigned integer, half of fftSize (so in this case, bufferLength = 8192)
// Equates to number of data values you have to play with for the visualization

// The FFT size defines the number of bins used for dividing the window into equal strips, or bins.
// Hence, a bin is a spectrum sample, and defines the frequency resolution of the window.

const dataArray = new Uint8Array(bufferLength); // Converts to 8-bit unsigned integer array
// At this point dataArray is an array with length of bufferLength but no values
console.log('DATA-ARRAY: ', dataArray) // Check out this array of frequency values!

const WIDTH = canvas.width;
const HEIGHT = canvas.height;
console.log('WIDTH: ', WIDTH, 'HEIGHT: ', HEIGHT)

const barWidth = (WIDTH / bufferLength) * 60;
console.log('BARWIDTH: ', barWidth)

console.log('TOTAL WIDTH: ', (117 * 10) + (118 * barWidth)) // (total space between bars)+(total width of all bars)

let barHeight;
let x = 0;

function renderFrame() {
    requestAnimationFrame(renderFrame); // Takes callback function to invoke before rendering

    x = 0;

    analyser.getByteFrequencyData(dataArray); // Copies the frequency data into dataArray
    // Results in a normalized array of values between 0 and 255
    // Before this step, dataArray's values are all zeros (but with length of 8192)

    analCtx.fillStyle = "#1b2529"; // Clears canvas before rendering bars 
    analCtx.fillRect(1, 1, WIDTH, HEIGHT); // Fade effect, set opacity to 1 for sharper rendering of bars

    let r, g, b;
    let bars = 118 // Set total number of bars you want per frame

    for (let i = 0; i < bars; i++) {
        barHeight = (dataArray[i] * 2.5);

        if (dataArray[i] > 210) {
            r = 250
            g = 163
            b = 7
        } else if (dataArray[i] > 180) {
            r = 220
            g = 47
            b = 2
        } else if (dataArray[i] > 170) {
            r = 232
            g = 93
            b = 4
        } else if (dataArray[i] > 160) {
            r = 244
            g = 140
            b = 6
        } else {
            r = 250
            g = 163
            b = 7
        }



        analCtx.fillStyle = "#08FF08";
        analCtx.fillRect(x, (HEIGHT - barHeight), barWidth, barHeight);


        x += barWidth + 10 // Gives px space between each bar
    }
}


renderFrame();



