let breakdownChart = null;
let trendChart = null;

function initDashboard() {
    loadDashboardData();
    initCharts();
}

function loadDashboardData() {
    const lastFootprint = JSON.parse(localStorage.getItem('lastFootprint')) || {};
    const history = JSON.parse(localStorage.getItem('carbonHistory')) || {};

    const todayFootprint = lastFootprint.total || 0;
    document.getElementById('today-footprint').textContent = parseFloat(todayFootprint).toFixed(2);

    updateStatusBadge(parseFloat(todayFootprint));

    // Calculate weekly and daily average
    const dates = Object.keys(history).sort();
    let weeklyTotal = 0;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    dates.forEach(date => {
        const dataDate = new Date(date);
        if (dataDate >= sevenDaysAgo) {
            weeklyTotal += parseFloat(history[date].total) || 0;
        }
    });

    const dailyAverage = dates.length > 0 ? (weeklyTotal / Math.min(dates.length, 7)).toFixed(2) : 0;

    document.getElementById('weekly-footprint').textContent = weeklyTotal.toFixed(2);
    document.getElementById('daily-average').textContent = dailyAverage;
}

function updateStatusBadge(footprint) {
    const badge = document.getElementById('status-badge');
    badge.classList.remove('low', 'moderate', 'high');

    if (footprint < 3) {
        badge.classList.add('low');
        badge.textContent = '✓ LOW IMPACT';
    } else if (footprint < 6) {
        badge.classList.add('moderate');
        badge.textContent = '⚠ MODERATE IMPACT';
    } else {
        badge.classList.add('high');
        badge.textContent = '✗ HIGH IMPACT';
    }
}

function initCharts() {
    initBreakdownChart();
    initTrendChart();
}

function initBreakdownChart() {
    const lastFootprint = JSON.parse(localStorage.getItem('lastFootprint')) || {};
    const breakdown = lastFootprint.breakdown || {};

    const labels = [];
    const data = [];
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'];

    if (breakdown.transport) {
        labels.push('Transport');
        data.push(parseFloat(breakdown.transport));
    }
    if (breakdown.electricity) {
        labels.push('Electricity');
        data.push(parseFloat(breakdown.electricity));
    }
    if (breakdown.food) {
        labels.push('Food');
        data.push(parseFloat(breakdown.food));
    }
    if (breakdown.waste) {
        labels.push('Waste');
        data.push(parseFloat(breakdown.waste));
    }

    const ctx = document.getElementById('breakdownChart');
    if (breakdownChart) {
        breakdownChart.destroy();
    }

    breakdownChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors.slice(0, data.length),
                borderColor: '#fff',
                borderWidth: 2,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        font: { family: "'Poppins', sans-serif", size: 14, weight: '500' },
                        padding: 15,
                        usePointStyle: true,
                        color: '#1a1a1a'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    padding: 12,
                    titleFont: { family: "'Poppins', sans-serif", size: 14, weight: '600' },
                    bodyFont: { family: "'Poppins', sans-serif", size: 12 },
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed.toFixed(2) + ' kg CO₂';
                        }
                    }
                }
            }
        }
    });
}

function initTrendChart() {
    const history = JSON.parse(localStorage.getItem('carbonHistory')) || {};
    const dates = Object.keys(history).sort();

    const last7Days = [];
    const last7Data = [];

    const today = new Date();
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const value = history[dateStr]?.total || 0;

        last7Days.push(dayName);
        last7Data.push(parseFloat(value));
    }

    const ctx = document.getElementById('trendChart');
    if (trendChart) {
        trendChart.destroy();
    }

    trendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: last7Days,
            datasets: [{
                label: 'Daily Carbon Footprint (kg CO₂)',
                data: last7Data,
                borderColor: '#1f6f43',
                backgroundColor: 'rgba(31, 111, 67, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#4caf50',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8,
                pointHoverBackgroundColor: '#1f6f43'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        font: { family: "'Poppins', sans-serif", size: 14, weight: '500' },
                        padding: 15,
                        color: '#1a1a1a'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    padding: 12,
                    titleFont: { family: "'Poppins', sans-serif", size: 14, weight: '600' },
                    bodyFont: { family: "'Poppins', sans-serif", size: 12 },
                    callbacks: {
                        label: function(context) {
                            return context.parsed.y.toFixed(2) + ' kg CO₂';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        font: { family: "'Poppins', sans-serif", size: 12 },
                        color: '#666',
                        callback: function(value) {
                            return value.toFixed(1);
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    ticks: {
                        font: { family: "'Poppins', sans-serif", size: 12 },
                        color: '#666'
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', initDashboard);
