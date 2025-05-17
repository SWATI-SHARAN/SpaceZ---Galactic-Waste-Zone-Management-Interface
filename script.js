document.addEventListener("DOMContentLoaded", () => {
    updateDate();
    loadDarkMode();
});



function loadDarkMode() {
    if (localStorage.getItem("darkMode") === "true") {
        document.body.classList.add("dark-mode");
    }
}

//cursor
const cursor = document.getElementById("custom-cursor");

document.addEventListener("mousemove", (e) => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
});