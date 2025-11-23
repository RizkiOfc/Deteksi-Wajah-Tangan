const video = document.getElementById('video');
const overlay = document.getElementById('overlay');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const switchCameraBtn = document.getElementById('switchCameraBtn');
const status = document.getElementById('status');
const loading = document.getElementById('loading');
const faceCount = document.getElementById('faceCount');
const faceStatus = document.getElementById('faceStatus');
const handCount = document.getElementById('handCount');
const handStatus = document.getElementById('handStatus');
const fingerCount = document.getElementById('fingerCount');
const gesture = document.getElementById('gesture');
const ctx = overlay.getContext('2d');

let stream = null;
let faceModel = null;
let handDetector = null;
let currentFacingMode = 'user';
let isDetecting = false;
let modelsLoaded = false;

async function startCamera(facingMode = 'user') {
    try {
        status.textContent = 'Mengakses kamera...';
        const constraints = { video: { facingMode, width: { ideal: 640 }, height: { ideal: 480 } } };
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = stream;
        await new Promise(resolve => video.onloadedmetadata = resolve);
        overlay.width = video.videoWidth;
        overlay.height = video.videoHeight;
        return true;
    } catch (err) {
        status.textContent = 'Gagal mengakses kamera.';
        return false;
    }
}

async function loadModels() {
    loading.style.display = 'block';
    status.textContent = 'Memuat model deteksi...';
    try {
        faceModel = await blazeface.load();
        const model = handPoseDetection.SupportedModels.MediaPipeHands;
        handDetector = await handPoseDetection.createDetector(model, {
            runtime: 'mediapipe',
            modelType: 'full',
            maxHands: 2,
            solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915/'
        });
        loading.style.display = 'none';
        modelsLoaded = true;
        return true;
    } catch (err) {
        loading.style.display = 'none';
        status.textContent = 'Error memuat model.';
        return false;
    }
}

async function detectFaces() {
    if (!faceModel) return [];
    try { return await faceModel.estimateFaces(video, false); }
    catch { return []; }
}

async function detectHands() {
    if (!handDetector) return [];
    try { return await handDetector.estimateHands(video); }
    catch { return []; }
}

function countFingers(l) {
    if (!l || l.length < 21) return 0;
    let c = 0;
    if (l[4].x > l[3].x) c++;
    if (l[8].y < l[6].y) c++;
    if (l[12].y < l[10].y) c++;
    if (l[16].y < l[14].y) c++;
    if (l[20].y < l[18].y) c++;
    return c;
}

function detectGesture(l, f) {
    if (f === 0) return 'Kepalan Tangan';
    if (f === 1) return l[4].x > l[3].x ? 'Thumbs Up' : 'Satu Jari';
    if (f === 2) return (l[8].y < l[6].y && l[12].y < l[10].y) ? 'Peace Sign' : 'Dua Jari';
    if (f === 3) return 'Tiga Jari';
    if (f === 4) return 'Empat Jari';
    if (f === 5) return 'Telapak Tangan';
    return '-';
}

function drawLine(p1, p2) {
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
}

function drawDetections(faces, hands) {
    ctx.clearRect(0, 0, overlay.width, overlay.height);
    let total = 0;
    let gest = '-';

    faces.forEach((f, i) => {
        const s = f.topLeft, e = f.bottomRight;
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 3;
        ctx.strokeRect(s[0], s[1], e[0] - s[0], e[1] - s[1]);
        ctx.fillStyle = '#00ff00';
        ctx.font = '14px Arial';
        ctx.fillText('Wajah ' + (i + 1), s[0], s[1] - 5);
    });

    hands.forEach((h, i) => {
        const k = h.keypoints;
        let minX = Infinity, minY = Infinity, maxX = 0, maxY = 0;

        k.forEach(p => { minX = Math.min(minX, p.x); minY = Math.min(minY, p.y); maxX = Math.max(maxX, p.x); maxY = Math.max(maxY, p.y); });

        ctx.strokeStyle = '#ff0000';
        ctx.strokeRect(minX, minY, maxX - minX, maxY - minY);

        ctx.fillStyle = '#ff0000';
        k.forEach(p => { ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, 2 * Math.PI); ctx.fill(); });

        ctx.strokeStyle = '#ff0000';
        drawLine(k[0], k[1]); drawLine(k[1], k[2]); drawLine(k[2], k[3]); drawLine(k[3], k[4]);
        drawLine(k[0], k[5]); drawLine(k[5], k[6]); drawLine(k[6], k[7]); drawLine(k[7], k[8]);
        drawLine(k[0], k[9]); drawLine(k[9], k[10]); drawLine(k[10], k[11]); drawLine(k[11], k[12]);
        drawLine(k[0], k[13]); drawLine(k[13], k[14]); drawLine(k[14], k[15]); drawLine(k[15], k[16]);
        drawLine(k[0], k[17]); drawLine(k[17], k[18]); drawLine(k[18], k[19]); drawLine(k[19], k[20]);

        const fng = countFingers(k);
        total += fng;
        if (i === 0) gest = detectGesture(k, fng);
    });

    return { total, gest };
}

async function detectionLoop() {
    if (!isDetecting) return;
    const faces = await detectFaces();
    const hands = await detectHands();

    const { total, gest } = drawDetections(faces, hands);

    faceCount.textContent = faces.length;
    faceStatus.textContent = faces.length > 0 ? 'Terdeteksi' : 'Tidak terdeteksi';
    handCount.textContent = hands.length;
    handStatus.textContent = hands.length > 0 ? 'Terdeteksi' : 'Tidak terdeteksi';
    fingerCount.textContent = total;
    gesture.textContent = gest;

    requestAnimationFrame(detectionLoop);
}

async function startDetection() {
    if (isDetecting) return;

    const cam = await startCamera(currentFacingMode);
    if (!cam) return;

    if (!modelsLoaded) {
        const load = await loadModels();
        if (!load) return;
    }

    isDetecting = true;
    startBtn.disabled = true;
    stopBtn.disabled = false;
    status.textContent = 'Deteksi aktif.';
    detectionLoop();
}

function stopDetection() {
    isDetecting = false;
    startBtn.disabled = false;
    stopBtn.disabled = true;
    status.textContent = 'Deteksi dihentikan.';

    if (stream) {
        stream.getTracks().forEach(t => t.stop());
        stream = null;
    }

    ctx.clearRect(0, 0, overlay.width, overlay.height);
    faceCount.textContent = '0';
    faceStatus.textContent = 'Tidak terdeteksi';
    handCount.textContent = '0';
    handStatus.textContent = 'Tidak terdeteksi';
    fingerCount.textContent = '0';
    gesture.textContent = '-';
}

async function switchCamera() {
    if (!isDetecting) return;
    stopDetection();
    currentFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';
    await startDetection();
}

startBtn.addEventListener('click', startDetection);
stopBtn.addEventListener('click', stopDetection);
switchCameraBtn.addEventListener('click', switchCamera);

status.textContent = 'Klik "Mulai Deteksi" untuk memulai.';
