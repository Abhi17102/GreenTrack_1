// Carbon Emission Factors
const EMISSION_FACTORS = {
    transport: {
        car: 0.21,
        bus: 0.10,
        bike: 0.05,
        electric: 0.02
    },
    electricity: 0.82,
    food: {
        vegetarian: 1.5,
        'non-vegetarian': 3.3,
        vegan: 1.0
    },
    waste: 0.5
};

// Update navbar active link
function updateNavActive() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPage ||
            (currentPage === '' && link.getAttribute('href') === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Distance slider update
if (document.getElementById('distance')) {
    const distanceSlider = document.getElementById('distance');
    const distanceValue = document.getElementById('distance-value');
    const distanceHidden = document.getElementById('distance-hidden');
    const transportSelect = document.getElementById('transport-type');
    const distanceGroup = document.getElementById('distance-group');

    transportSelect.addEventListener('change', (e) => {
        if (e.target.value) {
            distanceGroup.style.display = 'block';
        } else {
            distanceGroup.style.display = 'none';
        }
    });

    distanceSlider.addEventListener('input', (e) => {
        distanceValue.textContent = e.target.value;
        distanceHidden.value = e.target.value;
    });
}

// Form submission
if (document.getElementById('activityForm')) {
    document.getElementById('activityForm').addEventListener('submit', (e) => {
        e.preventDefault();
        calculateFootprint();
    });
}

function calculateFootprint() {
    const transportType = document.getElementById('transport-type').value;
    const distance = parseFloat(document.getElementById('distance-hidden').value) || 0;
    const electricity = parseFloat(document.getElementById('electricity').value) || 0;
    const foodType = document.getElementById('food-type').value;
    const waste = parseFloat(document.getElementById('waste').value) || 0;

    let total = 0;
    const breakdown = {};

    // Transport
    if (transportType && distance > 0) {
        const transportEmission = distance * EMISSION_FACTORS.transport[transportType];
        total += transportEmission;
        breakdown.transport = transportEmission;
    }

    // Electricity
    if (electricity > 0) {
        const electricityEmission = electricity * EMISSION_FACTORS.electricity;
        total += electricityEmission;
        breakdown.electricity = electricityEmission;
    }

    // Food
    if (foodType) {
        const foodEmission = EMISSION_FACTORS.food[foodType];
        total += foodEmission;
        breakdown.food = foodEmission;
    }

    // Waste
    if (waste > 0) {
        const wasteEmission = waste * EMISSION_FACTORS.waste;
        total += wasteEmission;
        breakdown.waste = wasteEmission;
    }

    // Save to localStorage
    const today = new Date().toISOString().split('T')[0];
    const history = JSON.parse(localStorage.getItem('carbonHistory')) || {};

    history[today] = {
        total: total.toFixed(2),
        breakdown: breakdown,
        timestamp: new Date().toISOString()
    };

    localStorage.setItem('carbonHistory', JSON.stringify(history));
    localStorage.setItem('lastFootprint', JSON.stringify({
        total: total.toFixed(2),
        breakdown: breakdown,
        date: today
    }));

    // Redirect to dashboard
    window.location.href = 'dashboard.html';
}

// Clear all data
function clearAllData() {
    if (confirm('Are you sure you want to clear all your data? This cannot be undone.')) {
        localStorage.removeItem('carbonHistory');
        localStorage.removeItem('lastFootprint');
        localStorage.removeItem('ecoPoints');
        localStorage.removeItem('completedHabits');
        alert('All data cleared successfully!');
        window.location.reload();
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateNavActive();
});
