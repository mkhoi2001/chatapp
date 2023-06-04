const socket = io();

/**
 * Login Localstorage Info
 */
let record = JSON.parse(localStorage.getItem("currentUser"));
if (!record) {
  window.location = "/login";
}
userId = record.data.user._id;
userName = record.data.user.name;
userEmail = record.data.user.email;
userLocation = record.data.user.location;
let receiverId;
let profile,profileStatus;
let bg_image;
let contact__Name, contactProfile;
let contactFavourite, themesColor, themeImage;
let uStatus;
let msgtno,
  startm,
  scrolli,
  contactInfo,
  ucontacts = [],
  directContacts = [],
  directContactLists,
  addmbr,
  copy_text;
let ReplayMsg, replayId;
let groupId, memberCount, rmName;
let webcam, voiceRecorder;
let avType;
function setimg(im) {
  profile = im;
}
function setBgImg(bimage) {
  bg_image = bimage;
}
let gmember;
let mcontact_list;

let flag = 0;

function setcontact(c) {
  mcontact_list = c;
}

//============================= Online Offline start =================================//
// Online User List
socket.emit("new-user-joined", userId, userName);
socket.on("user-connected", (socket_id, socket_name) => {
  var userName = document.querySelectorAll("#contact-id-" + socket_id+" .chat-user-img");
  Array.from(userName).forEach((element, index) => {
    element.classList.add("online");
  });
});

//Online Users List and online class set
socket.on("m-online-user-list", (users) => {
  setTimeout(() => {
    user_arr = Object.values(users ? users : "");
    user_arr.pop(userId);
    for (i = 0; i < user_arr.length; i++) {
      if (user_arr[i] != userId)
        var userName = document.querySelectorAll("#contact-id-" +  user_arr[i]+" .chat-user-img");
        Array.from(userName).forEach((element, index) => {
          element.classList.add("online");
        });
    }
  }, 200);
});

// User Disconnected
socket.on("user-disconnected", (socket_id) => {
  var id = socket_id;
  var last_seen_date = new Date();
  socket.emit("userLastSeen", { id, last_seen_date });
  document.getElementById("contact-id-" + socket_id) ? document.getElementById("contact-id-" + socket_id).querySelector(".chat-user-img").classList.remove("online") : "";
});


//============================= Online Offline End =================================//
// Current Info
socket.emit("currentUserInfo", userId);
socket.on("currentInfo", ({ user }) => {
  profile = user.profile; 
  var profile_img = user.profile ? user.profile : "assets/images/users/avatar-1.jpg";
  var profile_bg_img = user.bg_image ? user.bg_image : "assets/images/small/img-1.jpg";
  themesColor = user.theme_color;
  themeImage = user.theme_image;

  // Current user name set
  var userName = document.querySelectorAll(".user_name");
  Array.from(userName).forEach((element, index) => {
    element.innerHTML = user.name;
  });

  // Current user status set
  var userStatus = document.querySelectorAll(".user_status");
  Array.from(userStatus).forEach((element, index) => {
    element.innerHTML = user.status;
  });

  // Current user profile set
  var userProfile = document.querySelectorAll(".user-profile-image");
  Array.from(userProfile).forEach((element, index) => {
    element.src = `${profile_img}`;
  });

  // Current background image set
  var userBgImg = document.querySelectorAll(".profile-foreground-img");
  Array.from(userBgImg).forEach((element, index) => {
    element.src = `${profile_bg_img}`;
  });

  // Current user email set
  var userEmail = document.querySelectorAll(".user_email");
  Array.from(userEmail).forEach((element, index) => {
    element.innerHTML = user.email;
  });

  // Current user location set
  var userLocation = document.querySelectorAll(".user_location");
  Array.from(userLocation).forEach((element, index) => {
    element.innerHTML = user.location;
  });

  // current lastseen set
  user.is_lastseen == 1 ? (document.getElementById("privacy-lastseenSwitch").checked = true) : "";

  // current privancy status set
  document.querySelector("#select_id").value = user.is_status;

  // current privancy status set
  document.querySelector("#profile_id").value = is_profile = user.is_profile;

  // Current Notification and sound muted set
  user.is_notification == 1 ? (document.getElementById("security-notificationswitch").checked = true) : "";
  user.is_muted == 1 ? (document.getElementById("notification_muted_switch").checked = true) : "";
});

/**
 * Comman Functions
 */
//Attached File Validation
function fileAttachedValidation() {
  var fileInput = document.getElementById("attachedfile-input");
  let file = document.getElementById("attachedfile-input").files[0];
  var filePath = fileInput.value;
  // Allowing file type
  var allowedExtensions = /(\.pdf|\.zip)$/i;
  var fileSize = file.size;
  if (!allowedExtensions.exec(filePath)) {
    toastr.error(`Please select only valid Pdf or Zip file.`, "Error");
    fileInput.value = "";
  } else {
    // Image preview
    if (fileInput.files && fileInput.files[0]) {
      if (fileSize > 2097152) {
        toastr.error(`pless select file less than 2MB`, "Error");
        fileInput.value = "";
      }
    }
  }
}

//Image File Validation
function imageValidation() {
  var fileInput = document.getElementById("galleryfile-input");
  let file = document.getElementById("galleryfile-input").files[0];
  var filePath = fileInput.value;
  // Allowing file type
  var allowedExtensions = /(\.png|\.gif|\.jpg|\.jpeg)$/i;
  var fileSize = file.size;
  if (!allowedExtensions.exec(filePath)) {
    toastr.error(`Please select only valid Png, gif or Jpeg file.`, "Error");
    fileInput.value = "";
  } else {
    // Image preview
    if (fileInput.files && fileInput.files[0]) {
      if (fileSize > 2097152) {
        toastr.error(`pless select file less than 2MB`, "Error");
        fileInput.value = "";
      }
    }
  }
}

//Audio File Validation
function audioValidation() {
  var fileInput = document.getElementById("audiofile-input");
  let file = document.getElementById("audiofile-input").files[0];
  var filePath = fileInput.value;
  // Allowing file type
  var allowedExtensions = /(\.mp3|\.mp4)$/i;
  var fileSize = file.size;
  if (!allowedExtensions.exec(filePath)) {
    toastr.error(`Please select only valid Mp3 or Mp4 file.`, "Error");
    fileInput.value = "";
  } else {
    // Image preview
    if (fileInput.files && fileInput.files[0]) {
      if (fileSize > 2097152) {
        toastr.error(`pless select file less than 2MB`, "Error");
        fileInput.value = "";
      }
    }
  }
}

//Current Time
function currentTime() {
  var ampm = new Date().getHours() >= 12 ? "pm" : "am";
  var hour = new Date().getHours() > 12 ? new Date().getHours() % 12 : new Date().getHours();
  var minute = new Date().getMinutes() < 10 ? "0" + new Date().getMinutes() : new Date().getMinutes();
  if (hour < 10) {
    return "0" + hour + ":" + minute + " " + ampm;
  } else {
    return hour + ":" + minute + " " + ampm;
  }
}
setInterval(currentTime, 1000);

//----------- Emoji Picker --------------------//
// chat emojiPicker input
var emojiPicker = new FgEmojiPicker({
  trigger: [".emoji-btn"],
  removeOnSelection: false,
  closeButton: true,
  position: ["top", "right"],
  preFetch: true,
  dir: "assets/js/dir/json",
  insertInto: document.querySelector(".chat-input"),
});
// emojiPicker position
var emojiBtn = document.getElementById("emoji-btn");
emojiBtn.addEventListener("click", function () {
  setTimeout(function () {
    var fgEmojiPicker = document.getElementsByClassName("fg-emoji-picker")[0];
    if (fgEmojiPicker) {
      var leftEmoji = window.getComputedStyle(fgEmojiPicker)
        ? window.getComputedStyle(fgEmojiPicker).getPropertyValue("left")
        : "";
      if (leftEmoji) {
        leftEmoji = leftEmoji.replace("px", "");
        leftEmoji = leftEmoji - 40 + "px";
        fgEmojiPicker.style.left = leftEmoji;
      }
    }
  }, 0);
});

/**
 * Contacts Section
 */
const contactForm = document.querySelector(".contact_form");

// ----------------------- Contact create -------------------------------//
contactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  name = document.getElementById("c_name").value;
  email = document.getElementById("contact_email").value;
  created_by = userId;
  socket.emit("contactCreate", { name, email, created_by, userEmail });
  document.querySelector("#contact_name_edit").style.display = "block";
  document.querySelector(".contact_addbtn").style.display = "none";
});

// Contact Form Validation
function checkInput() {
  contactName = document.getElementById("c_name");
  contactEmail = document.getElementById("contact_email");
  contactMessage = document.getElementById("contact_message");
  var name = contactName.value;
  var email = contactEmail.value;
  var message = contactMessage.value;
  if (email === "") {
    setErrorFor(contactEmail, "Please provide your email");
    return false;
  } else {
    setSuccessFor(contactEmail);
  }

  if (name === "") {
    setErrorFor(contactName, "Please provide your name");
    return false;
  } else {
    setSuccessFor(contactName);
  }

  if (message === "") {
    setErrorFor(contactMessage, "Please provide your message");
    return false;
  } else {
    setSuccessFor(contactMessage);
  }
}
function setErrorFor(input, message) {
  input.classList.add("is-invalid");
  input.classList.remove("is-valid");
  $(".invalid-feedback").removeAttr("hidden");
  $(".invalid-feedback").text(message);
}
function setSuccessFor(input) {
  input.classList.remove("is-invalid");
  input.classList.add("is-valid");
}

// Toastr Error Message
socket.on("contactsError", ({ msg }) => {
  toastr.error(msg, "Error");
});

// Toastr Success Message
socket.on("Success", ({ msg }) => {
  toastr.success(msg, "Success");
  value = document.getElementById("hide_modal").click();
  value = document.getElementById("hide_contact_modal").click();
  document.querySelector(".group_form").reset();
  document.querySelector(".contact_form").reset();
  document.querySelector(".error_message").innerHTML = "";
});

//--------------------- Contact Appned --------------------//
socket.on("singleContact", ({ contacts }) => {
  var userNameCharAt = "";
  var isSortAlphabets = [];
  var profile = contacts.user_id.profile ? `<img src="${contacts.user_id.profile}" class="img-fluid rounded-circle" alt="">` : `<span class="avatar-title rounded-circle bg-primary font-size-10">${contacts.name[0]}</span>`;
  const msgHTML = `
        <li id="contacts-id-${contacts.user_id._id}" data-ids='${contacts.user_id._id}' onclick="contactClickEvent(this)">
              <div class="d-flex align-items-center">
                  <div class="flex-shrink-0 me-2">
                      <div class="avatar-xs">
                          ${profile}
                      </div>
                  </div>
                  <div class="flex-grow-1">
                      <h5 class="font-size-14 m-0" >${contacts.name}</h5>
                  </div>
                  <div class="flex-shrink-0">
                      <div class="dropdown">
                          <a href="#" class="text-muted dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                              <i class="bx bx-dots-vertical-rounded align-middle"></i>
                          </a>
                          <div class="dropdown-menu dropdown-menu-end">
                              <a class="dropdown-item d-flex align-items-center justify-content-between" href="#">Block <i class="bx bx-block ms-2 text-muted"></i></a>
                              <a class="dropdown-item d-flex align-items-center justify-content-between delete_contact" href="javascript:void(0);" onclick="contactDelete('${contacts._id}', '${contacts.user_id._id}')">Remove <i class="bx bx-trash ms-2 text-muted"></i></a>
                          </div>
                      </div>
                  </div>
              </div>
          </li>
      `;

      if(document.getElementById(`contact-sort-${contacts.name.charAt(0)}`) == null || document.getElementById(`contact-sort-${contacts.name.charAt(0)}`).getElementsByTagName('li').length == 0){
        var contact_sort = `<div class="contact-list-title" id="contact-of-${contacts.name.charAt(0)}">${contacts.name.charAt(0).toUpperCase()}</div>`
      }
      var isSortContact = `<div class="mt-3">
              <div id="contact-of-${contacts.name.charAt(0).toUpperCase()}"><div class="contact-of-${contacts.name.charAt(0).toUpperCase()} contact-list-title">${contacts.name.charAt(0).toUpperCase()}</div>
                    <ul id="contact-sort-${contacts.name.charAt(0).toUpperCase()}" class="list-unstyled contact-list">`;
                      if (userNameCharAt != contacts.name.charAt(0)) {
                        document.getElementsByClassName("sort-contact")[0].innerHTML += isSortContact;
                      }
                      document.getElementById("contact-sort-" + contacts.name.charAt(0).toUpperCase()).innerHTML = document.getElementById("contact-sort-" + contacts.name.charAt(0).toUpperCase()).innerHTML + msgHTML;
                      userNameCharAt = contacts.name.charAt(0);
              +"</ul></div></div>";

  if(document.querySelector("#contact-id-" + contacts.user_id._id + " .contactNames") != null){
    document.querySelector("#contact-id-" + contacts.user_id._id + " .contactNames").innerHTML = contacts.name;
    document.querySelector("#contact-id-" + contacts.user_id._id + " .contactNames").innerHTML = contacts.name;
    var userName = document.querySelectorAll(".contact_name");
      Array.from(userName).forEach((element, index) => {
        element.innerHTML =  contacts.name;
      });
  }
  toggleSelected();

  //------------------ Forward contact List Append -----------------//
  const fcontactMsgHTML = `
  <li id="forward-contact-${contacts.user_id}">
  <div class="d-flex align-items-center">
            <div class="flex-grow-1">
                <h5 class="font-size-14 m-0">${contacts.name}</h5>
            </div>
            <div class="flex-shrink-0">
                <button type="button" class="btn btn-sm btn-primary" id="${contacts.user_id}" onclick="forwardMsgSend(this)">Send</button>
            </div>
        </div>
  </li>
  `;
var isSortContact =
  '<div class="mt-3" >\
    <div class="contact-list-title">' + contacts.name.charAt(0).toUpperCase() +'</div>\
    <ul id="fcontacts-sort-' + contacts.name.charAt(0) +'" class="list-unstyled contact-list" >';

    document.getElementsByClassName("forward_contacts")[0].innerHTML +=  isSortContact;
    document.getElementById("fcontacts-sort-" + contacts.name.charAt(0)).innerHTML = document.getElementById("fcontacts-sort-" + contacts.name.charAt(0)).innerHTML + fcontactMsgHTML;
    userNameCharAt = contacts.name.charAt(0);
+"</ul>" + "</div>";

});

//Contact List dynamic Details
function contactList() {
  startm = 0;
}

//--------------------- Contacts Get ----------------------//
// var currentSelectedChat = "users";
var currentChatId = "users-chat";
var dummyImage = "assets/images/users/user-dummy-img.jpg";
var dummyContactImage = "assets/images/users/user-dummy-img.jpg";
var url = window.location.origin + "/assets/js/dir/";

socket.emit("contactData", { userId });
socket.on("contactsLists", ({ contacts }) => {
  setcontact(contacts);
  usersList = contacts;
  contactInfo = contacts;
  contacts.sort(function (a, b) {
    return a.name.localeCompare(b.name);
  });
  // Contact List Get
  var msgHTML = "";
  var userNameCharAt = "";
  var contactIds = [];
  contacts.forEach((contact, index) => {
    ucontacts[index] = contact.user_id;

    //-------------------- Contact List ----------------------//
    var profile = contact.profile
      ? `<img src="${contact.profile}" class="img-fluid rounded-circle" alt="" style="aspect-ratio:1;object-fit:cover">`
      : `<span class="avatar-title rounded-circle bg-primary font-size-10">${contact.name[0]}</span>`;
    const msgHTML = `
        <li id="contacts-id-${contact.user_id}" data-ids='${contact.user_id}' onclick="contactClickEvent(this)">
              <div class="d-flex align-items-center">
                  <div class="flex-shrink-0 me-2">
                      <div class="avatar-xs">
                          ${profile}
                      </div>
                  </div>
                  <div class="flex-grow-1">
                      <h5 class="font-size-14 m-0">${contact.name}</h5>
                  </div>
                  <div class="flex-shrink-0">
                      <div class="dropdown">
                          <a href="#" class="text-muted dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                              <i class="bx bx-dots-vertical-rounded align-middle"></i>
                          </a>
                          <div class="dropdown-menu dropdown-menu-end">
                              <a class="dropdown-item d-flex align-items-center justify-content-between" href="#">Block <i class="bx bx-block ms-2 text-muted"></i></a>
                              <a class="dropdown-item d-flex align-items-center justify-content-between" href="javascript:void(0);" onclick="contactDelete('${contact._id}', '${contact.user_id}')">Remove <i class="bx bx-trash ms-2 text-muted"></i></a>
                          </div>
                      </div>
                  </div>
              </div>
          </li>
      `;
    var isSortContact = `<div class="mt-3">
      <div id="contact-of-${contact.name.charAt(0).toUpperCase()}"><div class="contact-of-${contact.name.charAt(0).toUpperCase()} contact-list-title">${contact.name.charAt(0).toUpperCase()}</div>
            <ul id="contact-sort-${contact.name.charAt(0).toUpperCase()}" class="list-unstyled contact-list">`;
    if (userNameCharAt != contact.name.charAt(0)) {
      document.getElementsByClassName("sort-contact")[0].innerHTML += isSortContact;
    }
    document.getElementById("contact-sort-" + contact.name.charAt(0).toUpperCase()).innerHTML = document.getElementById("contact-sort-" + contact.name.charAt(0).toUpperCase()).innerHTML + msgHTML;
    userNameCharAt = contact.name.charAt(0);
    +"</ul></div></div>";

    //------------------ Forward contact List -----------------//
    const fcontactMsgHTML = `
      <li id="forward-contact-${contact.user_id}">
      <div class="d-flex align-items-center">
                <div class="flex-grow-1">
                    <h5 class="font-size-14 m-0">${contact.name}</h5>
                </div>
                <div class="flex-shrink-0">
                    <button type="button" class="btn btn-sm btn-primary" id="${contact.user_id}" onclick="forwardMsgSend(this)">Send</button>
                </div>
            </div>
      </li>
      `;
    var isSortContact =
      '<div class="mt-3" >\
        <div class="contact-list-title">' + contact.name.charAt(0).toUpperCase() +'</div>\
        <ul id="fcontacts-sort-' + contact.name.charAt(0) +'" class="list-unstyled contact-list" >';

        document.getElementsByClassName("forward_contacts")[0].innerHTML +=  isSortContact;
        document.getElementById("fcontacts-sort-" + contact.name.charAt(0)).innerHTML = document.getElementById("fcontacts-sort-" + contact.name.charAt(0)).innerHTML + fcontactMsgHTML;
        userNameCharAt = contact.name.charAt(0);
    +"</ul>" + "</div>";

    //--------------------- Contact List -----------------------//
    const contactMsgHTML = `
      <li id="contact-${contact.user_id}">
          <div>
          <div class="form-check">
              <input type="checkbox" name="contacts_member" class="form-check-input" id="memberCheck1" value="${contact.user_id}">
              <label class="form-check-label" for="memberCheck1">${contact.name}</label>
          </div>
          </div>
      </li>
      `;
    var isSortContact =
      '<div class="mt-3" >\
        <div class="contact-list-title">' + contact.name.charAt(0).toUpperCase() +'</div>\
        <ul id="contacts-sort-' + contact.name.charAt(0) +'" class="list-unstyled contact-list" >';

        document.getElementsByClassName("contact_lists1")[0].innerHTML +=  isSortContact;
        document.getElementById("contacts-sort-" + contact.name.charAt(0)).innerHTML = document.getElementById("contacts-sort-" + contact.name.charAt(0)).innerHTML + contactMsgHTML;
        userNameCharAt = contact.name.charAt(0);
    +"</ul>" + "</div>";
  });
  contactList();
  toggleSelected();
});

