// show alert
const showAlert = document.querySelector("[show-alert]");

if(showAlert){
    const time = parseInt(showAlert.getAttribute("data-time"));
    const closeAlert = showAlert.querySelector("[close-alert]")

    setTimeout(() => {
        showAlert.classList.add("alert-hidden")
    }, time)

    closeAlert.addEventListener("click", () => {
        showAlert.classList.add("alert-hidden")
    })
}

// // Detect brows or tab closing
// window.addEventListener("beforeunload", function(e){
//     socket.emit("CLIENT_CLOSE_WEB", "test");

// })