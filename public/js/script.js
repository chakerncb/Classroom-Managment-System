function openForm() {
    document.getElementById("modal-form").style.display = "block";
}

function closeForm() {
    document.getElementById("modal-form").style.display = "none";
    document.getElementById('passwordField').style.display = 'block';
}

function toggleDay(dayId) {
    const days = ['sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Saturday'];
    days.forEach(day => {
        const dayElement = document.getElementById(day);
        if (day === dayId) {
            dayElement.style.display = dayElement.style.display === "none" || dayElement.style.display === "" ? "block" : "none";
        } else {
            dayElement.style.display = "none";
        }
    });
}

function openScheduleForm(day) {
    document.getElementById('scheduleForm').reset();
    document.getElementById('day').value = day;
    document.getElementById('modal-form').style.display = 'block';
}

function closeScheduleForm() {
    document.getElementById('modal-form').style.display = 'none';
}

function toggleDay(dayId) {
    const dayElement = document.getElementById(dayId);
    dayElement.style.display = dayElement.style.display === 'none' ? 'block' : 'none';
}