//============================== Contact Click Event =============================//
function contactClick(data){
  document.getElementById("contact-id-"+data.getAttribute("data-ids")) ? document.getElementById("contact-id-"+data.getAttribute("data-ids")).querySelector("a").click() : '';
  document.getElementById("contacts-id-"+data.getAttribute("data-ids")).querySelector("a").click();
}

//========================== Contact Click Function =============================//
function contactClickEvent(data) {
  var userChat = "users";
  updateSelectedChat(userChat);
  startm = 0;
  var contactId = receiverId = data.getAttribute("data-ids");
  socket.emit("userClick", { receiverId, userId, startm });
  socket.emit("userStatus", { id:contactId });
  document.querySelector('.common_groups').innerHTML = '';
  document.querySelector(".typing_msg").innerHTML = '';
  document.querySelector(".user-own-img").classList.remove("online");
}

//------------------- Click Wise Contact Data Get --------------------------------//
socket.on("contactClickEvent", ({ contacts }) => {
  if(contacts != null){
    currentChatId = "users-chat";
    var contactId = contacts._id;
    var contactName = contact__Name = contacts.name;
    var contactEmail = contacts.email;

    if(contacts.user_id){


      var contactLocation = contacts.user_id.location;
      var contactStatus = contacts.user_id.status;
      var contactId = contacts.user_id._id;
      var contactImg = contactProfile = contacts.user_id.profile != undefined && contacts.user_id.is_profile != 0 ? `${contacts.user_id.profile}` : dummyImage;
      //var contactReceiverImg = contacts.user_id.bg_image != undefined ? `assets/images/small/${contacts.user_id.bg_image}` : dummyImage;
      document.querySelector(".contact_addbtn").style.display = "none";
      document.querySelector("#contact_name_edit").style.display = "block";
      var contactSeen = contacts.user_id.is_lastseen;
      if(contacts.user_id.is_status != 0){
        document.querySelector(".user-profile-sidebar .users_status").innerHTML = contactStatus ? contactStatus :'';
      }
    }else{
      var contactLocation = contacts.location;
      var contactId = contacts._id;
      var contactImg = contactProfile = contacts.profile != undefined && contacts.is_profile != 0 ? `${contacts.profile}` : dummyImage;
      //var contactReceiverImg = contactProfile = contacts.profile != undefined && contacts.is_profile != 0 ? `assets/images/small/${contacts.user_id.bg_image}` : dummyImage;
      document.querySelector(".contact_addbtn").style.display = "block";
      document.querySelector("#contact_name_edit").style.display = "none";
      document.getElementById("contact_email").value = contacts.email;
      document.getElementById("c_name").value = contacts.name;
      document.getElementById("contact_email").disabled = true;
      var contactSeen = contacts.is_lastseen;
    }
    //contactFavourite = contacts.is_favourite;
    document.querySelector(".text-truncate .user-profile-show").innerHTML = contactName;
    document.querySelector(".user-profile-desc .text-truncate").innerHTML = contactName;
    document.querySelector(".audiocallModal .text-truncate").innerHTML = contactName;
    document.querySelector(".videocallModal .text-truncate").innerHTML = contactName;
    document.querySelector(".user-profile-sidebar .user-name").innerHTML = contactName;
    document.querySelector(".text-truncate .user-profile-show").innerHTML = contactName;
    document.querySelector(".userEmail").innerHTML = contactEmail;
    document.querySelector(".userLocation").innerHTML = contactLocation;
    document.querySelector(".user-own-img .avatar-sm").setAttribute("src",contactImg);
    //document.querySelector(".user-profile-sidebar .profile-img").setAttribute("src", contactReceiverImg);
    document.querySelector(".audiocallModal .img-thumbnail").setAttribute("src", contactImg);
    document.querySelector(".videocallModal .videocallModal-bg").setAttribute("src", contactImg);
    setTimeout(() => {
      //contactFavourite == 1 ? document.querySelector(".favourite-btn").classList.add("active") : document.querySelector(".favourite-btn").classList.remove("active");
    }, 300);
    window.stop();
    document.querySelector(".group_member_sec").style.display = "none";
    document.querySelector(".common_group_sec").style.display = "block";
    if( contactSeen == 1 || uStatus == 'Online'){
      document.querySelector(".typing_msg").innerHTML = `<small class="userstatus">${uStatus}</small>`;
      document.querySelector(".contact_status").innerHTML = `<small>${uStatus}</small>`;
    }
    if(uStatus == 'Online'){
      document.querySelector(".user-own-img").classList.add("online");
    }

    var username = document.querySelectorAll(".sender_name");
    Array.from(username).forEach((element, index) => {
      element.innerHTML = contactName;
    });
    var userProfile = document.querySelectorAll(".sender_profile");
    Array.from(userProfile).forEach((element, index) => {
      element.src = contactImg;
    });
    var user_id = document.querySelectorAll("#icvid");
    Array.from(user_id).forEach((element, index) => {
      element.innerHTML = contactId;
    });
  }
  document.querySelector(".receiverInfo").style.display = "block";
  document.querySelector(".exit_group").style.display = "none";
  document.querySelector(".group_member_sec").style.display = "none";
  document.querySelector('.chat-welcome-section').style.display = "none";
	document.querySelector('.chat-content div').style.display = "block";
});

// chat user responsive hide show
function toggleSelected() {
  var userChatElement = document.getElementsByClassName("user-chat");

  document.querySelectorAll(".chat-user-list li a").forEach(function (item) {
    item.addEventListener("click", function (event) {
      userChatElement.forEach(function (elm) {
        elm.classList.add("user-chat-show");
      });
      // chat user list link active
      var chatUserList = document.querySelector(".chat-user-list li.active");
      if (chatUserList) chatUserList.classList.remove("active");
      this.parentNode.classList.add("active");
    });
  });

  document.querySelectorAll(".sort-contact ul li").forEach(function (item2) {
    item2.addEventListener("click", function (event) {
      userChatElement.forEach(function (elm) {
        elm.classList.add("user-chat-show");
      });
    });
  });

  	// user-chat-remove
    document.querySelectorAll(".user-chat-remove").forEach(function (item) {
      item.addEventListener("click", function (event) {
        userChatElement.forEach(function (elm) {
          elm.classList.remove("user-chat-show");
        });
      });
    });
}

function updateSelectedChat(currentSelectedChat) {
  if (currentSelectedChat == "users") {
    document.getElementById("channel-chat").style.display = "none";
    document.getElementById("users-chat").style.display = "block";
  } else {
    document.getElementById("channel-chat").style.display = "block";
    document.getElementById("users-chat").style.display = "none";
  }
}
updateSelectedChat();

// Profile hide/show
var userProfileSidebar = document.querySelector(".user-profile-sidebar");

document.querySelectorAll(".user-profile-show").forEach(function (item) {
  item.addEventListener("click", function (event) {
    userProfileSidebar.classList.toggle("d-block");
  });
});

//============================= Contact Message Search ================================//
function searchContactsMsg() {
  input = document.getElementById("searchChatMessage");
  filter = input.value;
  socket.emit("messageSearchValue", { filter, userId, receiverId });
}

//------------------- Search Contacts ---------------------------//
function searchContacts() {
  input = document.getElementById("searchContact");
  filter = input.value.toUpperCase();
  list = document.querySelector(".sort-contact");
  li = list.querySelectorAll(".mt-3 li");
  div = list.querySelectorAll(".mt-3 .contact-list-title");

  for (j = 0; j < div.length; j++) {
    var contactTitle = div[j];
    txtValue = contactTitle.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      div[j].style.display = "";
    } else {
      div[j].style.display = "none";
    }
  }

  for (i = 0; i < li.length; i++) {
    contactName = li[i];
    txtValue = contactName.querySelector("h5").innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}

//----------------------- Contact Message create ----------------------------//
//add an eventListener to the from
var chatForm = document.querySelector("#chatinput-form");
var chatInput = document.querySelector("#chat-input");
var itemList = document.querySelector(".chat-conversation-list");
var chatInputFeedback = document.querySelector(".chat-input-feedback");
var usersList = "";
var userChatId = 1;

function scrollToBottom(id) {
  var simpleBar = document.getElementById(id).querySelector("#chat-conversation .simplebar-content-wrapper");
  var offsetHeight = document.getElementsByClassName("chat-conversation-list")[0] ?
                    document.getElementById(id).getElementsByClassName("chat-conversation-list")[0].scrollHeight -
                    window.innerHeight + 250 : 0;
  if (offsetHeight)
    simpleBar.scrollTo({ top: offsetHeight, behavior: "smooth" });
}

// Contact Msg Create
const contactMsgForm = document.querySelector(".contactMsg_form");
contactMsgForm.addEventListener("submit", (e) => {
  	e.preventDefault();
  	var contactsMember = [];
  	document.querySelectorAll("input[name='contacts_member']:checked").forEach(function (e) {
      f = 1;
      contactsMember.push(e.value);
    });
    if(groupId != null){
      socket.emit("group_contacts_message_create", {
        sender_id: userId,
        group_id: groupId,
        contactsIds: contactsMember,
        profile: profile
      });
    }
    else{
      socket.emit("contacts_message_create", {
        sender_id: userId,
        receiver_id: receiverId,
        contactsIds: contactsMember,
        profile: profile,
        flag:flag
      });
    }
    document.getElementById("contacts_model").click();
});

//-------------------------- Message Not Space allowed -------------------//
document.getElementById("chat-input").addEventListener("keydown", function (e) {
  if (this.value.length === 0 && e.which === 32) e.preventDefault();
});
if (chatForm) {
  //add an item to the List, including to local storage
  chatForm.addEventListener("submit", function (e) {
    e.preventDefault();


    var chatId = currentChatId;
    var chatInputValue = chatInput.value;
    let file = document.getElementById("attachedfile-input").files[0];
    let image = document.getElementById("galleryfile-input").files[0] != undefined ? document.getElementById("galleryfile-input").files[0] : webcam;
    let audio = document.getElementById("audiofile-input").files[0] != undefined ? document.getElementById("audiofile-input").files[0] : voiceRecorder;
    var messageId = document.querySelector('.message_id').value;
    if (file) {
      var extName = file.name.split(".").pop();
	  var filename= (Math.floor(Math.random() * (99999 - 1234)) + 1000)+'.'+extName;
  }
  let formData = new FormData();
  formData.append("file", file);
  formData.append("fnm", filename);
    // Image Formdata
    if (image) {
      var extName = image.name.split(".").pop();
      var has_image= (Math.floor(Math.random() * (99999 - 1234)) + 1000)+'.'+extName;
    }

    let imgformData = new FormData();
    imgformData.append("file", image);
    imgformData.append("fnm", has_image);

    // Audio File Formate
    if (audio) {
      var extName = audio.name.split(".").pop();
	    var has_audio= (Math.floor(Math.random() * (99999 - 1234)) + 1000)+'.'+extName;
    }
    let audioformData = new FormData();
    audioformData.append("file", audio);
    audioformData.append("fnm", has_audio);

    if (groupId != null) {
      if (file != undefined) {
        socket.emit("group_msg", {
          message: chatInputValue,
          sender_id: userId,
          group_id: groupId,
          has_files: filename,
          profile: profile,
          is_replay: ReplayMsg,
          replay_id: replayId,
          userId: userId,
        });
        fetch("/fileUploads", { method: "POST", body: formData });
        document.querySelector(".file_Upload ").classList.remove("show");
      } else if (image != undefined) {
        fetch("/imageUploads", { method: "POST", body: imgformData });
        socket.emit("group_msg", {
          message: chatInputValue,
          sender_id: userId,
          group_id: groupId,
          has_images: has_image,
          profile: profile,
          is_replay: ReplayMsg,
          replay_id: replayId,
          userId: userId,
          flag:flag
        });
        // fetch("/imageUploads", { method: "POST", body: imgformData });
        document.querySelector(".file_Upload ").classList.remove("show");
      } else if (audio != undefined) {
        socket.emit("group_msg", {
          message: chatInputValue,
          sender_id: userId,
          group_id: groupId,
          has_audio: has_audio,
          profile: profile,
          is_replay: ReplayMsg,
          replay_id: replayId,
          userId: userId,
        });
        fetch("/audioUploads", { method: "POST", body: audioformData });
        document.querySelector(".file_Upload ").classList.remove("show");
      } else {
        if (chatInputValue != "") {
          if(messageId){
            socket.emit("update_group_msg", {
              flag:flag,
              message: chatInputValue,
              sender_id: userId,
              group_id: groupId,
              userId: userId,
              userEmail: userEmail,
              userName: userName,
              userLocation: userLocation,
              profile: profile,
              is_replay: ReplayMsg,
              replay_id: replayId,
              messageId:messageId
            });
            var editMessage = flag == '1' ? "(edited)":flag == '3'? "(Forwarded)":"";

            document.querySelector(".msg_" + messageId + " .edit-flag").innerHTML = editMessage;
            document.querySelector(".msg_" + messageId + " .ctext-content").innerHTML = chatInputValue ;
          }
          else{
            socket.emit("group_msg", {
              flag:flag,
              message: chatInputValue,
              sender_id: userId,
              group_id: groupId,
              userId: userId,
              userEmail: userEmail,
              userName: userName,
              userLocation: userLocation,
              profile: profile,
              userName: userName,
              is_replay: ReplayMsg,
              replay_id: replayId,
            });
          }
        }else {
            chatInputFeedback.classList.add("show");
            setTimeout(function () {
              chatInputFeedback.classList.remove("show");
            }, 3000);
          }
      }
    } else {
      if (file != undefined) {
        socket.emit("send_msg", {
          message: chatInputValue,
          sender_id: userId,
          receiver_id: receiverId,
          has_files: filename,
          profile: profile,
          is_replay: ReplayMsg,
          replay_id: replayId,
        });
        fetch("/fileUploads", { method: "POST", body: formData });
        document.querySelector(".file_Upload ").classList.remove("show");
      } else if (image != undefined) {
        socket.emit("send_msg", {
          message: chatInputValue,
          sender_id: userId,
          receiver_id: receiverId,
          has_dropDown: false,
          has_images: has_image,
          profile: profile,
          is_replay: ReplayMsg,
          replay_id: replayId,
        });
        fetch("/imageUploads", { method: "POST", body: imgformData });
        document.querySelector(".file_Upload ").classList.remove("show");
      } else if (audio != undefined) {
        socket.emit("send_msg", {
          message: chatInputValue,
          sender_id: userId,
          receiver_id: receiverId,
          has_audio: has_audio,
          profile: profile,
          is_replay: ReplayMsg,
          replay_id: replayId,
        });
        fetch("/audioUploads", { method: "POST", body: audioformData });
        document.querySelector(".file_Upload ").classList.remove("show");
      } else {
        if(messageId){
          socket.emit("update_msg", {
            message: chatInputValue,
            sender_id: userId,
            receiver_id: receiverId,
            userId: userId,
            userEmail: userEmail,
            userName: userName,
            userLocation: userLocation,
            profile: profile,
            is_profile:is_profile,
            is_replay: ReplayMsg,
            replay_id: replayId,
            flag:flag,
            messageId:messageId
          });
          var editMessage = flag == '1' ? "(edited)":flag == '3'? "(Forwarded)":"";
          document.querySelector(".msg_" + messageId + " .edit-flag").innerHTML = editMessage;
          document.querySelector(".msg_" + messageId + " .ctext-content").innerHTML = chatInputValue ;
        }
        else{
          if (chatInputValue != "") {
            socket.emit("send_msg", {
              message: chatInputValue,
              sender_id: userId,
              receiver_id: receiverId,
              userId: userId,
              userEmail: userEmail,
              userName: userName,
              userLocation: userLocation,
              profile: profile,
              is_profile:is_profile,
              is_replay: ReplayMsg,
              replay_id: replayId,
              flag:flag
            });
          } else {
            chatInputFeedback.classList.add("show");
            setTimeout(function () {
              chatInputFeedback.classList.remove("show");
            }, 3000);
          }
        }

      }
    }
    replayId = null;
    ReplayMsg = null;
    webcam = null;
    voiceRecorder = null;
    chatInput.value = "";
    document.getElementById("attachedfile-input").value = "";
    document.getElementById("galleryfile-input").value = "";
    document.getElementById("audiofile-input").value = "";
  });
}

