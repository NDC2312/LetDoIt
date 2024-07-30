import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'
const upload = new FileUploadWithPreview.FileUploadWithPreview('upload-images', {
    multiple: true,
    maxFileCount: 6
});
// CLIENT_SEND_MESSAGE
const formSendData = document.querySelector(".chat .inner-form")
if (formSendData) {
    formSendData.addEventListener('submit', (e) => {
        e.preventDefault();
        const content = e.target.elements.content.value;
        const images = upload.cachedFileArray

        if (content || images.length > 0) {
            socket.emit("CLIENT_SEND_MESSAGE", {
                content: content,
                images: images
            });
            e.target.elements.content.value = "";
            upload.resetPreviewPanel();
            socket.emit("CLIENT_SEND_TYPING", "hidden");
        }
    })
}

//SERVER_RETURN_MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (data) => {
    const myId = document.querySelector("[my-id]").getAttribute("my-id")
    const body = document.querySelector(".chat .inner-body")
    const boxTyping = document.querySelector(".chat .inner-list-typing")

    const div = document.createElement("div");
    let htmlFullName = "";
    let htmlContent = "";
    let htmlImages = "";

    if (myId == data.userId) {
        div.classList.add("inner-outing");
    } else {
        htmlFullName = `<div class="inner-name">${data.fullName}</div>`;
        div.classList.add("inner-incoming");
    }

    if(data.content) {
        htmlContent = `
        <div class="inner-content">${data.content}</div>
    `
    }

    if(data.images.length > 0) {
        htmlImages += `<div class="inner-images">`;

        for (const image of data.images) {
            htmlImages += `<img src="${image}">`;
        }
        htmlImages += `</div>`
    }

    div.innerHTML = `
        ${htmlFullName}
        ${htmlContent}
        ${htmlImages}
    `
    body.insertBefore(div, boxTyping);
    body.scrollTop = body.scrollHeight;

    //preview Images
    const gallery = new Viewer(div);

});
// END SERVER_RETURN_MESSAGE

// SCROLL Chat to room
const bodyChat = document.querySelector(".chat .inner-body")
if (bodyChat) {
    bodyChat.scrollTop = bodyChat.scrollHeight;
}
// SHOW icon chat
document.querySelector('emoji-picker')
    .addEventListener('emoji-click', event => console.log(event.detail));

// Show icon chat
// Show popup
const buttonIcon = document.querySelector('.button-icon')
if (buttonIcon) {
    const tooltip = document.querySelector('.tooltip')
    Popper.createPopper(buttonIcon, tooltip)
    buttonIcon.onclick = () => {
        tooltip.classList.toggle('shown')
    }
}

// Insert Icon to input
// SHOW Typing
var timeOut;
const showTyping = () => {
    socket.emit("CLIENT_SEND_TYPING", "show");

    clearTimeout(timeOut);
    timeOut = setTimeout(() => {
        socket.emit("CLIENT_SEND_TYPING", "hidden");
    }, 3000);
}


const emojiPicker = document.querySelector("emoji-picker")
if (emojiPicker) {
    const inputChat = document.querySelector(".chat .inner-form input[name='content']")
    emojiPicker.addEventListener("emoji-click", (e) => {
        const icon = e.detail.unicode;
        inputChat.value = inputChat.value + icon;
        inputChat.setSelectionRange(inputChat.value.length,inputChat.value.length);
        inputChat.focus();
        showTyping();
    });

    // Input keyUp
    inputChat.addEventListener("keyup", () => {
        showTyping();
    });
}

// SERVER_RETURN_TYPING
const elementListTyping = document.querySelector(".chat .inner-list-typing")
if (elementListTyping) {
    socket.on("SERVER_RETURN_TYPING", (data) => {
        console.log(data);
        if (data.type == "show") {
            const bodyChat = document.querySelector(".chat .inner-body")
            const existTyping = elementListTyping.querySelector(`[user-id="${data.userId}"]`)
            if (!existTyping) {
                const boxTyping = document.createElement("div")
                boxTyping.classList.add("box-typing");
                boxTyping.setAttribute("user-id", data.userId);

                boxTyping.innerHTML = `
                <div class="box-typing>
                    <div class="inner-game">${data.fullName}</div>
                    <div class="inner-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            `
                elementListTyping.appendChild(boxTyping);
                bodyChat.scrollTop = bodyChat.scrollHeight;

            }
        } else {
            const boxTypingRemove = elementListTyping.querySelector(`[user-id="${data.userId}"]`)
            if (boxTypingRemove) {
                elementListTyping.removeChild(boxTypingRemove);
            }
        }
    })

}

// Preview Full Image
const bodyChatPreviewImage = document.querySelector(".chat .inner-body")
if(bodyChatPreviewImage) {
    const gallery = new Viewer(bodyChatPreviewImage);
}
