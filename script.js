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

function getNextDeparture(route, now) {
        const sortedTimes = [...route.departureTimes].sort();

        for (const timeStr of sortedTimes) {
            const [hours, minutes] = timeStr.split(':').map(Number);
        // 今日の日付を仮定して対象時刻を作成
        let targetTime = new Date(now);
        targetTime.setHours(hours, minutes, 0, 0);

        // 現在時刻より後の時刻なら、それを採用
            if (targetTime > now) {
            return { timeStr, targetTime };
        }
        }

    // 全ての時刻が過ぎている場合、翌日の最初の時刻を返す
    const firstTime = sortedTimes[0];
    const [hours, minutes] = firstTime.split(':').map(Number);
    let nextDayTime = new Date(now);
    nextDayTime.setDate(nextDayTime.getDate() + 1); // 翌日に設定
    nextDayTime.setHours(hours, minutes, 0, 0);

    return { timeStr: firstTime, targetTime: nextDayTime, isNextDay: true };
}

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
        const result = getNextDeparture(route, now);
        const timerElement = document.getElementById(route.timerId);
        if (!timerElement) return;

        const { timeStr, targetTime, isNextDay } = result;

        // 差分を計算
            const diff = targetTime - now;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        // 日表示のフォーマット
        let displayText;
        if (days > 0) {
            displayText = `翌日 ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
            } else {
            displayText = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
            }

        timerElement.textContent = displayText;

        // 出発時刻も更新
        const departureTimeElement = document.getElementById(route.id.replace('route', 'departure-time'));
        if (departureTimeElement) {
            departureTimeElement.textContent = timeStr + (isNextDay ? ' (翌日)' : '');
        }

        // 翌日の場合は青、当日の場合は赤
        timerElement.style.color = isNextDay ? '#007bff' : '#d9534f';
    });
}

// 1秒ごとに更新
setInterval(updateCountdowns, 1000);
updateCountdowns();