//--------------------------- Contact Message Append -------------------------------//
var messageIds = 0;
socket.on("get_msg_res",function ({ flag, id, message, sender_id, receiver_id, receiver_name, receiver_profile, has_dropDown, has_files, has_images, has_audio, createdAt, is_replay, replay_id, location, contacts_id, contact_name, contact_profile, is_profile}) {
    messageIds++;
    if (document.getElementById("contact-id-" + id) == null) {
       direcetList(receiver_id, receiver_name, userName, (useremail = ""), userLocation, (favourite = "0"), receiver_profile, 0, is_profile);
    }
    var contacts_profile = contact_profile != undefined ? contact_profile:dummyContactImage;
    if(receiverId == receiver_id){
      appendMsg(flag,id, message, sender_id, receiver_id, has_dropDown, has_files, has_images, has_audio, createdAt, is_replay, replay_id, location, contacts_id, contact_name, contacts_profile);
    }

    if (contactFavourite == 1) {
      let menu = document.getElementById("favourite-users");
      let li = document.getElementById("contact-id-" + receiverId);
      menu.insertBefore(li, menu.firstElementChild.nextElementSibling);
    } else {
      let menu = document.getElementById("usersList");
      let li = document.getElementById("contact-id-" + receiverId);
    }
    copyClipboard();
  }
);
//--------------------------- Contact Message Append -------------------------------//
var messageIds = 0;
socket.on("get_msg",function ({flag,id, message, sender_id, receiver_id, receiver_name, receiver_profile, has_dropDown, has_files, has_images, has_audio, createdAt, is_replay, replay_id, location, contacts_id, contact_name, contact_profile, contact_email, userId, userEmail, userName, userLocation, profile, is_profile}) {
  var replyName;
  var cnt=[];
  var cntf=0;
  	mcontact_list.forEach((mc) => {
		if(mc.user_id==sender_id){
			cnt.push(mc.name);
			cntf++;
		}
	})
	if(cntf>0){
		replyName = cnt[0];
	}
	else{
		replyName = userName;
	}
    messageIds++;
    if(contact_name != undefined){
      direcetList(sender_id, contact_name, userName, userEmail, userLocation, 0, profile, 1, is_profile);
    }
    var contacts_profile = contact_profile != undefined ? contact_profile:dummyContactImage;
    if (document.getElementById("contact-id-" + id) == null) {
      if (receiverId == sender_id) {
        if ((userId == sender_id && receiverId == receiver_id) || receiverId == sender_id ) {
          var unread = 1;
          socket.emit("unreadMsgUpdate", { receiverId, unread });
          appendMsg(flag, id, message, sender_id, receiver_id, has_dropDown, has_files, has_images, has_audio, createdAt, is_replay, replay_id, location, contacts_id, contact_name, contacts_profile, contact_email, profile,replyName);
        }
      } else {
        var unread_msg = parseInt(document.querySelector("#contact-id-" + sender_id + " .unread_msg").getAttribute("data-msg")) + 1;
        document.querySelector("#contact-id-" + sender_id + " .unread_msg").setAttribute("data-msg", unread_msg);
        document.querySelector("#contact-id-" + sender_id + " .unread_msg").innerHTML = unread_msg;

        if (document.getElementById("notification_muted_switch").checked == true) {
          var audio = new Audio("assets/notification/notification.mp3");
          audio.play();
        }

        if (document.getElementById("security-notificationswitch").checked == true) {
          const receiver_Image = profile ? `${profile}` : dummyImage;
          requestNotificationPermissions();
          var instance = new Notification(userName, {
            body: message,
            icon: receiver_Image,
          });
        }
      }
      copyClipboard();
    }
  }
);

function requestNotificationPermissions() {
  if (Notification.permission !== "denied") {
    Notification.requestPermission(function (permission) {});
  }
}

//================================== Message Append ==============================//
var uniqueid = 100;
var uid = 100;
function appendMsg(flag,id,message,sender_id,receiver_id,has_dropDown,has_files,has_images,has_audio,createdAt,is_replay,replay_id,location,contacts_id,contact_name,contacts_profile,contact_email,profile,replyName,receiverName) {
  var msg_class = groupId != null ? "channel-chat" : "users-chat";
  if (groupId != null) {
    var replayName =  replay_id != undefined && replay_id == userId ? userName : replyName;
  }
  else{
    var replayName =  replay_id != undefined && replay_id == userId ? userName : contact__Name;
  }
  // Sender and receiver contact message append
  var profile = profile != undefined ? profile : "user-dummy-img.jpg";
  var isAlighn = sender_id == userId ? " right" : " left";
  var reply_id = sender_id == userId ? userId : sender_id;
  var chatConList = document.getElementById(msg_class);
  var itemList = chatConList.querySelector(".chat-conversation-list");

  var msgHTML = `<li class="chat-list ${isAlighn} msg_${id}" id="${reply_id}"><div class="conversation-list"><div class="user-chat-content">`;
  msgHTML += getMsg(id,message,userName,contacts_id,contact_name,has_images,has_files,has_audio,has_dropDown,is_replay,replay_id,replayName,location,contacts_id,contact_name,contact_email,contacts_profile,sender_id,flag);
  msgHTML += `<div class="conversation-name 11">
                <small class="text-muted time">${currentTime()}</small>
                <span class="text-success check-message-icon"><i class="bx bx-check"></i></span>
              </div></div></div></li>`;
  itemList.innerHTML += msgHTML;
  google_map(location,'#gmaps-markers_'+uniqueid);
  google_replymap(is_replay,'#reply_gmaps_'+uid);
  scrollToBottom(msg_class);
  updateLightbox();
}


// ------------------------ Onload Contact Message Get -------------------//
document.getElementById("copyClipBoard").style.display = "none";
function MessageGet(contactMsgs) {
  var isSortAlphabets = [];
  var ndates = new Date();
  const todaydate = ndates.getDate() + "-" + (ndates.getMonth() + 1) + "-" + ndates.getFullYear();
  const yesterdaydate = ndates.getDate() - 1 + "-" + (ndates.getMonth() + 1) + "-" + ndates.getFullYear();
  contactMsgs.forEach((isChat, index) => {

    var mcontactProfile = isChat.mcontactProfile[0] != undefined ? isChat.mcontactProfile[0]:dummyContactImage;
    if (groupId != null) {
      var replayMemberName =  isChat.replay_id != undefined && isChat.replay_id == userId ? userName : isChat.contactName;
    }
    else{
      var replayMemberName =  isChat.replay_id != undefined && isChat.replay_id == userId ? userName : contact__Name;
    }

    const time = new Date(isChat.createdAt);
    var ampm = time.getHours() >= 12 ? "pm" : "am";
    var hour = time.getHours() > 12 ? new Date().getHours() % 12 : new Date().getHours();
    var minute = time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes();
    var cratedTime = hour + ":" + minute + " " + ampm;
    const form_id = isChat.sender_id == userId ? 1 : 2;
    var isAlighn = form_id == userChatId ? " right" : " left";
    var profile = isChat.profile[0] != undefined ? isChat.profile[0] : "user-dummy-img.jpg";
    const datewise = time.getDate() + "-" + (time.getMonth() + 1) + "-" + time.getFullYear();
    if (datewise == todaydate) {
        var pd = "Today"
    } else if (datewise == yesterdaydate) {
        var pd = "yesterday";
    } else {
        var pd = datewise;
    }

    var msgHTML = '<li class="chat-list' + isAlighn + " msg_" + isChat._id +'" id=' + isChat.user_id[0] +'>\
                  <div class="conversation-list"><div class="user-chat-content">';
    if (form_id != userChatId)
    msgHTML += '<div class="user-chat-content">';
    msgHTML += getMsg(isChat._id, isChat.message, isChat.name[0], isChat.contacts_id, isChat.contactName[0], isChat.has_images, isChat.has_files,isChat.has_audio,isChat.has_dropDown,isChat.is_replay,isChat.replay_id,replayMemberName,isChat.location,isChat.contacts_id,isChat.mcontact_name, isChat.mcontact_email, mcontactProfile,isChat.sender_id,isChat.flag,isChat.voice_recoder,isAlighn);
    msgHTML +=
      `<div class="conversation-name 22"><small class="text-muted time">${cratedTime}</small> <span class="text-default check-message-icon"><i class="bx bx-check"></i></span></div></div></div></div></li>`;

    if(groupId != null){
      const isSortGroup = `
        <li>
            <div class="chat-day-title" id="name-with-${datewise}">
                <span class="title">${pd}</span>
            </div>
        </li>
        <ul id="group-sort-${pd}" class="list-unstyled chat-conversation-list mt-0"></ul>`
      if (!isSortAlphabets.includes(pd + "")) {
        isSortAlphabets.push(pd);
        $(`#channel-conversation`).prepend(isSortGroup);
      }
      $(`#group-sort-${pd}`).prepend(msgHTML);
    }
    else{
		const isSortContact = `
		<li>
			<div class="chat-day-title" id="name-with-${datewise}">
				<span class="title">${pd}</span>
			</div>
		</li>
		<ul id="contact-sort-${pd}" class="list-unstyled chat-conversation-list mt-0"></ul>`
		if (!isSortAlphabets.includes(pd + "")) {
			isSortAlphabets.push(pd);
			$(`#users-conversation`).prepend(isSortContact);
		}
		$(`#contact-sort-${pd}`).prepend(msgHTML);
    }

	//------------------ Google Map Set ------------------//
	google_map(isChat.location,'#gmaps-markers_'+uniqueid);
	google_replymap(isChat.is_replay,'#reply_gmaps_'+uid);
  });
}


socket.on("chat-pg", ({ contactMsgs }) => {
  scrolli = $(".messages__history").height();
  MessageGet(contactMsgs);
});

socket.on("contactMessage", ({ contactMsgs, msgno }) => {
  var isContinue = 0;
  msgtno = msgno;
  currentSelectedChat = 'users';
  document.getElementById(currentSelectedChat + "-conversation").innerHTML = "";
  document.querySelector(".attachedFileList").innerHTML = "";
  document.querySelector(".media_list").innerHTML = "";
  MessageGet(contactMsgs);
  updateLightbox();
  copyClipboard();
  startm = 10;
});

socket.on("commonGroupLists", ({ commGroups }) => {
  commGroups.forEach(commgroup => {
    var cgroup = `
    <li>
        <a href="javascript: void(0);">
            <div class="d-flex align-items-center">
                <div class="flex-shrink-0 avatar-xs me-2">
                    <span class="avatar-title rounded-circle bg-soft-light text-dark">
                        #
                    </span>
                </div>
                <div class="flex-grow-1 overflow-hidden">
                    <p class="text-truncate mb-0">${commgroup.group_name}</p>
                </div>
            </div>
        </a>
    </li>`;
    document.querySelector('.common_groups').innerHTML += cgroup;
  });

});

// Image Light Box Function
function updateLightbox() {
  var lightbox = GLightbox({
    selector: ".popup-img",
    title: false,
  });
}

// getMeg
function getMsg(id,msg,name, contact_id, contactName, has_images, has_files, has_audio, has_dropDown, is_replay, replay_id, replay_name, location,contacts_id,contacts_name, contacts_email, contacts_profile, senderId,flag,voice_recoder,isAlighn) {
  var msgHTML = "";
  var replaymsg = is_replay != undefined || is_replay != null ? is_replay : "";

  if (is_replay != null) {
    var replayMsg = reply_msg(replay_name,replaymsg)
  }
  if (has_files != null) {
    var attachedfile = flag != 2 ? attached_file(id,has_files):"";
  }
  if (has_images != null) {
    var imageFiles = flag != 2 ? image_file(id,has_images):"";
  }
  if (has_audio != null) {
    var attachedfile = flag != 2 ? audio_file(id,has_audio):""
  }
  if (location != null) {
    var locationMsg = flag != 2 ? `<div id="gmaps-markers_${uniqueid}" class="gmaps"></div>`:"";
  }
  if (contacts_id != null) {
    if(senderId == userId){
      var cntactMsg = `<button type="button" class="btn btn-outline-light border-primary text-truncate" data-ids='${contact_id}' onclick="contactClick(this)"><i class="uil uil-user mr-1"></i> Message</button>`
    }
    else{
      var cntactMsg = `<button type="button" class="btn btn-outline-light border-primary text-truncate contact_addbtn" data-email='${contacts_email[0]}' data-name='${contacts_name[0]}' onclick="contactsMsgClickEvent(this)" data-bs-toggle="modal" data-bs-target="#addContact-exampleModal" style="display: block;">Add Contact</button>`
    }
    var contactsMsg = contact_msg(contacts_profile,contacts_name[0],cntactMsg)
  }

  if (msg != null) {
    var editMessage = flag == '1' ? "(edited)":flag == '3'? "(Forwarded)":"";
    if(flag != 2){
      var message = `<small class='text-secondary edit-flag 11'>${editMessage}</small><p class="mb-0 ctext-content">${msg}</p>`;
    }
    else{
      var message = `<p class="mb-0 ctext-content">Deleted Message</p>`
    }
  }
  if (has_dropDown == "true") {
    if(flag != 2)
    var droupdown = droup_down_btn(id,msg,location,contact_id, isAlighn);
  }

  msgHTML = `<div class="ctext-wrap">
    <div class="ctext-wrap-content">${replayMsg != undefined ? replayMsg : ""} ${attachedfile != undefined ? attachedfile:""} ${imageFiles != undefined ? imageFiles : ""} ${locationMsg != undefined ? locationMsg : ""} ${contactsMsg != undefined ? contactsMsg :""} ${message != undefined ? message :""}</div>
    ${droupdown != undefined ? droupdown :''}
  </div>`;
  return msgHTML;
}

//==================== Model Contact list search ==================//
function searchContactOnModal() {
  input = document.getElementById("searchContactModal");
  filter = input.value.toUpperCase();
  list = document.querySelector(".contact-modal-list");
  li = list.querySelectorAll(".mt-3 li");
  div = list.querySelectorAll(".mt-3 .contact-list-title");

  for (j = 0; j < div.length; j++){
    var contactTitle = div[j];
    txtValue = contactTitle.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      div[j].style.display = "";
    } else {
      div[j].style.display = "none";
    }
  }

  for (i = 0; i < li.length; i++){
    contactName = li[i];
    txtValue = contactName.querySelector(".form-check-label").innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
    }
  }

//==================== Attached Files Upload ===========================//
function attached_file(id,file){
  // Message AttachedFile
  var attachedfile = `
  <div class="attached-file"><div class="p-3 border-primary border rounded-3">
	<div class="d-flex align-items-center">
		<div class="flex-shrink-0 avatar-sm me-3 ms-0 attached-file-avatar">
			<div class="avatar-title bg-soft-primary text-primary rounded-circle font-size-20">
				<i class="ri-attachment-2"></i>
			</div>
		</div>
		<div class="flex-grow-1 overflow-hidden">
			<div class="text-start">
				<h5 class="font-size-14 mb-1">${file}</h5>
			</div>
		</div>
		<div class="flex-shrink-0 ms-4">
			<div class="d-flex gap-2 font-size-20 d-flex align-items-start">\
				<div>
					<a href="assets/images/image/${file}" download="" class="text-muted">
						<i class="bx bxs-download"></i>
					</a>
				</div>
			</div>
		</div>
	</div>
	</div>
  </div>`;

// Receiver Attached file append
var receiverAttachedFile = `
<div class="card p-2 border mb-2 msg_${id}">
  <div class="d-flex align-items-center">
      <div class="flex-shrink-0 avatar-xs ms-1 me-3">
          <div class="avatar-title bg-soft-primary text-primary rounded-circle">
              <i class="bx bx-file"></i>
          </div>
      </div>
      <div class="flex-grow-1 overflow-hidden">
          <h5 class="font-size-14 text-truncate mb-1">${file}</h5>
      </div>

      <div class="flex-shrink-0 ms-3">
          <div class="d-flex gap-2">
              <div>
                  <a href="assets/images/image/${file}" download="" class="text-muted px-1">
                      <i class="bx bxs-download"></i>
                  </a>
              </div>
              <div class="dropdown">
                  <a class="dropdown-toggle text-muted px-1" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      <i class="bx bx-dots-horizontal-rounded"></i>
                  </a>
                  <div class="dropdown-menu dropdown-menu-end">
                      <a class="dropdown-item d-flex align-items-center justify-content-between" href="#">Share <i class="bx bx-share-alt ms-2 text-muted"></i></a>
                      <a class="dropdown-item d-flex align-items-center justify-content-between" href="#">Bookmark <i class="bx bx-bookmarks text-muted ms-2"></i></a>
                      <div class="dropdown-divider"></div>
                      <a class="dropdown-item d-flex align-items-center justify-content-between" href="javascript:void(0);" id="${id}" onclick="singleMessageDelete(this)">Delete<i class="bx bx-trash ms-2 text-muted"></i></a>
                  </div>
              </div>
          </div>
      </div>
  </div>
</div>`;
document.querySelector(".attachedFileList").innerHTML += receiverAttachedFile !== undefined ? receiverAttachedFile : "";
return attachedfile;
}

