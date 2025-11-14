const soalElement = document.getElementById('soal');

const pilihanElement = document.getElementById('pilihan');

const nextBtn = document.getElementById('next-btn');

const hasilElement = document.getElementById('hasil');

const timerElement = document.getElementById('time');

let soalIndex = 0;

let skor = 0;

let kuisData = [];

let timeLeft = 15;

let timerInterval;

// Ambil data kuis dari file JSON

async function getKuis() {

    try {

        const response = await fetch('kuis.json');

        if (!response.ok) {

            throw new Error(`HTTP error! status: \){response.status}`);

        }

        kuisData = await response.json();

        mulaiKuis();

    } catch (error) {

        console.error('Gagal mengambil data kuis:', error);

        soalElement.textContent = 'Gagal memuat kuis. Silakan coba lagi nanti.';

        nextBtn.style.display = 'none';

    }

}

// Mulai kuis

function mulaiKuis() {

    soalIndex = 0;

    skor = 0;

    nextBtn.textContent = 'Soal Berikutnya';

    hasilElement.textContent = ''; // Reset hasil

    tampilkanSoal();

}

// Tampilkan soal

function tampilkanSoal() {

    resetState();

    const soalSekarang = kuisData[soalIndex];

    soalElement.textContent = `\({soalIndex + 1}. \){soalSekarang.soal}`;

    soalSekarang.pilihan.forEach(pilihan => {

        const button = document.createElement('button');

        button.textContent = pilihan;

        button.classList.add('pilihan');

        pilihanElement.appendChild(button);

        button.addEventListener('click', pilihJawaban);

    });

    mulaiTimer();

    nextBtn.style.display = 'none'; // Sembunyikan tombol next

}

// Reset tampilan

function resetState() {

    while (pilihanElement.firstChild) {

        pilihanElement.removeChild(pilihanElement.firstChild);

    }

}

// Pilih jawaban

function pilihJawaban(e) {

    clearInterval(timerInterval);

    const pilihanDipilih = e.target;

    const jawabanBenar = kuisData[soalIndex].jawaban;

    const isCorrect = pilihanDipilih.textContent === jawabanBenar;

    if (isCorrect) {

        skor++;

    }

    Array.from(pilihanElement.children).forEach(button => {

        button.disabled = true;

        if (button.textContent === jawabanBenar) {

            button.classList.add('benar');

        } else if (button === pilihanDipilih) {

            button.classList.add('salah');

        }

    });

    nextBtn.style.display = 'block';

}

// Tampilkan hasil

function tampilkanHasil() {

    resetState();

    soalElement.textContent = `Kamu menjawab \({skor} dari \){kuisData.length} soal dengan benar!`;

    nextBtn.textContent = 'Main Lagi';

    nextBtn.style.display = 'block';

    clearInterval(timerInterval);

    timerElement.parentElement.style.display = 'none';

}

// Timer

function mulaiTimer() {

    timeLeft = 15;

    timerElement.textContent = timeLeft;

    timerElement.parentElement.style.display = 'block'; // Pastikan timer terlihat

    timerInterval = setInterval(() => {

        timeLeft--;

        timerElement.textContent = timeLeft;

        if (timeLeft <= 0) {

            clearInterval(timerInterval);

            pilihJawaban({ target: { textContent: '' } }); // Anggap tidak menjawab

        }

    }, 1000);

}

// Event listener untuk tombol next

nextBtn.addEventListener('click', () => {

    if (soalIndex < kuisData.length - 1) {

        soalIndex++;

        tampilkanSoal();

    } else {

        tampilkanHasil();

    }

});

// Inisialisasi

getKuis();