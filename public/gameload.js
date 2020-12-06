let ruffle = window.RufflePlayer.newest();
const containerStyle = `border-style: ridge;
border-color: aqua;
border-width: 10px;`;
function load(link) {
    let container = document.getElementById("container");
    document.getElementById("game-content").style.display = "none";
    container.style.display = "block";
    let player = ruffle.createPlayer();
    player.container.style = containerStyle;
    container.appendChild(player);
    player.onfullscreenchange = function() {
        if (this.isFullscreen) {
            this.container.style = "";
        } else {
            this.container.style = containerStyle;
        }
    }
    player.load(link);
    const newnavbaritem = document.createElement("a");
    newnavbaritem.setAttribute("class", "navbar-item")
    newnavbaritem.innerHTML = "<b>Back</b>";
    newnavbaritem.addEventListener("click", function () {
        location.reload();
    });
    newnavbaritem.style.backgroundColor = "aqua"
    document.getElementsByClassName("navbar-start")[0].appendChild(newnavbaritem);
}