//==================== Image Upload ==========================//
function image_file(id,file){
  if (file == 'false')return '';
  var imageFiles = `<div class="message-img mb-0"><div class="message-img-list">
            <div>
                <a class="popup-img d-inline-block" href="${file}" target="_blank">
                    <img src="${file}" alt="${file}" class="rounded border" width="200">
                </a>
            </div>
            <div class="message-img-link">
            <ul class="list-inline mb-0">
                <li class="list-inline-item dropdown">
                    <a class="dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i class="bx bx-dots-horizontal-rounded"></i>
                    </a>
                    <div class="dropdown-menu">
                        <a class="dropdown-item d-flex align-items-center justify-content-between" href="${file}" download="">Download <i class="bx bx-download ms-2 text-muted"></i></a>
                        <a class="dropdown-item d-flex align-items-center justify-content-between" href="javascript:void(0);" id="${id}" data-image="${file}" onclick="singleMessageReply(this)" data-bs-toggle="collapse" data-bs-target=".replyCollapse">Reply <i class="bx bx-share ms-2 text-muted"></i></a>
                        <a class="dropdown-item d-flex align-items-center justify-content-between" href="javascript:void(0);" id="${id}" onclick="singleMessageForward(this)" data-bs-toggle="modal" data-bs-target=".forwardModal">Forward <i class="bx bx-share-alt ms-2 text-muted"></i></a>
                        <a class="dropdown-item d-flex align-items-center justify-content-between" href="#">Bookmark <i class="bx bx-bookmarks text-muted ms-2"></i></a>
                        <a class="dropdown-item d-flex align-items-center justify-content-between delete-image" href="javascript:void(0);" id="${id}" onclick="singleMessageDelete(this)">Delete <i class="bx bx-trash ms-2 text-muted"></i></a>
                    </div>
                </li>
            </ul>
            </div>
        </div></div>`;

    // Receiver Images file append
    var receiverImagesFile = `
      <div class="message-img mb-0 col-lg-3 msg_${id}" style="flex: 1 auto;">
        <div class="media-img-list position-relative">
            <a class="popup-img d-inline-block" href="${file}">
                <img src="${file}" style="width:91px;" alt="media img" class="img-fluid">
            </a>
            <div class="download_btn">
            <div class="message-img-link">
            <ul class="list-inline mb-0">
                <li class="list-inline-item dropdown">
                    <a class="dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i class="bx bx-dots-horizontal-rounded"></i>
                    </a>
                    <div class="dropdown-menu">
                        <a class="dropdown-item d-flex align-items-center justify-content-between" href="${file}" download="">Download <i class="bx bx-download ms-2 text-muted"></i></a>
                        <a class="dropdown-item d-flex align-items-center justify-content-between" href="#" data-bs-toggle="collapse" data-bs-target=".replyCollapse">Reply <i class="bx bx-share ms-2 text-muted"></i></a>
                        <a class="dropdown-item d-flex align-items-center justify-content-between" href="#" data-bs-toggle="modal" data-bs-target=".forwardModal">Forward <i class="bx bx-share-alt ms-2 text-muted"></i></a>
                        <a class="dropdown-item d-flex align-items-center justify-content-between" href="#">Bookmark <i class="bx bx-bookmarks text-muted ms-2"></i></a>
                        <a class="dropdown-item d-flex align-items-center justify-content-between delete-image" href="javascript:void(0);" id="${id}" onclick="singleMessageDelete(this)">Delete <i class="bx bx-trash ms-2 text-muted"></i></a>
                    </div>
                </li>
            </ul>
            </div>
        </div>
        </div>
        </div>`;

    document.querySelector(".media_list").innerHTML += receiverImagesFile !== undefined ? receiverImagesFile : "";
    return imageFiles;
}

//======================== Audio File Upload ========================//
function audio_file(id,file){
  var extName = file.split(".").pop();
  var imgList = ["wav"];
  if (imgList.includes(extName)) {
    var attachedfile = `<div class="p-3 border-primary border rounded-3">
    <div class="d-flex align-items-center attached-file">
        <div class="flex-grow-1 overflow-hidden">
            <div class="text-start">
            <audio id="player" controls="" src="assets/images/audio/${file}"></audio>
            </div>
        </div>
    </div>
  </div>`;
  }
  else{
  // Message AttachedFile
  var attachedfile = `<div class="p-3 border-primary border rounded-3">
    <div class="d-flex align-items-center attached-file">
        <div class="flex-shrink-0 avatar-sm me-3 ms-0 attached-file-avatar">
            <div class="avatar-title bg-soft-primary text-primary rounded-circle font-size-20">
                <i class="ri-attachment-2"></i>
            </div>
        </div>
        <div class="flex-grow-1 overflow-hidden">
            <div class="text-start">
                <h5 class="font-size-14 mb-1">${file}</h5>
            </div>
        </div>
        <div class="flex-shrink-0 ms-4">
            <div class="d-flex gap-2 font-size-20 d-flex align-items-start">
                <div>
                    <a href="assets/images/audio/${file}" download="" class="text-muted">
                        <i class="bx bxs-download"></i>
                    </a>
                </div>
            </div>
        </div>
    </div>
  </div>`;
  }

// Receiver Attached file append
var receiverAudioFile = `
<div class="card p-2 border mb-2 msg_${id}">
  <div class="d-flex align-items-center">
      <div class="flex-shrink-0 avatar-xs ms-1 me-3">
          <div class="avatar-title bg-soft-primary text-primary rounded-circle">
              <i class="bx bx-file"></i>
          </div>
      </div>
      <div class="flex-grow-1 overflow-hidden">
          <h5 class="font-size-14 text-truncate mb-1">${file}</h5>
      </div>

      <div class="flex-shrink-0 ms-3">
          <div class="d-flex gap-2">
              <div>
                  <a href="assets/images/audio/${file}" download="" class="text-muted px-1">
                      <i class="bx bxs-download"></i>
                  </a>
              </div>
              <div class="dropdown">
                  <a class="dropdown-toggle text-muted px-1" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      <i class="bx bx-dots-horizontal-rounded"></i>
                  </a>
                  <div class="dropdown-menu dropdown-menu-end">
                      <a class="dropdown-item d-flex align-items-center justify-content-between" href="#">Share <i class="bx bx-share-alt ms-2 text-muted"></i></a>
                      <a class="dropdown-item d-flex align-items-center justify-content-between" href="#">Bookmark <i class="bx bx-bookmarks text-muted ms-2"></i></a>
                      <div class="dropdown-divider"></div>
                      <a class="dropdown-item d-flex align-items-center justify-content-between" href="javascript:void(0);" id="${id}" onclick="singleMessageDelete(this)">Delete<i class="bx bx-trash ms-2 text-muted"></i></a>
                  </div>
              </div>
          </div>
      </div>
  </div>
</div>`;

document.querySelector(".attachedFileList").innerHTML += receiverAudioFile !== undefined ? receiverAudioFile : "";
return attachedfile;
}


//======================= Message Droup Down Set =====================//
function droup_down_btn(id,msg,location,contact_id,isAlighn){
  var current_location = location ? location : '';
  var droupdown = `<div class="dropdown align-self-start message-box-drop">
  <a class="dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
      <i class="ri-more-2-fill"></i>
  </a>
  <div class="dropdown-menu">
      <a class="dropdown-item d-flex align-items-center justify-content-between" href="javascript:void(0);" id="${id}" location="${current_location}" onclick="singleMessageReply(this)" data-bs-toggle="collapse" data-bs-target=".replyCollapse">Reply <i class="bx bx-share ms-2 text-muted"></i></a>
      <a class="dropdown-item d-flex align-items-center justify-content-between" href="javascript:void(0);" id="${id}" location="${current_location}" contact="${contact_id}" onclick="singleMessageForward(this)" data-bs-toggle="modal" data-bs-target=".forwardModal" >Forward <i class="bx bx-share-alt ms-2 text-muted"></i></a>`;
      if(isAlighn === ' right'){
        droupdown += `<a class="dropdown-item d-flex align-items-center justify-content-between delete-item" href="javascript:void(0);" id="${id}" onclick="singleMessageDelete(this)">Delete <i class="bx bx-trash text-muted ms-2"></i></a>`;
        droupdown += `<a class="dropdown-item d-flex align-items-center justify-content-between" href="javascript:void(0);" id="${id}" location="${current_location}" onclick="singleMessageUpdate(this)">Edit <i class="bx bx-edit ms-2 text-muted"></i></a>`;
      }
      droupdown += msg ? `<a class="dropdown-item d-flex align-items-center justify-content-between copy-message" href="javascript:void(0);" id="${id}" onclick="copyMessage(this)">Copy <i class="bx bx-copy text-muted ms-2"></i></a>`:'';
      droupdown +=`</div>
</div>`;
return droupdown;
}

//==================== Reply Msg Get =======================//
function reply_msg(name,message){
	var location = message ? message.split("_"):'';
	var extName = message.split(".").pop();
	var imgList = ["jpg", "png"];
	if (imgList.includes(extName)) {
		var msg_content = `<img src="assets/images/image/${message}"" alt="${message}" class="rounded border" width="150">`;
	}
	else{
		var msg_content = `<p class="mb-0">${message}</p>`;
	}

	if(location[2] == "locations"){
		var msg_content = `<div id="reply_gmaps_${uid}" class="gmaps replyMaps"></div>`;
	}

	if(location[1] == "contacts"){
		var msg_content = `Contacts`;
	}

	var replayMsg = `
	<div class="replymessage-block mb-0 d-flex align-items-start">
		<div class="flex-grow-1">
			<h5 class="conversation-name">${name}</h5>
			${msg_content}
		</div>
		<div class="flex-shrink-0">
			<button type="button" class="btn btn-sm btn-link mt-n2 me-n3 font-size-18"></button>
		</div>
	</div>`;
	return replayMsg;
}

//=================== Contact Msg send ============================//
function contact_msg(profile,name,btn){
  var contactsMsg = `
  <div class="contacts_msg">
    <div class="d-flex align-items-center">
      <div class="chat-user-img align-self-center me-2 ms-0">
        <img src="${profile}" class="rounded-circle avatar-xs" alt="">
      </div>
      <div class="overflow-hidden">
        <p class="text-truncate mb-0 contactNames fw-bold fs-6">${name}</p>
      </div>
    </div>
    <hr class="mt-3 my-0">
    <div role="group" class="btn-group">
        ${btn}
    </div>
  </div>`;
  return contactsMsg;
}

//----------------------- Attached File Upload Preview ------------------//
//====================== File Attached =====================//
document.querySelector("#attachedfile-input").addEventListener("change", function () {
    var preview = document.querySelectorAll(".file_Upload");
    var file = document.querySelector("#attachedfile-input").files[0];
    var reader = new FileReader();
    if (preview) {
      document.querySelector(".file_Upload ").classList.add("show");
    }
    reader.addEventListener(
      "load",
      function () {
        Array.from(preview).forEach((element, index) => {
          var filename = file.name;
          var extName = filename.split(".").pop();
          var attachedFile = ["pdf", "zip"];

          if (attachedFile.includes(extName)) {
            var icon = `<i class="ri-attachment-2"></i>`;
          }

          element.innerHTML = `<div class="card p-2 border attchedfile_pre d-inline-block position-relative">
            <div class="d-flex align-items-center">
                <div class="flex-shrink-0 avatar-xs ms-1 me-3">
                    <div class="avatar-title bg-soft-primary text-primary rounded-circle">
                        <i class="ri-attachment-2"></i>
                    </div>
                </div>
                <div class="flex-grow-1 overflow-hidden">
                <a href="" id="a"></a>
                    <h5 class="font-size-14 text-truncate mb-1">${filename}</h5>
                </div>
                <div class="flex-shrink-0 align-self-start ms-3">
                    <div class="d-flex gap-2">
                        <div>
                        <i class="ri-close-line text-muted attechedFile-remove"  id="remove-attechedFile" onclick="deleteImage(this)"></i>
                        </div>
                    </div>
                </div>
            </div>
          </div>`;
        });
      },
      false
    );
    if (file) {
      reader.readAsDataURL(file);
    }
  });

let tgfl = 0;
function showFile() {
  $(".media_list").toggleClass("overflow-hidden");
  if (tgfl == 0) {
    tgfl = 1;
    $(".media_list").css("max-height", "243px");
  } else {
    tgfl = 0;
    $(".media_list").css("max-height", "82px");
  }
}

//======================= Gallery File Upload Preview ==========================//
document.querySelector("#galleryfile-input").addEventListener("change", function () {
    var preview = document.querySelectorAll(".file_Upload");
    var file = document.querySelector("#galleryfile-input").files[0];
    var reader = new FileReader();
    if (preview) {
      document.querySelector(".file_Upload ").classList.add("show");
    }
    reader.addEventListener("load",function () {
        Array.from(preview).forEach((gallery, index) => {
          var filename = file.name;
          var extName = filename.split(".").pop();
          var attachedFile = ["png", "gif", "jpg", "jpeg"];

          if (attachedFile.includes(extName)) {
            var image = `<img src='${reader.result}' class='profile-user' width=150>`;
          }

          gallery.innerHTML = `<div class="card p-2 border attchedfile_pre d-inline-block position-relative">
            <div class="d-flex align-items-center">
                <div class="flex-grow-1 overflow-hidden">
                <a href="" id="a"></a>
                    <h5 class="font-size-14 text-truncate mb-1">${image}</h5>
                </div>
                <div class="flex-shrink-0 align-self-start ms-3">
                    <div class="d-flex gap-2">
                        <div>
                        <i class="ri-close-line text-muted attechedFile-remove"  id="remove-attechedFile" onclick="deleteImage(this)"></i>
                        </div>
                    </div>
                </div>
            </div>
          </div>`;
        });
      },
      false
    );
    if (file) {
      reader.readAsDataURL(file);
    }
});

//============================ Cemera Image Upload ===========================//
//=============================== Audio File Upload Preview ==============================//
document.querySelector("#audiofile-input").addEventListener("change", function () {
    var preview = document.querySelectorAll(".file_Upload");
    var file = document.querySelector("#audiofile-input").files[0];
    var reader = new FileReader();
    if (preview) {
      document.querySelector(".file_Upload ").classList.add("show");
    }
    reader.addEventListener(
      "load",
      function () {
        Array.from(preview).forEach((element, index) => {
          var filename = file.name;
          var extName = filename.split(".").pop();
          var attachedFile = ["mp3", "mp4"];

          if (attachedFile.includes(extName)) {
            var icon = `<i class="ri-video-line"></i>`;
          }

          element.innerHTML = `<div class="card p-2 border mb-2 image_pre d-inline-block position-relative">
        <div class="d-flex align-items-center">
            <div class="flex-shrink-0 avatar-xs ms-1 me-3">
                <div class="avatar-title bg-soft-primary text-primary rounded-circle">
                    ${icon}
                </div>
            </div>
            <div class="flex-grow-1 overflow-hidden">
                <h5 class="font-size-14 text-truncate mb-1">${filename}</h5>
            </div>

            <div class="flex-shrink-0 ms-3">
                <div class="d-flex gap-2">
                    <div>
                    <i class="ri-close-line text-danger" onclick="deleteImage(this)"></i>
                    </div>
                </div>
            </div>
        </div>
      </div>`;
        });
      },
      false
    );
    if (file) {
      reader.readAsDataURL(file);
    }
  });

// Delete Upload Preview Image
function deleteImage(image) {
  document.querySelector(".file_Upload ").classList.remove("show");
  document.getElementById("upload_input").value = "";
  document.getElementById("attachedfile-input").value = "";
  document.getElementById("galleryfile-input").value = "";
  document.getElementById("audiofile-input").value = "";
  webcam = null;
  voiceRecorder = null;
}

//------------------------------ Contact Receiver Info ----------------------------//
var active;
// Receiver Favourity Btn Change
// favourite btn
var favouriteBtn = document.getElementsByClassName("favourite-btn");
for (var i = 0; i < favouriteBtn.length; i++) {
  var favouriteBtns = favouriteBtn[i];
  favouriteBtns.onclick = function () {
    favouriteBtns.classList.toggle("active");
    active =
      document
        .getElementsByClassName("favourite-btn")[0]
        .classList.contains("active") == true
        ? 1
        : 0;
    socket.emit("favourityContactUpdate", {
      user_id: receiverId,
      created_by: userId,
      is_favourite: active,
    });

    if (active == 1) {
      let fav = document.getElementById("favourite-users");
      let li = document.getElementById("contact-id-" + receiverId);
      fav.insertBefore(li, fav.firstElementChild.nextElementSibling);
      document
        .getElementById("contact-id-" + receiverId)
        .querySelector(".contact_favourite").innerHTML = 1;
    }
    if (active == 0) {
      let drc = document.getElementById("usersList");
      let li = document.getElementById("contact-id-" + receiverId);
      drc.insertBefore(li, drc.firstElementChild.nextElementSibling);
      document
        .getElementById("contact-id-" + receiverId)
        .querySelector(".contact_favourite").innerHTML = 0;
    }
  };
}

// Receiver Name Update
function edit_contactName(message) {
  document.getElementById("contact_name").classList.toggle("visually-hidden");
  document.getElementById("contact_name_edit").classList.toggle("visually-hidden");
  document.getElementById("edit-contact-name").classList.toggle("visually-hidden");
  var contactName = document.getElementById("contact_name").textContent;
  document.getElementById("contactname").value = contactName;
}

// current user name edit
document.getElementById("contactname").addEventListener("keydown", function (e) {
    if (this.value.length === 0 && e.which === 32) e.preventDefault();
  });
