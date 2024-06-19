myCanvas.width = this.screen.width/3;
myCanvas.height = this.screen.height/3;
const margin = 6
const size = 21;
const arr = [];
let moves = [];
let speed = 50;

const cols = [];
const spacing = (myCanvas.width-margin*2) / size;
const ctx = myCanvas.getContext("2d");
const maxColHeight = 200;

init();
// play();

let audioCtx = null;
function playNote(freq, type){
    if(audioCtx==null){
        audioCtx = new (
            AudioContext ||
            webkitAudioContext ||
            window.webkitAudioContext
        )();
    }
    const dur = 0.2;
    const osc = audioCtx.createOscillator();
    osc.frequency.value = freq;
    osc.start();
    osc.type = type;
    osc.stop(audioCtx.currentTime+dur);

    const node = audioCtx.createGain();
    node.gain.value=0.4;
    node.gain.linearRampToValueAtTime(0, audioCtx.currentTime+dur);

    osc.connect(node);
    node.connect(audioCtx.destination);
}

function init(){
    for(let i=0;i<size;i++){
        arr[i] = Math.random();
    }
    moves = [];
    for(let i=0;i<size;i++){
        const x = i*spacing + spacing/2+margin;
        const y = myCanvas.height-margin-i*3;
        const width = spacing-margin;
        // const height = (myCanvas.height-margin*2)*arr[i];
        const height = maxColHeight*arr[i];
        cols[i] = new Column(x, y, width, height);
    }
}

function speedControl(){
    speed = 10 + Math.floor(Math.random() * 100);
}



function play(){
    moves = bubbleSort(arr);
}
animate();


// function insertionSort(arr){
//     const moves = [];
//     for (let i = 1; i < n; i++) {
//         let key = arr[i];
//         let j = i - 1;
//         while (j >= 0 && arr[j] > key) {
//             arr[j + 1] = arr[j];
//             j = j - 1;
//         }
//         arr[j + 1] = key;
//     }
// }

function bubbleSort(arr){
    const moves=[];    
    do{
        var swapped = false;
        for(let i=1;i<arr.length;i++){
            if(arr[i-1]>arr[i]){
                swapped = true;
                [arr[i-1], arr[i]]=[arr[i], arr[i-1]]
                moves.push({indices:[i-1,i], swap:true});
                }
            else{
                moves.push({indices:[i-1,i], swap:false});
            }
        }
    }while(swapped); 
    return moves;
}

function animate(){
    ctx.clearRect(0,0,myCanvas.width, myCanvas.height);
    let changed = false;
    for(let i=0;i<cols.length;i++){
        changed = cols[i].draw(ctx) || changed;
    }

    if(!changed && moves.length>0){
        const move=moves.shift();
        const [i,j]=move.indices;
        const waveFormType = move.swap?"square":"sin";
        playNote(cols[i].height+cols[j].height, waveFormType);
        if(move.swap){
            cols[i].moveTo(cols[j], 1, speed);
            cols[j].moveTo(cols[i], -1, speed);
            [cols[i],cols[j]] = [cols[j],cols[i]];
        }
        else{
            cols[i].jump();
            cols[j].jump();
        }
    }

    requestAnimationFrame(animate);
}