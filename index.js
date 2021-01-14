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
    const reverbUrl = "./IR/IRCar.wav";
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

    const splitter = ctx.createChannelSplitter(2);
    mediaElement.connect(splitter);

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
    let analyser = ctx.createAnalyser();
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

    const barWidth = (WIDTH / bufferLength) * 50;
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

        analCtx.fillStyle = "white"; // Clears canvas before rendering bars 
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



            analCtx.fillStyle = `rgb(${r},${g},${b})`;
            analCtx.fillRect(x, (HEIGHT - barHeight), barWidth, barHeight);


            x += barWidth + 2 // Gives px space between each bar
        }
    }


    renderFrame();
};