//======================== Receiver name update ===================================//
function contactNameChange() {
  var name = document.getElementById("contactname").value.toLowerCase();
  if (name == "") {
    toastr.error(`Name is Rrequires`, "Error");
  } else {

	if(document.getElementById("contacts-id-" + receiverId)){
	var before = document.getElementById("contacts-id-" + receiverId).querySelector("h5").innerHTML[0];
	var after = name[0];
	const cntctlengthbf = document.getElementById("contact-sort-" + before.toUpperCase()) ? document.getElementById("contact-sort-" + before.toUpperCase()).getElementsByTagName('li').length:'';
	if (cntctlengthbf <= 1) {
		var temp = document.getElementById('contacts-id-' + receiverId).outerHTML;
		var el = document.createElement("div");
		el.className = 'mt-3';
		el.innerHTML = `<div id="contact-of-${after.toUpperCase()}"><div class="contact-of-${after} contact-list-title">${after.toUpperCase()}</div>
		<ul id="contact-sort-${after.toUpperCase()}" class="list-unstyled contact-list">
		</ul></div>`;
		document.getElementById('contact-of-' + before.toUpperCase()) ? document.getElementById('contact-of-' + before.toUpperCase()).remove():'';
		var lastabcd;

		if (document.getElementById(`contact-sort-${after.toUpperCase()}`) == null) {
		const abcd = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
		abcd.forEach(element => {
			if (document.getElementById(`contact-sort-${element.toUpperCase()}`) != null) {
			if (element < after) {
				lastabcd = element;
			}
			}
		})
		if (lastabcd == undefined || lastabcd == null) {
			document.querySelector('.sort-contact').prepend(el)
		} else {
			var lasttemp = document.getElementById(`contact-of-${lastabcd.toUpperCase()}`);
			lasttemp.parentNode.insertBefore(el, lasttemp.nextSibling);
		}
		}
		document.getElementById(`contact-sort-${after.toUpperCase()}`).innerHTML += temp;
	}
	else{
		var temp = document.getElementById('contacts-id-' + receiverId).outerHTML;
		document.getElementById(`contact-sort-${before.toUpperCase()}`).querySelector(`#contacts-id-${receiverId}`).remove();
		var el = document.createElement("div");
		el.className = 'mt-3';
		el.innerHTML = `<div id="contact-of-${after.toUpperCase()}"><div class="contact-of-${after} contact-list-title">${after.toUpperCase()}</div>
		<ul id="contact-sort-${after.toUpperCase()}" class="list-unstyled contact-list">
		</ul></div>`;
		var lastabcd;
		if (document.getElementById(`contact-sort-${after.toUpperCase()}`) == null) {
			const abcd = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
			abcd.forEach(element => {
			if (document.getElementById(`contact-sort-${element}`) != null) {
				if (element < after) {
				lastabcd = element;
				}
			}
			})
			if (lastabcd == undefined || lastabcd == null) {
			document.querySelector('.sort-contact').prepend(el)
			} else {
			var lasttemp = document.getElementById(`contact-of-${lastabcd.toUpperCase()}`);
			lasttemp.parentNode.insertBefore(el, lasttemp.nextSibling);
			}
		}
		document.getElementById(`contact-sort-${after.toUpperCase()}`).innerHTML += temp;
	}
	}

    document.getElementById("contact_name").classList.toggle("visually-hidden");
    document.getElementById("edit-contact-name").classList.toggle("visually-hidden");
    document.getElementById("contact_name_edit").classList.toggle("visually-hidden");

    if (groupId != null) {
      document.querySelector("#group-id-" + groupId + " a").setAttribute("data-name", name);
      var userName = document.querySelectorAll(".contact_name");
      Array.from(userName).forEach((element, index) => {
        element.innerHTML = name;
      });
      socket.emit("updateGroupName", { groupId, name });
    } else {
      document.querySelector("#contact-id-" + receiverId) ? document.querySelector("#contact-id-" + receiverId).setAttribute("data-name", name):'';
      document.querySelector("#contacts-id-" + receiverId).setAttribute("data-name", name);
      document.getElementById("contacts-id-" + receiverId).querySelector("h5").innerHTML = name.toLowerCase();
      // Edit Name to forward name update
      document.getElementById("forward-contact-" + receiverId).querySelector("h5").innerHTML = name.toLowerCase();
      // Edit Name to Contact Model Name Update
      document.getElementById("contact-" + receiverId).querySelector("label").innerHTML = name.toLowerCase();
      // Contact Message Name Update
      document.getElementById(receiverId).querySelector(".contactNames") ? document.getElementById(receiverId).querySelector(".contactNames").innerHTML = name.toLowerCase():"";

      document.getElementById('contact-id-'+receiverId) ? document.getElementById('contact-id-'+receiverId).querySelector('.contactNames').innerHTML = name:'';
      var userName = document.querySelectorAll(".contact_name");
      Array.from(userName).forEach((element, index) => {
        element.innerHTML = name;
      });
      socket.emit("updateContactName", { userId, receiverId, name });
    }
  }
}

//-------------- Personal User Name Update ---------------//
function edit_userName(message) {
  document.getElementById("user_name").classList.toggle("visually-hidden");
  document.getElementById("user_name_edit").classList.toggle("visually-hidden");
  document.getElementById("edit-user-name").classList.toggle("visually-hidden");
  var contactUser = document.getElementById("user_name").textContent;
  document.getElementById("userName").value = contactUser;
}
// current user name edit
document.getElementById("userName").addEventListener("keydown", function (e) {
  if (this.value.length === 0 && e.which === 32) e.preventDefault();
});
function userNameChange() {
  var name = document.getElementById("userName").value;
  if (name == "") {
    toastr.error(`Name is Rrequires`, "Error");
  } else {
    document.getElementById("user_name").classList.toggle("visually-hidden");
    document.getElementById("edit-user-name").classList.toggle("visually-hidden");
    document.getElementById("user_name_edit").classList.toggle("visually-hidden");
    var userName = document.querySelectorAll(".user_name");
    Array.from(userName).forEach((element, index) => {
      element.innerHTML = name;
    });
    socket.emit("updateUserName", { userId, name });
  }
}

//======================== Current user status Update ======================//
function edit_userStatus(message) {
  document.getElementById("user_status").classList.toggle("visually-hidden");
  document.getElementById("user_status_edit").classList.toggle("visually-hidden");
  document.getElementById("edit-user-status").classList.toggle("visually-hidden");
  var contactUser = document.getElementById("user_status").textContent;
  document.getElementById("userStatus").value = contactUser;
}

// current user status edit
document.getElementById("userStatus").addEventListener("keydown", function (e) {
  if (this.value.length === 0 && e.which === 32) e.preventDefault();
});
function userStatusChange() {
  var status = document.getElementById("userStatus").value;
  if (status == "") {
    toastr.error(`Name is Rrequires`, "Error");
  } else {
    document.getElementById("user_status").classList.toggle("visually-hidden");
    document.getElementById("edit-user-status").classList.toggle("visually-hidden");
    document.getElementById("user_status_edit").classList.toggle("visually-hidden");
    var userName = document.querySelectorAll(".user_status");
    Array.from(userName).forEach((element, index) => {
      element.innerHTML = status;
    });
    socket.emit("updateUserStatus", { userId, status });
  }
}

//============================= Contact Delete =========================================//
function contactDelete(contact_id, receiverId) {

	swal({
		title: `Are you sure you want to Delete this contact member ?`,
		text: "If you delete this, it will be gone forever.",
		icon: "warning",
		buttons: true,
		dangerMode: true,
	  })
	  .then((willDelete) => {
		if (willDelete) {
			var conversation = 'users';
			socket.emit("contact_delete", { contact_id, receiverId, userId });
			socket.emit("all_Message_delete", { conversation,receiverId, userId });
			var contactFirst = document.querySelector("#contacts-id-" + receiverId+ " h5").innerHTML[0];
			const cntctlength = document.getElementById("contact-sort-" + contactFirst) ? document.getElementById("contact-sort-" + contactFirst).getElementsByTagName('li').length:'';
			if (cntctlength == 1) {
				document.getElementById('contact-of-' + contactFirst).remove();
				document.getElementById('contact-sort-' + contactFirst)? document.getElementById('contact-sort-' + contactFirst).remove():'';
			}
			document.getElementById("contacts-id-" + receiverId) ? document.getElementById("contacts-id-" + receiverId).remove():'';
      // Forward Member list delete
      document.getElementById('fcontacts-of-' + contactFirst) ? document.getElementById('fcontacts-of-' + contactFirst).remove():"";
      document.getElementById('fcontacts-sort-' + contactFirst)? document.getElementById('fcontacts-sort-' + contactFirst).remove():'';

			setTimeout(() => {
				delete_user_conversation();
			}, 200);
		}
	  });
}

//============================= Single All Message Delete ==============================//
function deleteAllMessage(message) {
  if (groupId != null) {
	var conversation = 'channel';
    socket.emit("all_Group_Message_delete", { conversation,groupId, userId });
  } else {
	var conversation = 'users';
    socket.emit("all_Message_delete", { conversation, receiverId, userId });
  }
}
// All Contact Message Delete
socket.on("all_Message_delete", function ({ conversation, receiver_Id, user_Id }) {
	if (receiverId == receiver_Id || receiverId == user_Id) {
  		document.getElementById(conversation + "-conversation").innerHTML = "";
	}
  	document.getElementById("contact-id-" + receiverId) ? document.getElementById("contact-id-" + receiverId).remove() : "";
  	document.getElementById("contact-id-" + userId)? document.getElementById("contact-id-" + userId).remove() : "";
});

// Single Message Delete
function singleMessageDelete(message) {
  const message_id = message.id;
  flag = 2;
  if (groupId != null) {
    socket.emit("group_message_delete", { message_id, groupId, flag });
  } else {
    socket.emit("message_delete", { message_id, receiverId, userId, flag });
  }
}
socket.on("message_delete", function ({ message_id, receiverId, userId }) {
  var remove_msg = document.querySelectorAll(".msg_" + message_id);
  Array.from(remove_msg).forEach((element, index) => {
    element.querySelector('.ctext-wrap-content') ? element.querySelector('.ctext-wrap-content').innerHTML = 'Delete Message':"";
    element.querySelector(".dropdown") ? element.querySelector(".dropdown ").style.display = "none":"";
  });
  // Receiver info Media Delete
  var remove_media = document.querySelectorAll(".msg_" + message_id+".message-img");
  Array.from(remove_media).forEach((element, index) => {
    element.remove();
  });

  // Receiver info Attached File Delete
  var remove_media = document.querySelectorAll(".attachedFileList .msg_" + message_id);
  Array.from(remove_media).forEach((element, index) => {
    element.remove();
  });

});

// Close Chat
function CloseChat(){
  document.querySelector('.chat-welcome-section').style.display = "flex";
	document.querySelector('.chat-content div').style.display = "none";
}

//========================= Reply Message ===========================//
function singleMessageReply(message) {
  replayId = document.querySelector(".msg_" + message.id).getAttribute("id");
  var attachedFiles = document.querySelector(".msg_" + message.id+ " .attached-file") ? document.querySelector(".msg_" + message.id+ " .attached-file").classList.contains("attached-file"):'';
  var imageFiles = document.querySelector(".msg_" + message.id+ " .message-img") ? document.querySelector(".msg_" + message.id+ " .message-img").classList.contains("message-img"):'';
  var contactsMsg = document.querySelector(".msg_" + message.id+ " .contacts_msg") ? document.querySelector(".msg_" + message.id+ " .contacts_msg").classList.contains("contacts_msg"):'';

  if(attachedFiles == true){
    copy_text = document.querySelector(".msg_" + message.id + " .attached-file").innerText;
    document.querySelector(".replyMsg .replymessage-block .mb-0").innerHTML = copy_text;
  }
  else if(imageFiles == true){
    copy_text = message.getAttribute("data-image");
    var copy_image = document.querySelector(".msg_" + message.id + " .message-img img").src;
    document.querySelector(".replyMsg .replymessage-block .mb-0").innerHTML =  `<img src="${copy_image}" width="150"/>`;
  }
  else if(message.getAttribute("location")){
    var reply_msgs = message.getAttribute("location");
    copy_text = reply_msgs+"_locations";
    document.querySelector(".replyMsg .replymessage-block .mb-0").innerHTML = `
    <div class="d-flex align-items-center attached-file">
        <div class="flex-shrink-0 avatar-sm me-3 ms-0 attached-file-avatar">
            <div class="avatar-title bg-soft-primary text-primary rounded-circle font-size-20">
                <i class="bx bx-current-location"></i>
            </div>
        </div>
        <div class="flex-grow-1 overflow-hidden">
            <div class="text-start">
                <h5 class="font-size-14 mb-1">Location</h5>
            </div>
        </div>
    </div>`;
  }
  else if(contactsMsg == true){
    var reply_msgs = document.querySelector(".msg_" + message.id+ "").getAttribute("id");
    copy_text = reply_msgs+"_contacts";
    document.querySelector(".replyMsg .replymessage-block .mb-0").innerHTML = `
    <div class="d-flex align-items-center attached-file">
        <div class="flex-shrink-0 avatar-sm me-3 ms-0 attached-file-avatar">
            <div class="avatar-title bg-soft-primary text-primary rounded-circle font-size-20">
                <i class="bx bxs-user-circle"></i>
            </div>
        </div>
        <div class="flex-grow-1 overflow-hidden">
            <div class="text-start">
                <h5 class="font-size-14 mb-1">Contacts</h5>
            </div>
        </div>
    </div>`;

  }
  else if(document.querySelector(".msg_" + message.id + " .ctext-content")){
    copy_text = document.querySelector(".msg_" + message.id + " .ctext-content").innerText;
    document.querySelector(".replyMsg .replymessage-block .mb-0").innerHTML = copy_text;
  }

  if (groupId != null) {
    socket.emit("replyId_Group", { groupId, replayId, userId });
  }
  else {
    socket.emit("reply_Contact", { receiverId, replayId, userId });
  }
  ReplayMsg = copy_text;
}

// Update Message
function singleMessageUpdate(messages){
  flag = 1;
  const message_id = messages.id;
  const updateMsg = messages.closest(".chat-list").querySelector('.ctext-content').innerHTML;
  document.querySelector(".chat-input").value = updateMsg;
  document.querySelector(".message_id").setAttribute("value", message_id);
}
socket.on("message_update",function ({ messageId, message, receiverId, userId, flag }) {
      document.querySelector(".msg_" + messageId + " .ctext-content").innerHTML = message;
      document.querySelector(".msg_" + messageId + " .edit-flag").innerHTML = "(edited)";
  }
);

// group reply id wise contact/user name get
socket.on("replyId_Group", function ({ contact }) {
  document.querySelector(".replyMsg .replymessage-block .conversation-name").innerHTML = rmName = contact.name;
  document.querySelector(".forward_msg .conversation-name").innerHTML = contact.name;
});

// Single Contact reply id wise contact/user name get
socket.on("reply_Contact", function ({ contact }) {
  document.querySelector(".replyMsg .replymessage-block .conversation-name").innerHTML = rmName = contact.name;
  document.querySelector(".forward_msg .conversation-name").innerHTML = contact.name;
});

//======================== Google Chat Map Set ==============================//
function google_map(location,map_id){
  var location = location ? location.split("_"):'';
  if(location){
    var map;
    map = new GMaps({
      div: map_id,
      lat: location[0],
      lng: location[1]
    });
    map.addMarker({
      lat: location[0],
      lng: location[1],
      title: 'Lima',
      details: {
        database_id: 42,
        author: 'HPNeo'
      },
      click: function(e){
        alert('You clicked in this marker');
      }
    });
    uniqueid++;
  }
}

function google_replymap(location,map_id){
  var locations = location ? location.split("_"):'';
  if (locations[2] == "locations") {
    var map;
    map = new GMaps({
      div: map_id,
      lat: locations[0],
      lng: locations[1]
    });
    map.addMarker({
      lat: locations[0],
      lng: locations[1],
      title: 'Lima',
      details: {
        database_id: 42,
        author: 'HPNeo'
      },
      click: function(e){
        alert('You clicked in this marker');
      }
    });
    uid++;
  }
}

//--------------------- Forward Message ----------------------//
// Single forward message copy
function singleMessageForward(message) {
  if(document.querySelector(".msg_" + message.id + " .ctext-content")){
    copy_text = document.querySelector(".msg_" + message.id + " .ctext-content").innerText;
    document.querySelector(".forward_msg .mb-0").innerHTML = copy_text;
  }
  var attachedFiles = document.querySelector(".msg_" + message.id+ " .attached-file") ? document.querySelector(".msg_" + message.id+ " .attached-file").classList.contains("attached-file"):'';
  if(attachedFiles == true){
    copy_text = document.querySelector(".msg_" + message.id + " .attached-file").innerText;
    document.querySelector(".forward_msg .mb-0").innerHTML = copy_text;
  }
  var imageFiles = document.querySelector(".msg_" + message.id+ " .message-img") ? document.querySelector(".msg_" + message.id+ " .message-img").classList.contains("message-img"):'';
  if(imageFiles == true){
    copy_text = document.querySelector(".msg_" + message.id + " .message-img img").alt;
    document.querySelector(".forward_msg .mb-0").innerHTML = copy_text;
  }

  if(message.getAttribute("location")){
    copy_text = message.getAttribute("location")+"_locations";
    document.querySelector(".forward_msg .mb-0").innerHTML = `
    <div class="d-flex align-items-center attached-file">
        <div class="flex-shrink-0 avatar-sm me-3 ms-0 attached-file-avatar">
            <div class="avatar-title bg-soft-primary text-primary rounded-circle font-size-20">
                <i class="bx bx-current-location"></i>
            </div>
        </div>
        <div class="flex-grow-1 overflow-hidden">
            <div class="text-start">
                <h5 class="font-size-14 mb-1">Location</h5>
            </div>
        </div>
    </div>`;
  }

  var contactsMsg = document.querySelector(".msg_" + message.id+ " .contacts_msg") ? document.querySelector(".msg_" + message.id+ " .contacts_msg").classList.contains("contacts_msg"):'';
  if(contactsMsg == true){
    copy_text = message.getAttribute("contact")+"_contacts";
    document.querySelector(".forward_msg .mb-0").innerHTML = `Contacts`;
  }

  replayId = document.querySelector(".msg_" + message.id).getAttribute("id");
  if (groupId != null) {
    socket.emit("replyId_Group", { groupId, replayId, userId });
  }
  else {
    socket.emit("reply_Contact", { receiverId, replayId, userId });
  }
}

// Single Forward Message create
function forwardMsgSend(message) {
  var locationMsg = copy_text ? copy_text.split("_"):'';
  var contactMsgs = copy_text ? copy_text.split("_"):'';
  var imgList = ["jpg", "png"];
  var extName = copy_text.split(".").pop();
  var receiver_id = message.id;
  var sender_id = userId;

  if (imgList.includes(extName)) {
    var has_images = copy_text;
    var has_dropDown = "false";
  }
  else if(locationMsg[2] == "locations"){
    var location = locationMsg[0]+'_'+locationMsg[1];
    var has_dropDown = "true";
  }
  else if(contactMsgs[1] == "contacts"){
    var contacts_id = contactMsgs[0];
    var has_dropDown = "true";
  }
  else{
    var message = copy_text;
    var has_dropDown = "true";
  }
  flag = 3;
  socket.emit("message_forward", { message, has_images, location, contacts_id, sender_id, receiver_id, has_dropDown, userId, userEmail, userName, userLocation, profile, flag });
  document.getElementById("hide_model1").click();
}

