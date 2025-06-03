// 전역변수
const trackTitle = document.querySelector('.trackTitle');
const playlist = [
    "FLAW, FLAW",
    "꾐",
    "주스 온더 락",
    "동행자",
    "NO ONE SEES ME LIKE YOU",
    "나는 생각이 너무 많아",
    "DIVE IN ISLAND",
    "COMBED",
    "WATS YOUR HOUSE FOR",
    "THE UNCERTAINS CLUB",
    "으악!",
    "지구 멸망 한 시간 전",
    "프리-퀄"
];
let song, fft;
let currentFile = null;

// --------------- 만든 배열 -> foreach문 활용해서 트랙 리스트 동적으로 생성 --------------
const trackList = document.getElementById("track-list");

playlist.forEach(name => {
    const li = document.createElement("li");
    li.className = "track";
    li.innerText = name;
    trackList.appendChild(li);
    li.dataset.file = `${name}.mp3`;
});



function setup() {
    fft = new p5.FFT();

    // --------------- 캔버스 그리고 화면에 오버레이 (오버레이 하는 코드는 CHATGPT 활용) --------------
    const cnv = createCanvas(windowWidth, windowHeight);
    cnv.position(0, 0).style('pointer-events', 'none').style('z-index', '10');
    clear();

    // --------------- track 클래스 붙어있는 리스트 반복, 클릭 이벤트리스너 달고, 
    // --------------- 각 리스트에 붙어있는 데이터셋 파일명 toggleOrSwitchTrack함수에 매개변수로 전달
    // --------------- changeTitle 함수에 문자열로 변경 -> mp3 확장자 제거해서 매개변수로 전달 
    document.querySelectorAll('.track').forEach(track =>
        track.addEventListener('click', () => {
            const file = track.dataset.file;
            toggleOrSwitchTrack(file);
            changeTitle(file.toString().replace('.mp3', ''));
        })
    );

    // --------------- 'track'클래스가 붙어있으면 음악 재생, 이미 재생중이라면 화면 빈 곳을 클릭하면 멈추기  --------------
    document.addEventListener('click', e => {
        if (!e.target.classList.contains('track')) {
            song?.isPlaying() && song.pause();
        }
    });
}

// --------------- file 매개변수로 받아서 조건에 따라 곡 변경 및 재생, 멈추기 (조건문 예외처리 및 리팩토링 CHATGPT 활용)  --------------
function toggleOrSwitchTrack(file) {
    if (file !== currentFile) {
        song?.isPlaying() && song.stop();
        song = loadSound(`../Playlist/${file}`, () => {
            song.play();
            currentFile = file;
        });
    } else {
        song?.isPlaying() ? song.pause() : song?.play();
    }
}

function changeTitle(name) {
    trackTitle.textContent = name;
}


// --------------- 비주얼라이저 그리기 (유튜브 영상 참고 : https://youtu.be/uk96O7N1Yo0?si=fUZGiYQT2WzlSdc7)  --------------
function draw() {
    clear();
    if (!song?.isPlaying()) return;

    stroke(255);
    strokeWeight(2);
    noFill();

    const visualizer = fft.waveform();
    beginShape();
    visualizer.forEach((v, i) => {
        const x = map(i, 0, visualizer.length, 0, width);
        const y = height / 2 + v * 50;
        vertex(x, y);
    });
    endShape();
}
