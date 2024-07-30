const listBtnAddFriend = document.querySelectorAll("[btn-add-friend]")
if (listBtnAddFriend.length > 0) {
    listBtnAddFriend.forEach(button => {
        button.addEventListener("click", () => {
            button.closest(".box-user").classList.add("add");
            const userId = button.getAttribute("btn-add-friend");

            socket.emit("CLIENT_ADD_FRIEND", userId);
        })
    })
}
// HET Chuc nang gui yeu cau

// Chuc nang huy yeu cau
const listBtnCancelFriend = document.querySelectorAll("[btn-cancel-friend]")
if (listBtnCancelFriend.length > 0) {
    listBtnCancelFriend.forEach(button => {
        button.addEventListener("click", () => {
            button.closest(".box-user").classList.remove("add");
            const userId = button.getAttribute("btn-cancel-friend");

            socket.emit("CLIENT_CANCEL_FRIEND", userId);
        })
    })
}
// HET Chuc nang huy yeu cau

// Ham chuc nang tu choi yeu cau 
const refuseFriend = (button) => {
    button.addEventListener("click", () => {
        button.closest(".box-user").classList.add("refuse");
        const userId = button.getAttribute("btn-refuse-friend");

        socket.emit("CLIENT_REFUSE_FRIEND", userId);
    })
}
// Chuc nang tu choi yeu cau
const listBtnRefuseFriend = document.querySelectorAll("[btn-refuse-friend]")
if (listBtnRefuseFriend.length > 0) {
    listBtnRefuseFriend.forEach(button => {
        refuseFriend(button);
    })
}
// HET Chuc nang tu choi yeu cau

// Chuc nang chap nhan yeu cau
const acceptFrined = (button) => {
    button.addEventListener("click", () => {
        button.closest(".box-user").classList.add("accepted");
        const userId = button.getAttribute("btn-accept-friend");

        socket.emit("CLIENT_ACCEPT_FRIEND", userId);
    })
}
const listBtnAcceptFriend = document.querySelectorAll("[btn-accept-friend]")
if (listBtnAcceptFriend.length > 0) {
    listBtnAcceptFriend.forEach(button => {
        acceptFrined(button);
    })
}
// HET Chuc nang tu choi yeu cau


// SERVER_RETURN_LENGTH_ACCEPT_FRIENDS
socket.on("SERVER_RETURN_LENGTH_ACCEPT_FRIENDS", (data) => {
    const badgeUsersAccept = document.querySelector("[badge-users-accept]");
    if (badgeUsersAccept) {
        const userId = badgeUsersAccept.getAttribute("badge-users-accept")
        socket.on("SERVER_RETURN_LENGTH_ACCEPT_FRIENDS", (data) => {
            if (userId === data.userId) {
                badgeUsersAccept.innerHTML = data.lengthAcceptFriends;
            }
        })
    }
})

// SERVER_RETURN_INFO_ACCEPT_FRIENDS
socket.on("SERVER_RETURN_INFO_ACCEPT_FRIENDS", (data) => {
    // Trang loi moi da nhan
    const dataUserAccept = document.querySelector("[data-user-accept]")
    if (dataUserAccept) {
        const userId = dataUserAccept.getAttribute("data-user-accept");
        if (userId === data.userId) {
            // Ve user ra giao dien 
            const div = document.createElement("div");
            div.classList.add("col-6");
            div.setAttribute("user-id", data.infoUserA._id);

            div.innerHTML = `
                <div class="col-6"> 
                 <div class="box-user">
                  <div class="inner-avatar"> 
                   <img src="data:image/jpeg;base64,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" alt="${data.infoUerA.fullName}">
                  </div>
                  <div class="inner-info"> 
                   <div class="inner-name">${data.infoUserA.fullName}</div>
                   <div class="inner-buttons">
                    <button class="btn btn-sm btn-primary mr-1" btn-accept-friend="${data.infoUserA._id}">Ket ban </button>
                    <button class="btn btn-sm btn-secondary mr-1" btn-refuse-friend="${data.infoUserA._id}">Huy</button>
                    <button class="btn btn-sm btn-secondary mr-1 btn-deleted-friend disabled="">Da xoa</button>
                    <button class="btn btn-sm btn-secondary mr-1 btn-accepted-friend disabled="">Da chap nhan</button>
                   </div>
                  </div>
                 </div>
                </div>
            `;
            dataUserAccept.appendChild(div);
            const userId = badgeUsersAccept.getAttribute("data-user-accept")
            // Huy loi moi ket ban
            const buttonRefuse = div.querySelector("[btn-refuse-friend]")
            refuseFriend(buttonRefuse);

            // Chap nhan loi moi ket ban
            const buttonAccept = div.querySelector("[btn-accept-friend]")
            acceptFrined(buttonAccept);

        }
    }
    // Trang danh sach nguoi dung
    const dataUserNotFriend = document.querySelector("[data-user-not-friend]")
    if (dataUserNotFriend) {
        const userId = dataUserNotFriend.getAttribute("data-user-not-friend");
        if (userId === data.userId) {
            const boxUserRemove = dataUserNotFriend.querySelector(`[user-id='${data.infoUserA._id}']`)
              if (boxUserRemove) {
                dataUserNotFriend.removeChild(boxUserRemove)
            }
        }
    }
})


//SERVER_RETURN_USER_ID_CANCEL_FRIENDS
socket.on("SERVER_RETURN_USER_ID_CANCEL_FRIENDS", (data) => {
    const userIdA = data.userIdA;
    const boxUserRemove = document.querySelector(`[user-id='${userIdA}']`)
    if (boxUserRemove) {
        const dataUserAccept = document.querySelector("[data-user-accept]");
        const userIdB = badgeUsersAccept.getAttribute("badge-user-accept")
        if (userIdB === data.userIdB) {
            dataUserAccept.removeChild(boxUserRemove);
        }
    }
})

//SERVER_RETURN_USER_STATUS_ONLINE
socket.on("SERVER_RETURN_USER_STATUS_ONLINE", (data) => {
    const dataUserFriend = document.querySelector("[data-user-friend]")
    console.log(dataUserFriend)
    if (dataUserFriend) {
        const boxUser = dataUserFriend.querySelector(`[user-id="${data.userId}"]`);
        if(boxUser){
            console.log(boxUser)
            const boxStatus = boxUser.querySelector("[status]");
            boxStatus.setAttribute("status", data.status)
        }
    }
})