// Multiple forward message create
function forwardAllMsgSend(message) {
  var location = copy_text ? copy_text.split("_"):'';
  var contactMsgs = copy_text ? copy_text.split("_"):'';
  var imgList = ["jpg", "png"];
  var extName = copy_text.split(".").pop();
  var contact_lists = ucontacts;
  if (imgList.includes(extName)) {
    contact_lists.forEach((element) => {
      var receiver_id = element;
      var sender_id = userId;
      var has_images = copy_text;
      var has_dropDown = "false";
      socket.emit("message_forward", { has_images, sender_id, receiver_id, has_dropDown, userId, userEmail, userName, userLocation, profile });
    });
  }
  else if(location[2] == "locations"){
    contact_lists.forEach((element) => {
      var receiver_id = element;
      var sender_id = userId;
      var location = copy_text;
      var has_dropDown = "true";
      socket.emit("message_forward", { location, sender_id, receiver_id, has_dropDown, userId, userEmail, userName, userLocation, profile });
    });
  }
  else if(contactMsgs[1] == "contacts"){
    contact_lists.forEach((element) => {
      var receiver_id = element;
      var sender_id = userId;
      var contacts_id = contactMsgs[0];
      var has_dropDown = "true";
      socket.emit("message_forward", { contacts_id, sender_id, receiver_id, has_dropDown, userId, userEmail, userName, userLocation, profile });
    });
  }
  else{
    contact_lists.forEach((element) => {
      var receiver_id = element;
      var sender_id = userId;
      var message = copy_text;
      var has_dropDown = "true";
      socket.emit("message_forward", { message, sender_id, receiver_id, has_dropDown, userId, userEmail, userName, userLocation, profile });
    });
  }
  document.getElementById("hide_model1").click();
}

//================= Copy Messages ======================//
function copyMessage(data) {
  var isText = document.querySelector('.msg_'+data.id+' .ctext-content').innerHTML;
  navigator.clipboard.writeText(isText);
}

// Copy Message box
function copyClipboard() {
  var copyClipboardAlert = document.querySelectorAll(".copy-message");
  copyClipboardAlert.forEach(function (item) {
    item.addEventListener("click", function () {
      document.getElementById("copyClipBoard").style.display = "block";
      setTimeout(hideclipboard, 1000);
      function hideclipboard() {
        document.getElementById("copyClipBoard").style.display = "none";
      }
    });
  });
}

// Search forward Contacts
function searchForwardContactOnModel() {
  input = document.getElementById("searchForwardContact");
  filter = input.value.toUpperCase();
  list = document.querySelector(".forward_contacts");
  li = list.querySelectorAll(".mt-3 li");
  div = list.querySelectorAll(".mt-3 .contact-list-title");

  for (j = 0; j < div.length; j++) {
    var contactTitle = div[j];
    txtValue = contactTitle.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      div[j].style.display = "";
    } else {
      div[j].style.display = "none";
    }
  }

  for (i = 0; i < li.length; i++) {
    contactName = li[i];
    txtValue = contactName.querySelector("h5").innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}

// Message Pagination
setTimeout(() => {
  $("#chat-conversation .simplebar-content-wrapper").on("scroll", function () {
    if ($("#chat-conversation .simplebar-content-wrapper").scrollTop() == 0) {
      if (msgtno > startm) {
        socket.emit("userClick", { receiverId, userId, startm });
        socket.emit("groupClick", { groupId, userId, startm });
        startm += 10;
      }
    }
  });
}, 1000);

/**
 * Single Chat
 */
//--------------------------- Directs Message Contact Lists -------------------------------------------//
socket.on("directLists", ({ directMsg }) => {
  directMsg.forEach((dm) => {
    var directProfile = dm.profile[0] != undefined ? dm.profile[0]:'';
    direcetList(dm.ids, dm.name[0], dm.user_name[0], dm.email[0], dm.location, dm.favourite, directProfile, dm.unread,dm.is_profile);
  });
});

function direcetList(ids,name,user_name,email,location,favourite,profile,unread,is_profile,f = 0) {
  var isUserProfile;
  var fcontactName = name ? name : user_name;
  if (document.getElementById("contact-id-" + ids) == null) {
    if (profile != undefined && profile) {
      isUserProfile = `<img src="${is_profile == 1 ? profile:"assets/images/users/user-dummy-img.jpg"}" class="rounded-circle avatar-xs" alt="">`;
    } else {
      isUserProfile = `<div class="avatar-xs"><span class="avatar-title rounded-circle bg-primary text-white"><span class="username">${fcontactName[0]}</span><span class="user-status"></span></span></div>`;
    }
  }
  const direct_msg = `
  <li id="contact-id-${ids}" data-ids="${ids}" onclick="directClickEvent(this)">
    <a href="javascript: void(0);">
      <div class="d-flex align-items-center">
        <div class="chat-user-img align-self-center me-2 ms-0">
          ${isUserProfile}
            <span class="user-status"></span>
        </div>
        <div class="overflow-hidden">
          <p class="text-truncate mb-0 contactNames">${fcontactName}</p>
          <span class="text-truncate mb-0 contact_favourite">${favourite}</span>
        </div>
        <div class="ms-auto"><span data-msg='${unread}' class="badge badge-soft-dark rounded p-1 unread_msg">${unread != 0 ? unread : ""}</span></div>
      </div>
    </a>
  </li>`;
  if (document.getElementById("contact-id-" + ids) == null) {
    if (f == 0)
      if (favourite == 1)
        document.getElementById("favourite-users").innerHTML += direct_msg;
      else document.getElementById("usersList").innerHTML += direct_msg;
    else document.getElementById("usersList").innerHTML += direct_msg;
  }
  toggleSelected();
}

//====================== Contact Msg Add Contact Click Event ======================//
function contactsMsgClickEvent(data){
  document.getElementById("contact_email").value = data.getAttribute("data-email");
  document.getElementById("c_name").value = data.getAttribute("data-name");
}

//---------------------- Favourite and Direct Click Event Set ---------------------//
function directClickEvent(data) {
  groupId = null;
  startm = 0;
  chatInput.value = "";
  var userChat = "users";
  var directcontactId = receiverId = data.getAttribute("data-ids");
  currentChatId = "users-chat";
  updateSelectedChat(userChat);
  document.getElementById("searchChatMessage").value = "";
  document.querySelector(".typing_msg").innerHTML = '';
  document.querySelector(".user-profile-sidebar .users_status").innerHTML = '';
  document.querySelector(".user-own-img").classList.remove("online");
  document.querySelector("#contact-id-" + receiverId + " .unread_msg").setAttribute("data-msg", "0");
  document.querySelector("#contact-id-" + receiverId + " .unread_msg").innerHTML = "";
  document.querySelector('.common_groups').innerHTML = '';
  socket.emit("userClick", { receiverId, userId, startm });
  socket.emit("userStatus", { id:directcontactId });
  document.querySelector(".receiver-info").style.display = "block";
  setTimeout(() => {
    scrollToBottom("users-chat");
  }, 300);

}

socket.on("userStatus",function ({id, status}) {
  const time = new Date(status);
  var cdates = new Date();
  const datewise = time.getDate() + "-" + (time.getMonth() + 1) + "-" + time.getFullYear();
  const todaydate = cdates.getDate() + "-" + (cdates.getMonth() + 1) + "-" + cdates.getFullYear();
  const yesterdaydate = cdates.getDate() - 1 + "-" + (cdates.getMonth() + 1) + "-" + cdates.getFullYear();
  var ampm = time.getHours() >= 12 ? "pm" : "am";
  var hour = time.getHours() > 12 ? new Date().getHours() % 12 : new Date().getHours();
  var minute = time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes();
  var cratedTime = hour + ":" + minute + " " + ampm;

  if (datewise == todaydate) {
    var lastSeen = "last seen today at "+cratedTime
  } else if (datewise == yesterdaydate) {
    var lastSeen = "last seen yesterday at "+cratedTime;
  } else {
    var lastSeen = "last seen "+datewise+' , '+cratedTime;
  }
  if(status != "Online"){
    status = lastSeen;
  }
  uStatus = status;
});

/**
 * Setting
 */
// user profile img
document.querySelector("#profile-img-file-input").addEventListener("change", function () {
    var preview = document.querySelectorAll(".user-profile-image");
    var file = document.querySelector(".profile-img-file-input").files[0];
    var filename = file.name;
    var extName = filename.split(".").pop();
    var imgList = ["png", "jpg", "jpeg"];
    var reader = new FileReader();

    if (!imgList.includes(extName)) {
      toastr.error(`Invalid Image`, "Error");
    } else {
      reader.addEventListener("load",function () {
          Array.from(preview).forEach((element, index) => {
            element.src = reader.result;
          });
        },
        false
      );
    }

    var is_profile = 1;
    if (file) {
      reader.readAsDataURL(file);
      let formData = new FormData();
      formData.append("file", file);
      formData.append("user_id", userId);
      formData.append("is_profile", is_profile);
      fetch("/profileUpdate", { method: "POST", body: formData });
      profile = filename;
      setimg(profile);
    }
  });

socket.on("profileUpdate", function ({ userid, profile, is_profile }) {
  if (document.getElementById("contact-id-" + userid) != null) {
    setTimeout(() => {
      document.getElementById("contact-id-" + userid).querySelector("a").click();
      document.getElementById("contact-id-" + userid).querySelector(".chat-user-img").innerHTML = `<img src="${is_profile == 1 ? profile:"assets/images/users/user-dummy-img.jpg"}" class="rounded-circle avatar-xs" alt=""><span class="user-status"></span>`;
    }, 200);
  }
});

// Profile Foreground Img
document.querySelector("#profile-foreground-img-file-input").addEventListener("change", function () {
    var preview = document.querySelectorAll(".profile-foreground-img");
    var file = document.querySelector(".profile-foreground-img-file-input").files[0];
    var reader = new FileReader();
    var filename = file.name;
    var extName = filename.split(".").pop();
    var imgList = ["png", "jpg", "jpeg"];
    var reader = new FileReader();
    if (!imgList.includes(extName)) {
      toastr.error(`Invalid Image`, "Error");
    } else {
      reader.addEventListener("load", function () {
          Array.from(preview).forEach((element, index) => {
            element.src = reader.result;
          });
        },
        false
      );
    }

    if (file) {
      reader.readAsDataURL(file);
      let formData = new FormData();
      formData.append("file", file);
      formData.append("user_id", userId);
      fetch("/bgUpdate", { method: "POST", body: formData });
      bg_image = filename;
      setBgImg(bg_image);
    }
  });

//---------------- Theme Color ------------------//
var primaryColor = window.getComputedStyle(document.body, null).getPropertyValue("--bs-primary-rgb");
setTimeout(() => {
  var isActiveColor = themesColor;
  var isActiveImage = themeImage;
  themeColor(primaryColor, isActiveColor, isActiveImage);
}, 400);
//======================================== Theme Color selected ================================//
function themeColor(primaryColor, isActiveColor, isActiveImage) {
  	window.localStorage.setItem("color", isActiveColor);
  	document.querySelectorAll(".theme-img , .theme-color").forEach(function (item) {
      if (item.id == isActiveColor) {
        item.checked = true;
      }

      if (item.id == isActiveImage) {
        item.checked = true;
      }

      var colorRadioElements = document.querySelector(
        "input[name=bgcolor-radio]:checked"
      );

      if (colorRadioElements) {
        colorRadioElements = colorRadioElements.id;
        var elementsColor = document.getElementsByClassName(colorRadioElements);
        var color = window.getComputedStyle(elementsColor[0], null).getPropertyValue("background-color");
        var userChatOverlay = document.querySelector(".user-chat-overlay");
        if (colorRadioElements == "bgcolor-radio8") {
          color = "#4eac6d";
          userChatOverlay.style.background = null;
        } else {
          userChatOverlay.style.background = color;
        }
        rgbColor = color.substring(color.indexOf("(") + 1, color.indexOf(")"));
        document.documentElement.style.setProperty("--bs-primary-rgb", rgbColor);
      }

      var imageRadioElements = document.querySelector("input[name=bgimg-radio]:checked");
      if (imageRadioElements) {
        imageRadioElements = imageRadioElements.id;
        window.localStorage.setItem("image", imageRadioElements);
        var elementsImage = document.getElementsByClassName(imageRadioElements);
        if (elementsColor) {
          var image = window.getComputedStyle(elementsImage[0], null).getPropertyValue("background-image");
          var userChat = document.querySelector(".user-chat");
          userChat.style.backgroundImage = image;
        }
      }
      item.addEventListener("click", function (event) {
        if (item.id == isActiveColor) {
          item.checked = true;
        }
        if (item.id == isActiveImage) {
          item.checked = true;
        }

        // choose theme color
        var colorRadioElements = document.querySelector("input[name=bgcolor-radio]:checked");
        if (colorRadioElements) {
          colorRadioElements = colorRadioElements.id;
          var elementsColor = document.getElementsByClassName(colorRadioElements);
          if (elementsColor) {
            var color = window.getComputedStyle(elementsColor[0], null).getPropertyValue("background-color");
            var userChatOverlay = document.querySelector(".user-chat-overlay");
            if (colorRadioElements == "bgcolor-radio8") {
              color = "#4eac6d";
              userChatOverlay.style.background = null;
            } else {
              userChatOverlay.style.background = color;
            }

            rgbColor = color.substring(
              color.indexOf("(") + 1,
              color.indexOf(")")
            );
            document.documentElement.style.setProperty("--bs-primary-rgb", rgbColor);
            window.localStorage.setItem("color", colorRadioElements);
            socket.emit("add_theme_color", {user_id: userId,theme_color: colorRadioElements});
          }
        }

        // choose theme image
        var imageRadioElements = document.querySelector("input[name=bgimg-radio]:checked");
        if (imageRadioElements) {
          imageRadioElements = imageRadioElements.id;
          window.localStorage.setItem("image", imageRadioElements);
          var elementsImage = document.getElementsByClassName(imageRadioElements);
          if (elementsColor) {
            var image = window.getComputedStyle(elementsImage[0], null).getPropertyValue("background-image");
            var userChat = document.querySelector(".user-chat");
            userChat.style.backgroundImage = image;
          }
        }
        socket.emit("add_theme_image", {user_id: userId,theme_image: imageRadioElements});
      });
	});
}


//------------------------- Security sec -----------------------------//
//======================= notification security on/off set ==================================//
function notification_switch(src) {
  var checkbox = document.getElementById("security-notificationswitch");
  var notification = checkbox.checked == true ? 1 : 0;
  socket.emit("userNotification", {user_id: userId,notification: notification});
}

//========================== Last Seen security on/off set ===============================//
function lastseen_switch(src) {
  var checkbox = document.getElementById("privacy-lastseenSwitch");
  var lastseen = checkbox.checked == true ? 1 : 0;
  socket.emit("userLastSeen", {user_id: userId,lastseen: lastseen});
}

//========================== User Profile photo hide/show =========================//
function profile_droupdown(data){
  var is_profile = document.getElementById("profile_id").value;
  socket.emit("userisprofile", {userid:userId, is_profile, profile});
}

//========================== User Status Hide/Show ==========================//
function status_droupdown(data){
  var is_status = document.getElementById("select_id").value;
  socket.emit("userisstatus", {id: userId,is_status: is_status});
}

//============================= notification muted security on/off set ==========================================//
function notification_muted_switch(src) {
  var checkbox = document.getElementById("notification_muted_switch");
  var is_muted = checkbox.checked == true ? 1 : 0;
  socket.emit("userMutedNotification", { user_id: userId, is_muted: is_muted });
}

/**
 * Group Section
 */
const groupsList = document.querySelector(".channelList");

