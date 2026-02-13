function initSuggestions() {
    loadEcoLevel();
    loadHabits();
}

function loadEcoLevel() {
    const points = parseInt(localStorage.getItem('ecoPoints')) || 0;
    document.getElementById('points').textContent = points;

    const progressFill = document.getElementById('progress-fill');
    const progressPercent = Math.min((points / 100) * 100, 100);
    progressFill.style.width = progressPercent + '%';

    const badge = document.getElementById('eco-badge');
    if (points < 20) {
        badge.textContent = 'Eco Beginner';
    } else if (points < 50) {
        badge.textContent = 'Eco Enthusiast';
    } else if (points < 80) {
        badge.textContent = 'Eco Champion';
    } else {
        badge.textContent = 'Eco Master';
    }
}

function loadHabits() {
    const completed = JSON.parse(localStorage.getItem('completedHabits')) || {};

    Object.keys(completed).forEach(habit => {
        const circle = document.querySelector(`[data-habit="${habit}"]`);
        if (circle && completed[habit]) {
            circle.classList.add('completed');
        }
    });
}

function updatePoints(points, habit) {
    const currentPoints = parseInt(localStorage.getItem('ecoPoints')) || 0;
    const completed = JSON.parse(localStorage.getItem('completedHabits')) || {};

    if (!completed[habit]) {
        const newPoints = Math.min(currentPoints + points, 100);
        localStorage.setItem('ecoPoints', newPoints);
        completed[habit] = true;
        localStorage.setItem('completedHabits', JSON.stringify(completed));

        const circle = document.querySelector(`[data-habit="${habit}"]`);
        if (circle) {
            circle.classList.add('completed');
            animatePoint(circle);
        }

        loadEcoLevel();

        showNotification(`+${points} points earned!`);
    } else {
        showNotification('Habit already completed today!');
    }
}

function animatePoint(element) {
    element.style.animation = 'none';
    setTimeout(() => {
        element.style.animation = 'pulse 0.5s ease';
    }, 10);
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4caf50;
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        font-weight: 600;
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.15); }
        100% { transform: scale(1); }
    }

    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', initSuggestions);
