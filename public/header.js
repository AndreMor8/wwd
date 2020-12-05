window.RufflePlayer = window.RufflePlayer || {};
window.antixss = function (string = "") {
    string = string.replace('&', '&amp;');
    string = string.replace('<', '&lt;');
    string = string.replace('>', '&gt;');
    string = string.replace('/', '&#x2F');
    string = string.replace('"', '&quot;');
    string = string.replace("'", '&#x27;');
    return string;
};
window.antixsslinks = function (string = "") {
    string = string.replace('<', '&lt;');
    string = string.replace('>', '&gt;');
    string = string.replace('"', '&quot;');
    string = string.replace("'", '&#x27;');
    return string;
};
document.addEventListener("DOMContentLoaded", () => {
    // Get all "navbar-burger" elements
    const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll(".navbar-burger"), 0);
    // Check if there are any navbar burgers
    if ($navbarBurgers.length > 0) {
        // Add a click event on each of them
        $navbarBurgers.forEach(el => {
            el.addEventListener("click", () => {
                // Get the target from the "data-target" attribute
                const target = el.dataset.target;
                const $target = document.getElementById(target);
                // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
                el.classList.toggle("is-active");
                $target.classList.toggle("is-active");
            });
        });
    }
});