// Error Handling
socket.on("errorHandling", (err) => {
  var errors = err.errors;
  Object.entries(errors).forEach(([key, value]) => {
    var text = `
		<div class="alert alert-danger alert-dismissible fade show" role="alert">${value.message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;
    document.querySelector(".error_message").innerHTML += text;
  });
});

//---------------------------- Group List Append -------------------------------------//
//---------------------------- group member list wise group append ------------------------//
socket.on("group-append", ({ group_id, name }) => {
  groupListAppend(group_id, name);
});

//---------------------------- Member add remove wise group append ------------------------//
socket.on("addGroup", ({ group }) => {
  groupListAppend(group._id, group.name);
});

//====================== Group Append Function ===========================//
function groupListAppend(id, name) {
  document.getElementById("channelList").innerHTML += `<li id="group-id-${id}" data-name="channel">
      <a href="javascript: void(0);" data-id='${id}' onclick="groupClickEvent(this)">
        <div class="d-flex align-items-center">
          <div class="flex-shrink-0 avatar-xs me-2">
              <span class="avatar-title rounded-circle bg-soft-light text-dark">#</span>
          </div>
          <div class="flex-grow-1 overflow-hidden">
              <p class="text-truncate mb-0">${name}</p>
          </div>
          <div class="ms-auto"><span data-msg='0' class="badge badge-soft-dark rounded p-1 unread_msg"></span></div>
        </div>
      </a>
    </li>`;
  toggleSelected();
}

//---------------------------- Onload Group List Get ----------------------------------//
socket.emit("groupsData", userId);
socket.on("groupLists", ({ groups }) => {
  groups.forEach((group) => {
    document.getElementById("channelList").innerHTML += `<li id="group-id-${ group.group_id[0]}" data-name="channel">
        <a href="javascript:void(0);" data-id='${group.group_id[0]}' onclick="groupClickEvent(this)">
          <div class="d-flex align-items-center">
            <div class="flex-shrink-0 avatar-xs me-2">
                <span class="avatar-title rounded-circle bg-soft-light text-dark">#</span>
            </div>
            <div class="flex-grow-1 overflow-hidden">
                <p class="text-truncate mb-0">${group.name}</p>
            </div>
            <div class="ms-auto"><span data-msg='${group.unread}' class="badge badge-soft-dark rounded p-1 unread_msg">${group.unread != 0 ? group.unread : ""}</span></div>
          </div>
        </a>
      </li>`;
  });
  toggleSelected();
});

//=========================== Group Click Event Set =============================//
function groupClickEvent(data) {
  currentChatId = "channel-chat";
  var groupChat = "channel";
  updateSelectedChat(groupChat);
  chatInput.value = "";
  document.getElementById("searchChatMessage").value = "";
  receiverId = null;
  startm = 0;
  groupId = data.getAttribute("data-id");
  socket.emit("groupClick", { groupId, userId, startm });
  document.querySelector("#contact_name_edit").style.display = "block";
  document.querySelector(".receiver-info").style.display = "none";
  setTimeout(() => {
    scrollToBottom("channel-chat");
  }, 300);
}

//------------------------------- Group Click wise group info get -------------------------//
socket.on("groupClickEvent", ({ group }) => {
	if(group != null){
		groupId = group._id;
		var channelName = group.name;
		var changeChannelName = document.getElementById("channel-chat");
		changeChannelName.querySelector(".text-truncate .user-profile-show").innerHTML = channelName;
		document.querySelector(".user-profile-desc .text-truncate").innerHTML = channelName;
		document.querySelector(".audiocallModal .text-truncate").innerHTML = channelName;
		document.querySelector(".videocallModal .text-truncate").innerHTML = channelName;
		document.querySelector(".user-profile-sidebar .user-name").innerHTML = channelName;
		document.querySelector(".user-own-img .avatar-sm").setAttribute("src", dummyImage);
		document.querySelector(".user-profile-sidebar .profile-img").setAttribute("src", dummyImage);
		document.querySelector("#group-id-" + groupId + " .unread_msg").setAttribute("data-msg", "0");
		document.querySelector("#group-id-" + groupId + " .unread_msg").innerHTML = "";
		document.querySelector(".receiverInfo").style.display = "none";
		document.querySelector(".exit_group").style.display = "block";
		document.querySelector(".group_member_sec").style.display = "block";
		document.querySelector(".common_group_sec").style.display = "none";
		document.querySelector(".group_member_list").innerHTML = "";
		document.querySelector(".groups_member").innerHTML = "";
	}
	document.querySelector('.chat-welcome-section').style.display = "none";
	document.querySelector('.chat-content div').style.display = "block";
});

//-------------------------- Group Member List Append and Get ----------------------------//
socket.on("groupDetail", ({ groupMember, groupId }) => {
  memberCount = groupMember.length;
  document.querySelector(".g_member_count").innerHTML = `${groupMember.length} Members`;
  document.querySelector(".group_member_list").innerHTML = "";
  var iconRemove = "";
  var current_admin = 0;
  // Delete Btn Set in receiver Info
  groupMember.forEach((contact) => {
    if (contact.is_admin == 1 && contact.user_id == userId) {
      current_admin = 1;
      document.querySelector(".member_add li").classList.remove("d-none");
      setTimeout(function () {
        document.querySelector(".exit_group").innerHTML = "";
        let exit_btn = `<div class="dropdown-divider"></div><a class="text-danger" onclick="deleteGroup('${contact.group_id}')" href="javascript:void(0);">Delete Group<i class="ri-delete-bin-line float-end text-danger"></i></a>`;
        document.querySelector(".exit_group").innerHTML += exit_btn;
      }, 800);
    }
  });

  // Exit Btn set in receiver info
  if (current_admin == 0) {
    document.querySelector(".member_add li").classList.add("d-none");
    setTimeout(function () {document.querySelector(".exit_group") ? (document.querySelector(".exit_group").innerHTML = "") : "";
      let exit_btn = `<div class="dropdown-divider"></div><a class="text-danger" id="${userId}" onclick="exitGroup(this.id)" href="javascript:void(0);">Exit Group<i class="ri-delete-bin-line float-end text-danger"></i></a>`;
      document.querySelector(".exit_group") ? (document.querySelector(".exit_group").innerHTML += exit_btn) : "";
    }, 800);
  }

  // Group Member List Get
  groupMember.forEach((member) => {
    gmember = groupMember;
    var conar = [];
    var admbr = [];
    mcontact_list.forEach((mc) => {
      conar.push(mc.user_id);
    });
    groupMember.forEach((gc) => {
      admbr.push(gc.user_id);
    });
    addmbr = conar.filter((item) => !admbr.includes(item));
    document.querySelector(".groups_member").innerHTML = "";
    addmbr.forEach((member) => {
      var cnam;
      mcontact_list.forEach((mc) => {
        if (member == mc.user_id) {
          cnam = mc.name;
        }
      });

      const contactList = `
      <li>
        <div class="form-check">
        <input type="checkbox" class="form-check-input" id="add_contact_${member}" name="group_member" value="${member}">
        <label class="form-check-label" for="add_contact_${member}">${cnam}</label>
        </div>
      </li>`;
      document.querySelector(".groups_member").innerHTML += contactList;
    });

    // Group member list receiver Info
    var group_admin = member.is_admin == 1 ? `Group Admin` : ``;
    var contactName = member.contactName != '' ? member.contactName:member.name;
    if (member.is_admin == 1 && current_admin != 0) {
      iconRemove = "";
    }
    if (member.is_admin != 1 && current_admin != 0) {
      var remove_icon = `<i class="ri-close-line text-danger"  id="${member.user_id}" onclick="deleteGroupMember(this)"></i>`;
      iconRemove = remove_icon;
    }

    const online_users = `
		<li id="contact_list_${member.user_id}">
			<a href="javascript: void(0);">
				<div class="d-flex align-items-center">
					<div class="flex-shrink-0 avatar-xs me-2">
						<span class="avatar-title rounded-circle bg-soft-light text-dark">#</span>
					</div>
					<div class="flex-grow-1 overflow-hidden">
						<p class="text-truncate mb-0">${contactName}</p>
					</div>
					${iconRemove}<span class="bg-success text-white badge">${group_admin}</span>
				</div>
			</a>
		</li>`;
    document.querySelector(".group_member_list").innerHTML += online_users;
    if (document.getElementById("add_contact_" + member.user_id) != null) {
      document.getElementById("add_contact_" + member.user_id).checked = true ? "checked" : "";
    }
  });
});

//--------------- Group Message get -------------------------//
document.getElementById("copyClipGroupBoard").style.display = "none";
socket.on("groupMessage", ({ contactMsgs, msgno }) => {
  msgtno = msgno;
  currentSelectedChat = 'channel';
  document.getElementById(currentSelectedChat + "-conversation").innerHTML = "";
  document.querySelector(".attachedFileList").innerHTML = "";
  document.querySelector(".media_list").innerHTML = "";
  MessageGet(contactMsgs);
  copyClipGroupboard();
  copyChannelMessage();
  startm = 10;
});

socket.on("groupchat-pg", ({ contactMsgs }) => {
  scrolli = $(".messages__history").height();
  MessageGet(contactMsgs);
});

//--------------------------- Group Message Append -------------------------------//
var messageIds = 0;
socket.on("group_res_msg_get",function ({ flag, id, message,sender_id, group_id, has_dropDown, has_files, has_images, has_audio, createdAt, is_replay, replay_id, location, profile, userName, contacts_id, contact_name, contact_profile, contact_email }) {
	var receiverName;
	var cnt=[];
	var cntf=0;
	mcontact_list.forEach((mc) => {
		if(mc.user_id==sender_id){
		cnt.push(mc.name);
		cntf++;
		}
	})
	if(cntf>0)
  receiverName = cnt[0];
	else
  receiverName = sender_id != userId ? userName : "";

  var replyName;
	var cnt=[];
	var cntf=0;
	mcontact_list.forEach((mc) => {
		if(mc.user_id==replay_id){
		cnt.push(mc.name);
		cntf++;
		}
	})
	if(cntf>0)
  replyName = cnt[0];
	else
  replyName = sender_id != userId ? userName : "";

    messageIds++;
    var contacts_profile = contact_profile != undefined ? contact_profile:dummyContactImage;
    if (groupId != group_id) {
      var unread_msg = parseInt(document.querySelector("#group-id-" + group_id + " .unread_msg").getAttribute("data-msg")) + 1;
      document.querySelector("#group-id-" + group_id + " .unread_msg").setAttribute("data-msg", unread_msg);
      document.querySelector("#group-id-" + group_id + " .unread_msg").innerHTML = unread_msg;
    } else {
      var unread = 0;
      socket.emit("unreadGroupMsgUpdate", { groupId, userId, unread });
      appendMsg(flag,id,message,sender_id,group_id,has_dropDown,has_files,has_images,has_audio,createdAt,is_replay,replay_id, location,contacts_id, contact_name, contacts_profile, contact_email, profile,replyName,receiverName);
    }
  }
);

//-------------------------- Group Message Delete ----------------------//
socket.on("group_message_delete", function ({ message_id, groupId }) {
  var remove_msg = document.querySelectorAll(".msg_" + message_id);
  Array.from(remove_msg).forEach((element, index) => {
    element.querySelector('.ctext-wrap-content') ? element.querySelector('.ctext-wrap-content').innerHTML = 'Delete Message':"";
    element.querySelector(".dropdown") ? element.querySelector(".dropdown ").style.display = "none":"";
  });
  // Receiver info Media Delete
  var remove_media = document.querySelectorAll(".msg_" + message_id+".message-img");
  Array.from(remove_media).forEach((element, index) => {
    element.remove();
  });

  // Receiver info Attached File Delete
  var remove_media = document.querySelectorAll(".attachedFileList .msg_" + message_id);
  Array.from(remove_media).forEach((element, index) => {
    element.remove();
  });

});

//-------------------------- All Group Message Delete --------------------------//
socket.on("all_Group_Message_delete", function ({ conversation, group_Id, userId }) {
	if (groupId == group_Id) {
  		document.getElementById(conversation + "-conversation").innerHTML = "";
	}
});

//--------------------------- Group Name Update ----------------------//
socket.on("updateGroupName", function ({ groupId, name }) {
  document.getElementById("group-id-" + groupId).querySelector("p").innerHTML = name;
  document.querySelector("#group-id-" + groupId + " a").setAttribute("data-name", name);
  var groupName = document.querySelectorAll(".group_name");
  Array.from(groupName).forEach((element, index) => {
    element.innerHTML = name;
  });
});

//======================== Group Message Search ====================//
function searchGroupMsg() {
  input = document.getElementById("searchGroupMessage");
  filter = input.value;
  socket.emit("groupMessageSearch", { filter, groupId });
}

//======================= Delete Group all member =======================//
function deleteGroupMember(data) {
  var id = data.id;
  socket.emit("deleteGroupUser", { id, groupId });
  var contact_name = document.querySelector(
    "#contact_list_" + id + " p"
  ).innerHTML;
  const contactList = `
    <li>
      <div class="form-check">
        <input type="checkbox" class="form-check-input" id="add_contact_${id}" name="group_member" value="${id}">
        <label class="form-check-label" for="add_contact_${id}">${contact_name}</label>
      </div>
    </li>`;
  document.querySelector(".groups_member").innerHTML += contactList;
  document.querySelector(".g_member_count").innerHTML = `${memberCount - 1} Members`;
  memberCount = memberCount - 1;
}

socket.on("deleteGroupUser", function ({ id, groupId }) {
  if (id == userId) {
    document.getElementById("group-id-" + groupId) ? document.getElementById("group-id-" + groupId).remove():"";
    document.querySelector('.chat-welcome-section').style.display = "flex";
    document.querySelector('.chat-content div').style.display = "none";
  } else {
    var remove_group_msg = document.querySelectorAll("#contact_list_" + id);
    Array.from(remove_group_msg).forEach((element, index) => {
      element.remove();
    });
  }
});

//====================== Exit Group member ===================//
function exitGroup(id) {
  swal({
    title: `Are you sure you want to Exit this group?`,
    text: "If you delete this, it will be gone forever.",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  })
  .then((willDelete) => {
    if (willDelete) {
		socket.emit("group_exit_member", { id, groupId });
		document.getElementById("group-id-" + groupId).remove();
    }
  });
}

socket.on("group_exit_member", function ({ id, group_id }) {
  var remove_group_msg = document.querySelectorAll("#contact_list_" + id);
  Array.from(remove_group_msg).forEach((element, index) => {
    element.remove();
  });
});

//=================================== Delete Group ===========================//
// Delete Group
function deleteGroup(id) {
  swal({
    title: `Are you sure you want to delete this group?`,
    text: "If you delete this, it will be gone forever.",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  })
  .then((willDelete) => {
    if (willDelete) {
      socket.emit("group_delete", { id });
    }
  });
}

socket.on("group_delete", function ({ id }) {
	document.getElementById("group-id-" + id) ? document.getElementById("group-id-" + id).remove() : "";
  document.querySelector('.chat-welcome-section').style.display = "flex";
  document.querySelector('.chat-content div').style.display = "none";
  document.querySelector(".user-profile-sidebar").classList.remove('d-block')
	if (groupId == id) {
  	document.getElementById("channel-conversation").innerHTML = "";
  	delete_user_conversation();
	}
});

//===================== Group Search ======================//
// Search User
function searchUser() {
  input = document.getElementById("serachChatUser");
  filter = input.value.toUpperCase();
  ul = document.querySelector(".chat-room-list");
  li = ul.getElementsByTagName("li");
  for (i = 0; i < li.length; i++) {
    var item = li[i];
    var searchList = item.querySelector('p') != null ? item.querySelector('p') :'';
    var txtValue = searchList.innerText != undefined ? searchList.innerText :'';
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}

//Common Function
//------------------------- Group Message Copy Function ------------------//
var channelItemList = document.querySelector("#channel-conversation");
function copyChannelMessage() {
  var copyChannelMessage = channelItemList.querySelectorAll(".copy-message");
  copyChannelMessage.forEach(function (item) {
    item.addEventListener("click", function () {
      var isText = item.closest(".ctext-wrap").children[0] ? item.closest(".ctext-wrap").children[0].children[0].innerText : "";
      navigator.clipboard.writeText(isText);
    });
  });
}

// Copy Message box
function copyClipGroupboard() {
  var copyClipboardAlert = document.querySelectorAll(".copy-message");
  copyClipboardAlert.forEach(function (item) {
    item.addEventListener("click", function () {
      document.getElementById("copyClipGroupBoard").style.display = "block";
      setTimeout(hideclipboard, 1000);
      function hideclipboard() {
        document.getElementById("copyClipGroupBoard").style.display = "none";
      }
    });
  });
}

//------------------------- Contact Typing set ------------------//
if (chatInput) {
  chatInput.addEventListener("keyup", function (e) {
    if (groupId != null) {
      socket.emit("group_typing", {
        isTyping: chatInput.value.length > 0,
        name: userName,
        Image: profile,
        groupId: groupId,
        senderId: userId,
      });
    } else {
      socket.emit("typing", {
        isTyping: chatInput.value.length > 0,
        name: userName,
        Image: profile,
        receiverId: receiverId,
        senderId: userId,
      });
    }
  });
}

// Single Typing
socket.on("typing", function (data) {
  ChatTyping(".typing_msg");
});

// group Typing
socket.on("group_typing", function (data) {
  ChatTyping(".group_typing_msg",data.name);
});

function ChatTyping(typing_class,user_name) {
  let chat_div = document.createElement("small");
  chat_div.classList.add("callback");
  chat_div.classList.add("text-success");
  let chat_content = `${user_name != undefined ? user_name : ''} Typing
                    <span class="animate-typing">
                        <span class="dot"></span>
                        <span class="dot"></span>
                        <span class="dot"></span>
                    </span>
                   `;
  chat_div.innerHTML = chat_content;

  const ty = document.querySelectorAll(typing_class);
  Array.from(ty).forEach((element, index) => {
    element.appendChild(chat_div);
    document.querySelector('.g_member_count') ? document.querySelector('.g_member_count').style.display = 'none':'';
  });

  setTimeout(function () {
    if (document.querySelector(".callback") != null) {
      var typing_remove = document.querySelectorAll(".callback");
      Array.from(typing_remove).forEach((element, index) => {
        element.remove();
    	  document.querySelector('.g_member_count') ? document.querySelector('.g_member_count').style.display = 'block':'';
      });
    }
  }, 1500);
}

//================ Camera image upload ==================//
async function startCamera() {
  document.querySelector(".file_Upload ").classList.add("show");
  var preview = document.querySelectorAll(".file_Upload");
  Array.from(preview).forEach((gallery, index) => {
    gallery.innerHTML = `
    <div class="card p-2 border attchedfile_pre d-inline-block position-relative">
      <div class="d-flex align-items-center">
        <div class="flex-grow-1 overflow-hidden">
          <canvas id="canvas" style="display: none;" ></canvas>
          <video id="view_video" autoplay style=" width:350px"></video>
          <button id="click-photo" style="display:none;"><i class="bx bxs-camera"></i></button>
        </div>
        <div class="flex-shrink-0 align-self-start ms-3">
            <div class="d-flex gap-2">
              <div>
                <i class="ri-close-line text-muted attechedFile-remove"  id="remove-attechedFile" onclick="deleteImage(this)"></i>
              </div>
            </div>
        </div>
      </div>
    </div>`;
  });

  let video = document.querySelector("#view_video");
  let click_button = document.querySelector("#click-photo");
  let canvas = document.querySelector("#canvas");
  video.style.display = 'block';
  click_button.style.display = 'block';

  navigator.getUserMedia({
    video: true, audio: false
  }, (stream) => {
    video.srcObject = stream;

    click_button.addEventListener('click', function () {
      var preview = document.querySelector(".file_Upload");
      video.style.display = 'none';
      click_button.style.display = 'none';
      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
      let image_data_url = canvas.toDataURL('image/png');
      var image = `<img src='${image_data_url}' class='profile-user'>`;
      preview.innerHTML = `
      <div class="card p-2 border attchedfile_pre d-inline-block position-relative">
        <div class="d-flex align-items-center">
            <div class="flex-grow-1 overflow-hidden">
              <h5 class="font-size-14 text-truncate mb-1">${image}</h5>
            </div>
            <div class="flex-shrink-0 align-self-start ms-3">
                <div class="d-flex gap-2">
                  <div>
                    <i class="ri-close-line text-muted attechedFile-remove"  id="remove-attechedFile" onclick="deleteImage(this)"></i>
                  </div>
                </div>
            </div>
        </div>
      </div>`
      urltoFile(image_data_url, Math.floor(Math.random() * (99999 - 1234)) + 1000, 'png')
        .then(function (filed) {
          webcam = filed;
        })
      video.srcObject.getVideoTracks().forEach(track => track.stop());
    });

  }, (error) => {
    toastr.error('Device not found', 'Error');
    document.getElementById('remove-attechedFile').click();
  })

 }

function urltoFile(url, filename, mimeType) {
  mimeType = mimeType || (url.match(/^data:([^;]+);/) || '')[1];
  return (fetch(url)
    .then(function (res) { return res.arrayBuffer(); })
    .then(function (buf) { return new File([buf], `${filename}.png`, { type: mimeType }); })
  );
}

//================ Current Location upload ==================//
async function currentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
  var location = `${position.coords.latitude}_${position.coords.longitude}`;
  if (groupId != null) {
    socket.emit("group_msg", {
      sender_id: userId,
      group_id: groupId,
      userId: userId,
      userEmail: userEmail,
      userName: userName,
      userLocation: userLocation,
      profile: profile,
      location: location,
    });
  }
  else{
    socket.emit("send_msg", {
      sender_id: userId,
      receiver_id: receiverId,
      userId: userId,
      userEmail: userEmail,
      userName: userName,
      userLocation: userLocation,
      profile: profile,
      location: location,
    });
  }

}

//================= Audio Call ====================//
//------------------------- Single Audio Call --------------------//
var callerring = new Audio('assets/notification/call-ring.mp3');
var audioring = new Audio('assets/notification/callertune.mp3');
var busyring = new Audio('assets/notification/busy.mp3');

const btnStartElement = document.querySelector('[data-action="start"]');
const btnStopElement = document.querySelector('[data-action="stop"]');
const btnResetElement = document.querySelector('[data-action="reset"]');
const minutes = document.querySelector('.minutes');
const seconds = document.querySelector('.seconds');
let timerTime = 0;
let interval;
let callTimer = 0;

const start = () => {
  isRunning = true;
  interval = setInterval(incrementTimer, 1000)
}

const stoptime = () => {
  isRunning = false;
  clearInterval(interval);
}

const pad = (number) => {
  return (number < 10) ? '0' + number : number;
}

const incrementTimer = () => {
  timerTime++;
  const numberMinutes = Math.floor(timerTime / 60);
  const numberSeconds = timerTime % 60;
  minutes.innerText = pad(numberMinutes);
  seconds.innerText = pad(numberSeconds);
  callTimer = Math.floor(timerTime / 60) + ":" + timerTime % 60;
}

let is_active = false;
let vausername
let localStream
let peerConn
let isAudio = true
let isVideo = true
let isscreen = true
let cutingphone
document.querySelector('.openincomingclass').setAttribute("id", `openincoming`);
document.getElementById('closeincomingmodel').addEventListener('click', () => {
  var receiver_Id = document.getElementById(`icvid`).innerHTML;
  callerring.pause();
  callerring.currentTime = 0;
  busyring.play();
  socket.emit("cutanswerd", { sender_id:receiver_Id, receiver_id:userId, type:avType, is_type:1 });
})

document.getElementById('callaudiomodel').addEventListener('click', () => {
    document.getElementById(`audiotext`).style.display = 'block';
    sendUsername('audio');
    startCall('audio');
    timerTime = 0;
    minutes.innerText = "";
    seconds.innerText = "";
})

//----------------- Reciver call cut -----------------//
document.getElementById('cutcall').addEventListener('click', () => {
  stoptime();
  var clid = document.getElementById(`icvid`).innerHTML;
  socket.emit("cutanswerd", { sender_id:clid, receiver_id:userId, type:avType,time:callTimer });
  timerTime = 0;
  endvcall();
})

//=========== Send User Name ===================//
function sendUsername(ctype) {
  avType = ctype;
  vausername = document.getElementById("icvid").innerHTML + '_' + userId;
  socket.emit('ringcall', receiverId, userId, userName, profile, ctype)
  sendData({
    type: "store_user"
  })
}
//------------ Receiver calling data get ------------------//
socket.on("ringcalling", (receiverId, userId, name, image, ctype) => {
  if (!is_active) {
    cutingphone = false
    avType = ctype;
    var user_id = document.querySelectorAll("#icvid");
    Array.from(user_id).forEach((element, index) => {
      element.innerHTML = userId;
    });
    var username = document.querySelectorAll(".sender_name");
    Array.from(username).forEach((element, index) => {
      element.innerHTML = name;
    });
    var userProfile = document.querySelectorAll(".sender_profile");
    Array.from(userProfile).forEach((element, index) => {
      element.src = `${image}`;
    });

    document.getElementById(`callicon`).innerHTML = ' <i class="ri-vidicon-fill"></i>';
    if (ctype == 'audio') {
        document.getElementById(`callicon`).innerHTML = ' <i class="ri-phone-fill"></i>';
    }
    setTimeout(function () {
      if (!cutingphone) {
        callerring.play();
        document.getElementById(`openincoming`).click();
      }
    }, 2500);
  } else {
    socket.emit('isbusy', userId);
  }
})

//================= Start Call Function ==============//
function startCall(ctype) {
  isactive = true;
  audioring.play();
  if (ctype == 'audio') {
    ctype = false
  } else {
    ctype = {
      frameRate: 24,
      width: {
        min: 480,
        ideal: 720,
        max: 1280
      },
      aspectRatio: 1.33333
    };
    document.getElementById("video-call-div").style.display = "inline";
  }

  navigator.getUserMedia({
    video: ctype,
    audio: true
  }, (stream) => {
    localStream = stream
    let configuration;
    if (ctype != false) {
      document.getElementById("local-video").srcObject = localStream;
      configuration = {
        iceServers: [{
          "urls": ["stun:stun.l.google.com:19302",
            "stun:stun1.l.google.com:19302",
            "stun:stun2.l.google.com:19302"
          ]
        }]
      }
    }
    peerConn = new RTCPeerConnection(configuration)
    peerConn.addStream(localStream)

    peerConn.onaddstream = (e) => {
      document.getElementById("remote-video")
        .srcObject = e.stream
    }

    peerConn.onicecandidate = ((e) => {
      if (e.candidate == null)
        return
      sendData({
        type: "store_candidate",
        candidate: e.candidate
      })
    })

    createAndSendOffer()
  }, (error) => {
    toastr.error('Device not found', 'Error');
    document.getElementById(`cutincomingmodel`).click();
    cutphones();
    setTimeout(function () {
      document.getElementById(`closevcmodel`).click();
      document.getElementById(`closeaudiomodel`).click();
    }, 1500)
  })

}

//================== Create And Send Offer Function ==============================//
function createAndSendOffer() {
  peerConn.createOffer((offer) => {
    sendData({
      type: "store_offer",
      offer: offer
    })
    peerConn.setLocalDescription(offer)
  }, (error) => {
    console.log(error)
  })
}

//================ Cut Call ==================//
function cutphones() {
    socket.emit('cutphone', receiverId);
    audioring.pause();
    audioring.currentTime = 0;
    setTimeout(() => {
      // endvcall();
    }, 2000);
}
//------------- Cut Audio receiver ring -------------------//
socket.on('cutphoness', () => {
  	cutingphone = true;
   	document.getElementById(`cutincomingmodel`).click();
  	callerring.pause();
  	callerring.currentTime = 0;
})

function endvcall() {
	is_active = false;
	audioring.pause();
	audioring.currentTime = 0;
	document.getElementById(`closevideomodel`).click();
	if (localStream.getTracks != undefined) {
		localStream.getTracks().forEach(function (track) {
			if (track.readyState == 'live') {
				track.stop();
			}
		});
	}
	if (peerConn.close !== undefined) peerConn.close();
}

//--------------------- Receiver Call Cancel --------------------//
socket.on('cutpeeranswer', () => {
  stoptime();
  document.getElementById(`audiotext`).innerHTML = "The person is busy...";
  audioring.pause();
  audioring.currentTime = 0;

  endvcall();
  setTimeout(function () {
    busyring.pause();
    busyring.currentTime = 0;
    document.getElementById(`closeaudiomodel`).click();
  }, 3500)
});

//--------------------- Busy personal --------------------------//
socket.on('itbusy', () => {
  document.getElementById(`audiotext`).innerHTML = "The person is busy";
  audioring.pause();
  audioring.currentTime = 0;
  busyring.play();
  endvcall();
  setTimeout(function () {
    busyring.pause();
    busyring.currentTime = 0;
    document.getElementById(`closeaudiomodel`).click();
  }, 3500)
});

//--------------------- Receiver call attend -----------------//
document.getElementById('receivevcall').addEventListener('click', () => {
  start();
  callerring.pause();
  callerring.currentTime = 0;
  var receiver_id = document.getElementById(`icvid`).innerHTML;
  socket.emit('answerd', receiver_id, avType);
  if (avType == 'video') {
    document.getElementById("video-call-div").style.display = "block";
    document.getElementById("audio-call-div").style.display = "none";
  } else {
    document.getElementById("video-call-div").style.display = "none";
    document.getElementById("audio-call-div").style.display = "block";
  }
  document.getElementById(`opencallvideomodel`).click();
  joinCall(avType, userId, receiver_id);
})

//----------------------- Call Receive ------------------------//
socket.on('answered', (receiver_id, ctype) => {
  start();
  if (ctype == 'video') {
    document.getElementById("video-call-div").style.display = "block";
    document.getElementById("audio-call-div").style.display = "none";
  } else {
    document.getElementById("video-call-div").style.display = "none";
    document.getElementById("audio-call-div").style.display = "block";
  }
  audioring.pause();
  audioring.currentTime = 0;
  document.getElementById(`opencallvideomodel`).click();
  document.getElementById(`closeaudiomodel`).click();

})

//======================= Join Call Function ================//
function joinCall(jctype, userId, rspid) {
  is_active = true;
  if (jctype == 'audio') {
    jctype = false
  } else {
    jctype = {
      frameRate: 24,
      width: {
        min: 480,
        ideal: 720,
        max: 1280
      },
      aspectRatio: 1.33333
    };
  }
  vausername = userId + '_' + rspid
  navigator.getUserMedia({
    video: jctype,
    audio: true
  }, (stream) => {
    localStream = stream
    let configuration
    if (jctype != false) {
      document.getElementById("local-video").srcObject = localStream
      configuration = {
        iceServers: [{
          "urls": ["stun:stun.l.google.com:19302",
            "stun:stun1.l.google.com:19302",
            "stun:stun2.l.google.com:19302"
          ]
        }]
      }
    }

    peerConn = new RTCPeerConnection(configuration)
    peerConn.addStream(localStream)
    peerConn.onaddstream = (e) => {
      document.getElementById("remote-video")
        .srcObject = e.stream
    }
    peerConn.onicecandidate = ((e) => {
      if (e.candidate == null)
        return

      sendData({
        type: "send_candidate",
        candidate: e.candidate
      })
    })

    sendData({
      type: "join_call"
    })

  }, (error) => {
    console.log(error)
  })
}

function sendData(data) {
  data.username = vausername
  socket.emit('vccallmsg', JSON.stringify(data))
}

//--------------------- Audio Recoder ------------------//
socket.on('getingonmsgs', (event) => {
  handleSignallingData(JSON.parse(event))
})

// ===== Handle Signalling Data Function =====//
function handleSignallingData(data) {
  switch (data.type) {
    case "answer":
      peerConn.setRemoteDescription(data.answer)
      break
    case "candidate":
      peerConn.addIceCandidate(data.candidate)
      break
    case "offer":
      peerConn.setRemoteDescription(data.offer)
      createAndSendAnswer()
  }
}

//==================== Create And Send Answer Function ======================//
function createAndSendAnswer() {
  peerConn.createAnswer((answer) => {
    peerConn.setLocalDescription(answer)
    sendData({
      type: "send_answer",
      answer: answer
    })
  }, error => {
    console.log(error)
  })
}

//====================== Audio Muted =================//
function muteAudio() {
  if (isAudio == true)
    $('#audio i').attr('class', 'bx bx-microphone-off');
  else
    $('#audio i').attr('class', 'bx bx-microphone');
  isAudio = !isAudio
  localStream.getAudioTracks()[0].enabled = isAudio
}

//------------------------ Video Call ------------------//
document.getElementById('callvideomodel').addEventListener('click', () => {
    sendUsername('video');
    startCall('video');
    timerTime = 0;
    minutes.innerText = "";
    seconds.innerText = "";
})

//======================= Camera Hide/Show =======================//
function muteVideo() {
  if (isVideo == true)
    $('#video i').attr('class', 'bx bx-camera-off');
  else
    $('#video i').attr('class', 'bx bx-camera');
  isVideo = !isVideo
  localStream.getVideoTracks()[0].enabled = isVideo
}

//==================== Full Screen ============//
function fullScreen(){
  if (isVideo == true){
    $('#screen i').attr('class', 'bx bx-exit-fullscreen');
    document.querySelector(".video_model .modal-dialog").classList.add("modal-fullscreen");
  }
  else{
    $('#screen i').attr('class', 'bx bx-fullscreen');
    document.querySelector(".video_model .modal-dialog").classList.remove("modal-fullscreen");
  }
  isVideo = !isVideo
}

//=============== Calls Section ================//
function callClickEvent(data) {
  socket.emit("callsData", { userId });
  document.getElementById("callList").innerHTML = '';
}

socket.on("callsLists", ({ callList }) => {
  callList.forEach(function(calls,index){
    month_names_short=['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const time = new Date(calls.createdAt);
    var ampm = time.getHours() >= 12 ? "pm" : "am";
    var hour = time.getHours() > 12 ? new Date().getHours() % 12 : new Date().getHours();
    var minute = time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes();
    const datewise = " "+time.getDate() + " " + (month_names_short[time.getMonth()]) + ", " + time.getFullYear();
    var cratedTime = datewise + ", " +hour + ":" + minute + " " + ampm;
    var callIcon = calls.type == "video"?'<button type="button" class="btn btn-link p-0 font-size-20 stretched-link" data-bs-toggle="modal" data-bs-target=".videocallModal"><i class="bx bx-video align-middle"></i></button>':
                  '<button type="button" class="btn btn-link p-0 font-size-20 stretched-link" data-bs-toggle="modal" data-bs-target=".audiocallModal"><i class="bx bxs-phone-call align-middle"></i></button>'
    var profile = calls.userProfile[0] ? `<img src="${calls.userProfile[0]}" class="rounded-circle avatar-xs" alt="">` : `<div class="avatar-xs"><span class="avatar-title rounded-circle bg-danger text-white">${calls.userName[0][0]}</span></div>`;
    var icon_color = calls.is_type == 0 ? `text-success`:`text-danger`;
    var call_icon = calls.sender_id == userId ? `ri-arrow-right-up-fill ${icon_color} align-bottom`:`ri-arrow-left-down-fill ${icon_color} align-bottom`;
    var callsInfo =
        `<li id="calls-id-${calls._id}" >
          <div class="d-flex align-items-center">
          <div class="chat-user-img flex-shrink-0 me-2">
          ${profile}
          </div>
              <div class="flex-grow-1 overflow-hidden">
                  <p class="text-truncate mb-0">${calls.userName[0]}</p>
                  <div class="text-muted font-size-12 text-truncate"><i class="${call_icon}"></i>${cratedTime}</div>
              </div>
              <div class="flex-shrink-0 ms-3">
                  <div class="d-flex align-items-center gap-3">
                      <div>
                          <h5 class="mb-0 font-size-12 text-muted">${calls.time}</h5>
                      </div>
                      <div>
                        ${callIcon}
                      </div>
                  </div>
              </div>
          </div>
        </li>`
        document.getElementById("callList").innerHTML += callsInfo;
      });
});

//------------------ Voice Recoder ------------------//
let recordertimerTime = 0;
const rStart = () => {
  isRunning = true;
  interval = setInterval(recorderincrementTimer, 1000)
}
const rstoptime = () => {
  isRunning = false;
  clearInterval(interval);
  document.querySelector('.times').innerHTML = '';
  setTimeout(() => {
	  document.getElementById('chatFrmSubmit').click()
  }, 100);
}

const recorderincrementTimer = () => {
  recordertimerTime++;
  document.querySelector('.times').innerHTML = pad(Math.floor(recordertimerTime / 60))+":"+pad(recordertimerTime % 60);
}
class VoiceRecorder {
	constructor() {
		this.mediaRecorder
		this.stream
		this.chunks = []
		this.isRecording = false
		this.recorderRef = document.querySelector("#recorder")
		this.startRef = document.querySelector("#start")
		this.stopRef = document.querySelector("#stop")
		this.startRef.onclick = this.startRecording.bind(this)
		this.stopRef.onclick = this.stopRecording.bind(this)
		this.constraints = {
			audio: true,
			video: false
		}
	}
	handleSuccess(stream) {
		this.stream = stream
		this.recorderRef.srcObject = this.stream
		this.mediaRecorder = new MediaRecorder(this.stream)
		this.mediaRecorder.ondataavailable = this.onMediaRecorderDataAvailable.bind(this)
		this.mediaRecorder.onstop = this.onMediaRecorderStop.bind(this)
		this.recorderRef.play()
		this.mediaRecorder.start()
	}

	handleError(error) {
		console.log("navigator.getUserMedia error: ", error)
	}

	onMediaRecorderDataAvailable(e) { this.chunks.push(e.data) }
	onMediaRecorderStop(e) {
			const blob = new Blob(this.chunks, { 'type': 'audio/ogg; codecs=opus' })
			const audioURL = window.URL.createObjectURL(blob)
			this.chunks = []
			this.stream.getAudioTracks().forEach(track => track.stop())
			this.stream = null
      var voice_recoder = audioURL
      voiceRecoderFile(voice_recoder, Math.floor(Math.random() * (99999 - 1234)) + 1234).then(function (recode) {
        voiceRecorder = recode;
      })
	}

	startRecording() {
    rStart()
		if (this.isRecording) return
		this.isRecording = true
		this.startRef.style.display = 'none'
		this.stopRef.style.display = 'block'
		document.querySelector('#chatFrmSubmit').style.display = "none";
		navigator.mediaDevices
			.getUserMedia(this.constraints)
			.then(this.handleSuccess.bind(this))
			.catch(this.handleError.bind(this))
	}

	stopRecording() {
    rstoptime();
    recordertimerTime=0
		if (!this.isRecording) return
		this.isRecording = false
		this.startRef.style.display = 'block'
		this.stopRef.style.display = 'none'
		document.querySelector('#chatFrmSubmit').style.display = "block";
		this.recorderRef.pause()
		this.mediaRecorder.stop()
	}

}
function voiceRecoderFile(url, filename, mimeType) {
  return (fetch(url)
    .then(function (res) { return res.arrayBuffer(); })
    .then(function (buf) { return new File([buf], `${filename}.wav`); })
  );
}
window.voiceRecorder = new VoiceRecorder()