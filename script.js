// バスデータの定義
// 各ルートに departureTimes (配列) を持たせます
const busRoutes = [
    {
        id: 'route-1',
        timerId: 'timer-1',
        destination: '高岡神社前',
        // 複数の時刻を登録できます
        departureTimes: ['18:15', '19:20', '20:20', '21:15', '22:15']
    },
    {
        id: 'route-2',
        timerId: 'timer-2',
        destination: '姫高北口',
        departureTimes: ['18:10', '18:25', '18:40', '18:55', '19:15', '19:30', '19:45', '20:00', '20:15', '20:30', '20:45', '21:00', '21:30', '22:00', '22:30', '23:15']
    }
];

function updateCountdowns() {
    const now = new Date();

    // 現在時刻の表示を更新
    const timeElement = document.getElementById('current-time');
    if (timeElement) {
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        timeElement.textContent = `${hours}:${minutes}:${seconds}`;
    }

    busRoutes.forEach(route => {
        // 1. 現在時刻より後の、最も近い時刻を探す
        let nextDepartureStr = null;

        // 時刻の配列を昇順にソート（念のため）
        const sortedTimes = [...route.departureTimes].sort();

        for (const timeStr of sortedTimes) {
            const [hours, minutes] = timeStr.split(':').map(Number);
        const targetTime = new Date();
        targetTime.setHours(hours, minutes, 0, 0);

            // 現在時刻より後の時刻を見つけたら、それを採用
            if (targetTime > now) {
                nextDepartureStr = timeStr;
                break;
        }
        }

        const timerElement = document.getElementById(route.timerId);
        if (!timerElement) return;

        if (nextDepartureStr) {
            // 次の時刻が見つかった場合、カウントダウンを実行
            const [hours, minutes] = nextDepartureStr.split(':').map(Number);
            const targetTime = new Date();
            targetTime.setHours(hours, minutes, 0, 0);

            const diff = targetTime - now;
                const h = Math.floor(diff / (1000 * 60 * 60));
                const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((diff % (1000 * 60) / 1000));

                timerElement.textContent = 
                `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
            timerElement.style.color = '#d9534f';
            } else {
            // 全ての時刻が過ぎてしまった場合
            timerElement.textContent = "本日の運行終了";
            timerElement.style.color = '#6c757d';
            }
    });
}

// 1秒ごとに更新
setInterval(updateCountdowns, 1000);
updateCountdowns();
