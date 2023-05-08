/*
Template Name: Doot - Responsive Bootstrap 5 Chat App
Author: Themesbrand
Website: https://Themesbrand.com/
Contact: Themesbrand@gmail.com
File: Index init js
*/


  // document.getElementById("copyClipBoardChannel").style.display = "none";

(function () {

  var currentChatId = 'users-chat';
  var dummyImage = "assets/images/users/user-dummy-img.jpg";

  var currentSelectedChat = "users";
  var url = window.location.origin + "/assets/js/dir/";
  var usersList = "";
  var userChatId = 1;

  // chat user responsive hide show
  // function toggleSelected() {
  //   var userChatElement = document.getElementsByClassName("user-chat");

  //   document.querySelectorAll(".chat-user-list li a").forEach(function (item) {
  //     item.addEventListener("click", function (event) {
  //       userChatElement.forEach(function (elm) {
  //         elm.classList.add("user-chat-show");
  //       });

  //       // chat user list link active
  //       var chatUserList = document.querySelector(".chat-user-list li.active");
  //       if (chatUserList) chatUserList.classList.remove("active");
  //       this.parentNode.classList.add("active");
  //     });
  //   });

  //   document.querySelectorAll(".sort-contact ul li").forEach(function (item2) {
      
  //     item2.addEventListener("click", function (event) {
  //       userChatElement.forEach(function (elm) {
  //         elm.classList.add("user-chat-show");
  //       });
  //     });
  //   });
  //   // user-chat-remove
  //   document.querySelectorAll(".user-chat-remove").forEach(function (item) {
  //     item.addEventListener("click", function (event) {
  //       userChatElement.forEach(function (elm) {
  //         elm.classList.remove("user-chat-show");
  //       });
  //     });
  //   });
  // }

  // single to channel and channel to single chat conversation
  // function chatSwap() {
  //   (document.querySelectorAll("#favourite-users li, #usersList li")) && document.querySelectorAll("#favourite-users li, #usersList li") 
  //     .forEach(function (item) {
  //       item.addEventListener("click", function (event) {
  //         currentSelectedChat = "users";
  //         updateSelectedChat();
  //         currentChatId = 'users-chat';
  //         var contactId = item.getAttribute("id");
  //         var username = item.querySelector(".text-truncate").innerHTML;

  //         document.querySelector(".user-profile-sidebar .user-name").innerHTML = username;
  //         var contactImagesWithName = document.getElementById("users-chat");
  //         contactImagesWithName.querySelector(".text-truncate .user-profile-show").innerHTML = username;         
  //         document.querySelector(".user-profile-desc .text-truncate").innerHTML = username;
  //         document.querySelector(".audiocallModal .text-truncate").innerHTML = username;
  //         document.querySelector(".videocallModal .text-truncate").innerHTML = username;
  //         var img = document.getElementById(contactId).querySelector(".avatar-xs").getAttribute("src");          

  //         if (img) {
  //           document.querySelector(".user-own-img .avatar-sm").setAttribute("src", img);
  //           document.querySelector(".user-profile-sidebar .profile-img").setAttribute("src", img);
  //           document.querySelector(".audiocallModal .img-thumbnail").setAttribute("src", img);
  //           document.querySelector(".videocallModal .videocallModal-bg").setAttribute("src", img);
  //         } else {
  //           document.querySelector(".user-own-img .avatar-sm").setAttribute("src", dummyImage);
  //           document.querySelector(".user-profile-sidebar .profile-img").setAttribute("src", dummyImage);
  //           document.querySelector(".audiocallModal .img-thumbnail").setAttribute("src", dummyImage);
  //           document.querySelector(".videocallModal .videocallModal-bg").setAttribute("src", dummyImage);
  //         }

  //         var chatImg = item.querySelector(".avatar-xs").getAttribute("src");
  //         var conversationImg = document.getElementById("users-conversation");
  //         conversationImg.querySelectorAll(".left .chat-avatar").forEach(function (item3){
  //             if (chatImg) {
  //               item3.querySelector("img").setAttribute("src", chatImg);
  //             } else {
  //               item3.querySelector("img").setAttribute("src", dummyImage);
  //             }
  //           });
  //           window.stop();
  //       });
        
  //     });

  //   document.querySelectorAll("#channelList li").forEach(function (item) {
  //     item.addEventListener("click", function (event) {
  //       currentChatId = 'channel-chat';
  //       currentSelectedChat = "channel";
  //       updateSelectedChat();
  //       var channelId = item.getAttribute("id");
  //       var channelName = item.querySelector(".text-truncate").innerHTML;
  //       var changeChannelName = document.getElementById("channel-chat");
  //       changeChannelName.querySelector(".text-truncate .user-profile-show").innerHTML = channelName;
  //       document.querySelector(".user-profile-desc .text-truncate").innerHTML = channelName;
  //       document.querySelector(".audiocallModal .text-truncate").innerHTML = channelName;
  //       document.querySelector(".videocallModal .text-truncate").innerHTML = channelName;
  //       document.querySelector(".user-profile-sidebar .user-name").innerHTML = channelName;
        
  //       var channelImg = document.getElementById(channelId).querySelector(".avatar-xs").getAttribute("src");

  //       if (channelImg) {
  //         document.querySelector(".user-own-img .avatar-sm").setAttribute("src", channelImg);
  //         document.querySelector(".user-profile-sidebar .profile-img").setAttribute("src", channelImg);
  //         document.querySelector(".audiocallModal .img-thumbnail").setAttribute("src", channelImg);
  //         document.querySelector(".videocallModal .videocallModal-bg").setAttribute("src", channelImg);
  //       } else {
  //         document.querySelector(".user-own-img .avatar-sm").setAttribute("src", dummyImage);
  //         document.querySelector(".user-profile-sidebar .profile-img").setAttribute("src", dummyImage);
  //         document.querySelector(".audiocallModal .img-thumbnail").setAttribute("src", dummyImage);
  //         document.querySelector(".videocallModal .videocallModal-bg").setAttribute("src", dummyImage);
  //       }
  //     });
  //   });
  // }

  //user list by json
  var getJSON = function (jsonurl, callback) {
    var xhr = new XMLHttpRequest();    
    xhr.open("GET", url + jsonurl, true);
    xhr.responseType = "json";
    xhr.onload = function () {
      var status = xhr.status;
      if (status === 200) {
        callback(null, xhr.response);
      } else {
        callback(status, xhr.response);
      }
    };
    xhr.send();
  };

  getJSON("users.json", function (err, data) {    
    if (err !== null) {
      console.log("Something went wrong: " + err);
    } else {
      // set favourite users list
      // var fav = data[0].favorites;
      // fav.forEach(function (user, index) {
      //   var profile = user.profile ? '<img src="' + user.profile + '" class="rounded-circle avatar-xs" alt=""><span class="user-status"></span>'
      //     : '<div class="avatar-xs"><span class="avatar-title rounded-circle bg-primary text-white"><span class="username">JP</span><span class="user-status"></span></span></div>';
      //   var isMessageCount = user.messagecount ? '<div class="ms-auto"><span class="badge badge-soft-dark rounded p-1">' +
      //     user.messagecount +
      //     "</span></div>"
      //     : "";
      //   var messageCount =  user.messagecount ? '<a href="javascript: void(0);" class="unread-msg-user">' : '<a href="javascript: void(0);">'
        
      //   var activeClass = user.id === 1 ? "active" : "";
      //   document.getElementById("favourite-users").innerHTML +=
      //     '<li id="contact-id-' + user.id +'" data-name="favorite" class="' + activeClass + '">\
      //             '+ messageCount +' \
      //                 <div class="d-flex align-items-center">\
      //                     <div class="chat-user-img online align-self-center me-2 ms-0">\
      //                         ' + profile + '\
      //                     </div>\
      //                     <div class="overflow-hidden">\
      //                         <p class="text-truncate mb-0">' + user.name + "</p>\
      //                     </div>\
      //                     " + isMessageCount + "\
      //                 </div>\
      //             </a>\
      //         </li>";
      // });

      // set users message list
      // var users = data[0].users;
      // users.forEach(function (userData, index) {
      //   var isUserProfile = userData.profile ? '<img src="' + userData.profile + '" class="rounded-circle avatar-xs" alt=""><span class="user-status"></span>'
      //     : '<div class="avatar-xs"><span class="avatar-title rounded-circle bg-primary text-white"><span class="username">JL</span><span class="user-status"></span></span></div>';

      //   var isMessageCount = userData.messagecount ? '<div class="ms-auto"><span class="badge badge-soft-dark rounded p-1">' +
      //     userData.messagecount +
      //     "</span></div>"
      //     : "";
      //   var messageCount =  userData.messagecount ? '<a href="javascript: void(0);" class="unread-msg-user">' : '<a href="javascript: void(0);">'  
      //   document.getElementById("usersList").innerHTML +=
      //     '<li id="contact-id-' + userData.id + '" data-name="direct-message">\
      //             '+ messageCount +' \
      //             <div class="d-flex align-items-center">\
      //                 <div class="chat-user-img online align-self-center me-2 ms-0">\
      //                     ' + isUserProfile + '\
      //                 </div>\
      //                 <div class="overflow-hidden">\
      //                     <p class="text-truncate mb-0">' + userData.name + "</p>\
      //                 </div>\
      //                 " + isMessageCount + "\
      //             </div>\
      //         </a>\
      //     </li>";
      // });

      // set channels list
      // var channelsData = data[0].channels;
      // channelsData.forEach(function (isChannel, index) {
      //   var isMessage = isChannel.messagecount
      //     ? '<div class="flex-shrink-0 ms-2"><span class="badge badge-soft-dark rounded p-1">' +
      //     isChannel.messagecount +
      //     "</span></div>"
      //     : "";
      //   var isMessageCount = isChannel.messagecount ? '<div class="ms-auto"><span class="badge badge-soft-dark rounded p-1">' +
      //   isChannel.messagecount +
      //     "</span></div>"
      //     : "";
      //   var messageCount =  isChannel.messagecount ? '<a href="javascript: void(0);" class="unread-msg-user">' : '<a href="javascript: void(0);">'  
      //   document.getElementById("channelList").innerHTML +=
      //     '<li id="contact-id-' + isChannel.id + '" data-name="channel">\
      //           '+ messageCount +' \
      //               <div class="d-flex align-items-center">\
      //                   <div class="flex-shrink-0 avatar-xs me-2">\
      //                       <span class="avatar-title rounded-circle bg-soft-light text-dark">#</span>\
      //                   </div>\
      //                   <div class="flex-grow-1 overflow-hidden">\
      //                       <p class="text-truncate mb-0">' + isChannel.name + "</p>\
      //                   </div>\
      //                   <div>" + isMessage + "</div>\
      //                   </div>\
      //           </a>\
      //       </li>";
      // });
    }
    // toggleSelected();
    // chatSwap();
  });
  
  //CallList userDetails
  function callsList(){
    document.querySelectorAll('#callList li').forEach(function(item){
      item.addEventListener("click",function(event){
        var callsId = item.getAttribute("id");
        var callUser = item.querySelector(".text-truncate").innerHTML;        
        document.querySelector(".videocallModal .text-truncate").innerHTML = callUser;
        document.querySelector(".audiocallModal .text-truncate").innerHTML = callUser;

        var callImg = document.getElementById(callsId).querySelector(".avatar-xs").getAttribute("src");        
        if (callImg) {          
          document.querySelector(".audiocallModal .img-thumbnail").setAttribute("src", callImg);
          document.querySelector(".videocallModal .videocallModal-bg").setAttribute("src", callImg);
        } else {             
          document.querySelector(".audiocallModal .img-thumbnail").setAttribute("src", dummyImage);          
          var s = document.querySelector(".videocallModal .videocallModal-bg").setAttribute("src", dummyImage);          
        }          
      });
    });    
  }

  //Call list  
//   getJSON("callList.json",function(err,data){    
//     if (err !== null) {
//       console.log("Something went wrong: " + err);  
//     } else {      
//       callList = data;      
//       callList.forEach(function(calls,index){   
//         var callIcon = (calls.callVideo===true)?'<button type="button" class="btn btn-link p-0 font-size-20 stretched-link" data-bs-toggle="modal" data-bs-target=".videocallModal"><i class="'+calls.callTypeIcon+'"></i></button>':
//                       '<button type="button" class="btn btn-link p-0 font-size-20 stretched-link" data-bs-toggle="modal" data-bs-target=".audiocallModal"><i class="'+calls.callTypeIcon+'"></i></button>'
        
//         var profile = calls.profile ? '<img src="' + calls.profile + '" class="rounded-circle avatar-xs" alt="">'
//           : '<div class="avatar-xs"><span class="avatar-title rounded-circle bg-danger text-white">RL</span></div>';         
//         document.getElementById("callList").innerHTML +=                        
//       '<li id="calls-id-' + calls.id + '" >\
//         <div class="d-flex align-items-center">\
//         <div class="chat-user-img flex-shrink-0 me-2">\
//             ' + profile + '\
//         </div>\
//             <div class="flex-grow-1 overflow-hidden">\
//                 <p class="text-truncate mb-0">'+calls.name+'</p>\
//                 <div class="text-muted font-size-12 text-truncate"><i class="'+calls.callArrowType+'"></i> '+calls.dateTime+'</div>\
//             </div>\
//             <div class="flex-shrink-0 ms-3">\
//                 <div class="d-flex align-items-center gap-3">\
//                     <div>\
//                         <h5 class="mb-0 font-size-12 text-muted">'+calls.callTime+'</h5>\
//                     </div>\
//                     <div>\
//                        '+callIcon+'\
//                     </div>\
//                 </div>\
//             </div>\
//         </div>\
//       </li>'
//     });    
//   }
//   callsList();
// });

// //Contact List dynamic Details
// function contactList(){
//       document.querySelectorAll('.sort-contact ul li').forEach(function(item){
//       item.addEventListener("click",function(event){
//         currentSelectedChat = "users";
//         updateSelectedChat();        
//         var contactName = item.querySelector('li .font-size-14').innerHTML; 
//         document.querySelector(".text-truncate .user-profile-show").innerHTML = contactName;
//         document.querySelector(".user-profile-desc .text-truncate").innerHTML = contactName;
//         document.querySelector(".audiocallModal .text-truncate").innerHTML = contactName;
//         document.querySelector(".videocallModal .text-truncate").innerHTML = contactName;
//         document.querySelector(".user-profile-sidebar .user-name").innerHTML = contactName;

//         var contactImg = item.querySelector('li .align-items-center').querySelector(".avatar-xs .rounded-circle").getAttribute("src");
//         if (contactImg) {
//           document.querySelector(".user-own-img .avatar-sm").setAttribute("src", contactImg);
//           document.querySelector(".user-profile-sidebar .profile-img").setAttribute("src", contactImg);
//           document.querySelector(".audiocallModal .img-thumbnail").setAttribute("src", contactImg);
//           document.querySelector(".videocallModal .videocallModal-bg").setAttribute("src", contactImg);
//         } else {
//           document.querySelector(".user-own-img .avatar-sm").setAttribute("src", dummyImage);
//           document.querySelector(".user-profile-sidebar .profile-img").setAttribute("src", dummyImage);
//           document.querySelector(".audiocallModal .img-thumbnail").setAttribute("src", dummyImage);
//           document.querySelector(".videocallModal .videocallModal-bg").setAttribute("src", dummyImage);
//         }
//         var conversationImg = document.getElementById("users-conversation");
//         conversationImg.querySelectorAll(".left .chat-avatar").forEach(function (item3){
//             if (contactImg) {
//               item3.querySelector("img").setAttribute("src", contactImg);
//             } else {
//               item3.querySelector("img").setAttribute("src", dummyImage);
//             }
//           });
//           window.stop(); 
//       });
//   }
// )};  

  // // get contacts list  
  // getJSON("contacts.json", function (err, data) {
  //   if (err !== null) {
  //     console.log("Something went wrong: " + err);
  //   } else {
  //     usersList = data;      
  //     data.sort(function (a, b) {
  //       return a.name.localeCompare(b.name);
  //     });
  //     // set favourite users list
  //     var msgHTML = "";
  //     var userNameCharAt = "";

  //     usersList.forEach(function (user, index) {       
  //       var profile = user.profile ? '<img src="' + user.profile + '" class="img-fluid rounded-circle" alt="">'
  //         : '<span class="avatar-title rounded-circle bg-primary font-size-10">FP</span>';

  //       msgHTML =
  //         '<li>\
  //             <div class="d-flex align-items-center">\
  //                 <div class="flex-shrink-0 me-2">\
  //                     <div class="avatar-xs">\
  //                         ' + profile + '\
  //                     </div>\
  //                 </div>\
  //                 <div class="flex-grow-1">\
  //                     <h5 class="font-size-14 m-0" >' + user.name + '</h5>\
  //                 </div>\
  //                 <div class="flex-shrink-0">\
  //                     <div class="dropdown">\
  //                         <a href="#" class="text-muted dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">\
  //                             <i class="bx bx-dots-vertical-rounded align-middle"></i>\
  //                         </a>\
  //                         <div class="dropdown-menu dropdown-menu-end">\
  //                             <a class="dropdown-item d-flex align-items-center justify-content-between" href="#">Sửa <i class="bx bx-pencil ms-2 text-muted"></i></a>\
  //                             <a class="dropdown-item d-flex align-items-center justify-content-between" href="#">Xóa <i class="bx bx-trash ms-2 text-muted"></i></a>\
  //                         </div>\
  //                     </div>\
  //                 </div>\
  //             </div>\
  //         </li>';
  //       var isSortContact =
  //         '<div class="mt-3" >\
  //         <div class="contact-list-title">' + user.name.charAt(0).toUpperCase() + '\
  //               </div>\
  //               <ul id="contact-sort-' + user.name.charAt(0) + '" class="list-unstyled contact-list" >';

  //       if (userNameCharAt != user.name.charAt(0)) {
  //         document.getElementsByClassName("sort-contact")[0].innerHTML += isSortContact;
  //       }        
  //       document.getElementById("contact-sort-" + user.name.charAt(0)).innerHTML = document.getElementById("contact-sort-" + user.name.charAt(0)).innerHTML + msgHTML;
  //       userNameCharAt = user.name.charAt(0);
  //       +'</ul>'+
  //       '</div>'
  //     });
  //   }
  //   contactList(); 
  //   toggleSelected();
    
  // });

  // function updateSelectedChat() {
  //   if (currentSelectedChat == "users") {
  //     document.getElementById("channel-chat").style.display = "none";
  //     document.getElementById("users-chat").style.display = "block";
  //     getChatMessages(url + "chats.json");

  //   } else {
  //     document.getElementById("channel-chat").style.display = "block";
  //     document.getElementById("users-chat").style.display = "none";
  //     getChatMessages(url + "chats.json");
  //   }
  // }
  // updateSelectedChat();

  // Profile hide/show
  // var userProfileSidebar = document.querySelector(".user-profile-sidebar");

  // document.querySelectorAll(".user-profile-show").forEach(function (item) {
  //   item.addEventListener("click", function (event) {
  //     userProfileSidebar.classList.toggle("d-block");
  //   });
  // });

  // chat conversation scroll
  window.addEventListener("DOMContentLoaded", function () {
    var conversationScroll = document.querySelector(
      "#chat-conversation .simplebar-content-wrapper"
    );
    conversationScroll.scrollTop = conversationScroll.scrollHeight;
  });

  // body click hide collapse
  var myCollapse = document.getElementById("chatinputmorecollapse");
  document.body.addEventListener("click", function () {
    var bsCollapse = new bootstrap.Collapse(myCollapse, {
      toggle: false,
    });
    bsCollapse.hide();
  });

  // chat conversation swiper
  if (myCollapse) {
    myCollapse.addEventListener("shown.bs.collapse", function () {
      initSwiper();
    });
  }

  function initSwiper() {
    var swiper = new Swiper(".chatinput-links", {
      slidesPerView: 3,
      spaceBetween: 30,
      breakpoints: {
        768: {
          slidesPerView: 4,
        },
        1024: {
          slidesPerView: 6,
        },
      },
    });
  }

  // contact modal list
  var contactModalList = document.querySelectorAll(
    ".contact-modal-list .contact-list li"
  );
  contactModalList.forEach(function (link) {
    link.addEventListener("click", function () {
      link.classList.toggle("selected");
    });
  });
                                                                  
  // Change conversation bg
  document.querySelectorAll(".theme-img , .theme-color").forEach(function (item) {
      item.addEventListener("click", function (event) {
        // choose theme color
        var colorRadioElements = document.querySelector("input[name=bgcolor-radio]:checked");
        if (colorRadioElements) {
          colorRadioElements = colorRadioElements.id;
          var elementsColor = document.getElementsByClassName(colorRadioElements);
          if (elementsColor) {
            var color = window.getComputedStyle(elementsColor[0], null).getPropertyValue("background-color");
            var userChatOverlay = document.querySelector(".user-chat-overlay");
            userChatOverlay.style.background = color;
            rgbColor = color.substring(
              color.indexOf("(") + 1,
              color.indexOf(")")
            );
            document.documentElement.style.setProperty(
              "--bs-primary-rgb",
              rgbColor
            );
          }
        }
        // choose theme image
        var imageRadioElements = document.querySelector(
          "input[name=bgimg-radio]:checked"
        );
        if (imageRadioElements) {
          imageRadioElements = imageRadioElements.id;
          var elementsImage = document.getElementsByClassName(imageRadioElements);
          if (elementsColor) {
            var image = window.getComputedStyle(elementsImage[0], null).getPropertyValue("background-image");
            var userChat = document.querySelector(".user-chat");
            userChat.style.backgroundImage = image;
          }
        }
      });
    });

  // function scrollToBottom(id) {
  //   var simpleBar = document.getElementById(id).querySelector("#chat-conversation .simplebar-content-wrapper");
  //   var offsetHeight = document.getElementsByClassName("chat-conversation-list")[0]
  //     ? document.getElementById(id).getElementsByClassName("chat-conversation-list")[0]
  //       .scrollHeight -
  //     window.innerHeight +
  //     250
  //     : 0;
  //   if (offsetHeight)
  //     simpleBar.scrollTo({ top: offsetHeight, behavior: "smooth" });
  // }

  //add an eventListener to the from
  var chatForm = document.querySelector("#chatinput-form");
  var chatInput = document.querySelector("#chat-input");
  var itemList = document.querySelector(".chat-conversation-list");
  var chatInputFeedback = document.querySelector(".chat-input-feedback");

  
  // function currentTime(){    
  //   var ampm = new Date().getHours() >= 12 ? 'pm' : 'am'; 
  //   var hour = new Date().getHours()>12 ? new Date().getHours() % 12 : new Date().getHours();
  //   var minute = new Date().getMinutes()<10 ? '0' + new Date().getMinutes() :new Date().getMinutes();
  //   if(hour<10 ){
  //     return '0' + hour + ':' + minute + ' ' + ampm;
  //   }
  //   else{
  //     return hour + ':' + minute + ' ' + ampm;
  //   }
  // }
  // setInterval(currentTime, 1000);

  var messageIds = 0;

  //Append New Message

  // var getChatList = function (chatid, chatItems) {

  //   messageIds++;
  //   var chatConList = document.getElementById(chatid);

  //   var itemList = chatConList.querySelector(".chat-conversation-list");

  //   itemList.insertAdjacentHTML(
  //     "beforeend",
  //     '<li class="chat-list right" id="chat-list-' +
  //     messageIds +
  //     '" >\
  //               <div class="conversation-list">\
  //                   <div class="user-chat-content">\
  //                       <div class="ctext-wrap">\
  //                           <div class="ctext-wrap-content">\
  //                               <p class="mb-0 ctext-content">\
  //                                   ' + chatItems + '\
  //                               </p>\
  //                           </div>\
  //                           <div class="dropdown align-self-start message-box-drop">\
  //                               <a class="dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">\
  //                                   <i class="ri-more-2-fill"></i>\
  //                               </a>\
  //                               <div class="dropdown-menu">\
  //                                   <a class="dropdown-item d-flex align-items-center justify-content-between" href="#" data-bs-toggle="collapse" data-bs-target=".replyCollapse">Trả lời <i class="bx bx-share ms-2 text-muted"></i></a>\
  //                                   <a class="dropdown-item d-flex align-items-center justify-content-between" href="#" data-bs-toggle="modal" data-bs-target=".forwardModal">Chuyển tiếp <i class="bx bx-share-alt ms-2 text-muted"></i></a>\
  //                                   <a class="dropdown-item d-flex align-items-center justify-content-between copy-message" href="#" id="copy-message-'+ messageIds+'">Copy <i class="bx bx-copy text-muted ms-2"></i></a>\
  //                                   <a class="dropdown-item d-flex align-items-center justify-content-between" href="#">Mark as Unread <i class="bx bx-message-error text-muted ms-2"></i></a>\
  //                                   <a class="dropdown-item d-flex align-items-center justify-content-between delete-item" id="delete-item-' + messageIds + '" href="#">Xóa <i class="bx bx-trash text-muted ms-2"></i></a>\
  //                           </div>\
  //                       </div>\
  //                   </div>\
  //                   <div class="conversation-name">\
  //                       <small class="text-muted time">' + currentTime() + '</small>\
  //                       <span class="text-success check-message-icon"><i class="bx bx-check"></i></span>\
  //                   </div>\
  //               </div>\
  //           </div>\
  //       </li>'
  //   );

  //   // remove chat list
  //   var newChatList = document.getElementById("chat-list-" + messageIds);
  //   newChatList.querySelectorAll(".delete-item").forEach(function (subitem) {
  //     subitem.addEventListener("click", function () {
  //       itemList.removeChild(newChatList);
  //     });
  //   });
  //   newChatList.querySelectorAll(".copy-message").forEach(function (subitem) {
  //     subitem.addEventListener("click", function () {
  //         var currentValue = newChatList.childNodes[1].children[1].firstElementChild.firstElementChild.getAttribute("id");
  //           isText = newChatList.childNodes[1].children[1].firstElementChild.firstElementChild.innerText;
  //           navigator.clipboard.writeText(isText);
  //     });
  //   });
  // };

  // if (chatForm) {
  //   //add an item to the List, including to local storage
  //   chatForm.addEventListener("submit", function (e) {
  //     e.preventDefault();
  //     var chatId = currentChatId;
  //     var chatInputValue = chatInput.value;

  //     if (chatInputValue.length === 0) {
  //       chatInputFeedback.classList.add("show");
  //       setTimeout(function () {
  //         chatInputFeedback.classList.remove("show");
  //       }, 3000);
  //     } else {
  //       getChatList(chatId, chatInputValue);
  //       scrollToBottom(chatId);
  //     }
  //     chatInput.value = "";
  //   });
  // }

  
  // remove chat list
  function deleteMessage() {
    var deleteItems = itemList.querySelectorAll(".delete-item"); 
    deleteItems.forEach(function (item) {
      item.addEventListener("click", function () {
        (item.closest(".user-chat-content").childElementCount == 2) ? item.closest(".chat-list").remove() : item.closest(".ctext-wrap").remove();
      });
    });
  }

  //remove chat images
  function deleteImage(){
    var deleteImage = itemList.querySelectorAll(".chat-list");
    deleteImage.forEach(function(item){       
      item.querySelectorAll(".delete-image").forEach(function(subitem){
        subitem.addEventListener("click", function () {
          (subitem.closest(".message-img").childElementCount == 1) ?  subitem.closest(".chat-list").remove() : subitem.closest(".message-img-list").remove();
      });    
    });  
  });
}

//Delete Channel Message
var channelItemList = document.querySelector("#channel-conversation");
function deleteChannelMessage() {
  var channelChatList = channelItemList.querySelectorAll(".delete-item"); 
  channelChatList.forEach(function (item) {
    item.addEventListener("click", function () {
      (item.closest(".user-chat-content").childElementCount == 2) ? item.closest(".chat-list").remove() : item.closest(".ctext-wrap").remove();
    });
  });
}

// //Copy Messages
// function copyMessage() {
//   var copyMessage = itemList.querySelectorAll(".copy-message");
//   copyMessage.forEach(function (item) {
//       item.addEventListener("click", function () {        
//         var isText = (item.closest(".ctext-wrap").children[0]) ? item.closest(".ctext-wrap").children[0].children[0].innerText : '';
//         navigator.clipboard.writeText(isText);
//     });
//   });
// }



//Copy Channel Messages
// function copyChannelMessage(){
//   var copyChannelMessage = channelItemList.querySelectorAll(".copy-message");  
//   copyChannelMessage.forEach(function (item) {
//       item.addEventListener("click", function () {        
//         var isText = (item.closest(".ctext-wrap").children[0]) ? item.closest(".ctext-wrap").children[0].children[0].innerText : '';
//         navigator.clipboard.writeText(isText);
//     });
//   });
// }



  // // Profile Foreground Img
  // document.querySelector("#profile-foreground-img-file-input").addEventListener("change", function () {
  //     var preview = document.querySelector(".profile-foreground-img");
  //     var file = document.querySelector(".profile-foreground-img-file-input").files[0];
  //     var reader = new FileReader();

  //     reader.addEventListener(function () {
  //       preview.src = reader.result;
  //       },
  //       false
  //     );
  //     if (file) {
  //       reader.readAsDataURL(file);
  //     }
  //   });

  // // user profile img
  // document.querySelector("#profile-img-file-input").addEventListener("change", function () {
  //     var preview = document.querySelector(".user-profile-image");
  //     var file = document.querySelector(".profile-img-file-input").files[0];
  //     var reader = new FileReader();

  //     reader.addEventListener(
  //       "load",
  //       function () {
  //         preview.src = reader.result;
  //       },
  //       false
  //     );

  //     if (file) {
  //       reader.readAsDataURL(file);
  //     }
  //   });

  // // favourite btn
  // var favouriteBtn = document.getElementsByClassName("favourite-btn");
  // for (var i = 0; i < favouriteBtn.length; i++) {
  //   var favouriteBtns = favouriteBtn[i];
  //   favouriteBtns.onclick = function () {
  //     favouriteBtns.classList.toggle("active");
  //   };
  // }

  // // chat emojiPicker input
  // var emojiPicker = new FgEmojiPicker({
  //   trigger: [".emoji-btn"],
  //   removeOnSelection: false,
  //   closeButton: true,
  //   position: ["top", "right"],
  //   preFetch: true,
  //   dir: "assets/js/dir/json",
  //   insertInto: document.querySelector(".chat-input"),
  // });

  // // emojiPicker position
  // var emojiBtn = document.getElementById("emoji-btn");
  // emojiBtn.addEventListener("click", function () {
  //   setTimeout(function () {
  //     var fgEmojiPicker = document.getElementsByClassName("fg-emoji-picker")[0];
  //     if (fgEmojiPicker) {
  //       var leftEmoji = window.getComputedStyle(fgEmojiPicker)
  //         ? window.getComputedStyle(fgEmojiPicker).getPropertyValue("left")
  //         : "";
  //       if (leftEmoji) {
  //         leftEmoji = leftEmoji.replace("px", "");
  //         leftEmoji = leftEmoji - 40 + "px";
  //         fgEmojiPicker.style.left = leftEmoji;
  //       }
  //     }
  //   }, 0);
  // });

  function getJSONFile(jsonurl, callback){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", jsonurl, true);
    xhr.responseType = "json";
    xhr.onload = function () {
      var status = xhr.status;
      if (status === 200) {
        callback(null, xhr.response);
      } else {
        callback(status, xhr.response);
      }
    };
    xhr.send();
  }

  // getNextMsgCounts
  function getNextMsgCounts(chatsData, i, from_id){
    var counts = 0;
    while (chatsData[i]) {
      if(chatsData[i + 1] && chatsData[i + 1]["from_id"] == from_id) {
        counts++;
        i++;
      } else {
        break;
      }
    }   
    return counts;
  }

  //getNextMsgs
  function getNextMsgs(chatsData, i, from_id, isContinue){
    var msgs = 0;
    while (chatsData[i]) {
      if(chatsData[i + 1] && chatsData[i + 1]["from_id"] == from_id) {
        msgs = getMsg(chatsData[i+1].id, chatsData[i+1].msg, chatsData[i+1].has_images, chatsData[i+1].has_files, chatsData[i+1].has_dropDown);
        i++;
      } else {
        break;
      }
    }   
    return msgs;
  }

//   // getMeg
//   function getMsg(id, msg, has_images, has_files, has_dropDown){
//     var msgHTML = '<div class="ctext-wrap">';
//     if (msg != null) {
//         msgHTML += '<div class="ctext-wrap-content" id=' + id +'><p class="mb-0 ctext-content">' + msg +"</p></div>";
//     } else if (has_images && has_images.length > 0) {
//         msgHTML += '<div class="message-img mb-0">';
//         for (i = 0; i < has_images.length; i++) {
//         msgHTML +=             
//             '<div class="message-img-list">\
//                 <div>\
//                     <a class="popup-img d-inline-block" href="' + has_images[i] + '">\
//                         <img src="' + has_images[i] + '" alt="" class="rounded border">\
//                     </a>\
//                 </div>\
//                 <div class="message-img-link">\
//                 <ul class="list-inline mb-0">\
//                     <li class="list-inline-item dropdown">\
//                         <a class="dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">\
//                             <i class="bx bx-dots-horizontal-rounded"></i>\
//                         </a>\
//                         <div class="dropdown-menu">\
//                             <a class="dropdown-item d-flex align-items-center justify-content-between" href="#">Tải về <i class="bx bx-download ms-2 text-muted"></i></a>\
//                             <a class="dropdown-item d-flex align-items-center justify-content-between" href="#" data-bs-toggle="collapse" data-bs-target=".replyCollapse">Trả lời <i class="bx bx-share ms-2 text-muted"></i></a>\
//                             <a class="dropdown-item d-flex align-items-center justify-content-between" href="#" data-bs-toggle="modal" data-bs-target=".forwardModal">Chuyển tiếp <i class="bx bx-share-alt ms-2 text-muted"></i></a>\
//                             <a class="dropdown-item d-flex align-items-center justify-content-between delete-image" href="#">Xóa <i class="bx bx-trash ms-2 text-muted"></i></a>\
//                         </div>\
//                     </li>\
//                 </ul>\
//                 </div>\
//             </div>';
//         }
//         msgHTML += "</div>";
//     } else if (has_files.length > 0) {
//         msgHTML +=
//         '<div class="ctext-wrap-content">\
//             <div class="p-3 border-primary border rounded-3">\
//             <div class="d-flex align-items-center attached-file">\
//                 <div class="flex-shrink-0 avatar-sm me-3 ms-0 attached-file-avatar">\
//                     <div class="avatar-title bg-soft-primary text-primary rounded-circle font-size-20">\
//                         <i class="ri-attachment-2"></i>\
//                     </div>\
//                 </div>\
//                 <div class="flex-grow-1 overflow-hidden">\
//                     <div class="text-start">\
//                         <h5 class="font-size-14 mb-1">design-phase-1-approved.pdf</h5>\
//                         <p class="text-muted text-truncate font-size-13 mb-0">12.5 MB</p>\
//                     </div>\
//                 </div>\
//                 <div class="flex-shrink-0 ms-4">\
//                     <div class="d-flex gap-2 font-size-20 d-flex align-items-start">\
//                         <div>\
//                             <a href="#" class="text-muted">\
//                                 <i class="bx bxs-download"></i>\
//                             </a>\
//                         </div>\
//                     </div>\
//                 </div>\
//             </div>\
//             </div>\
//         </div>';
//     }   
//     if(has_dropDown === true){            
//     msgHTML +=             
//         '<div class="dropdown align-self-start message-box-drop">\
//                 <a class="dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">\
//                     <i class="ri-more-2-fill"></i>\
//                 </a>\
//                 <div class="dropdown-menu">\
//                     <a class="dropdown-item d-flex align-items-center justify-content-between" href="#" data-bs-toggle="collapse" data-bs-target=".replyCollapse">Trả lời <i class="bx bx-share ms-2 text-muted"></i></a>\
//                     <a class="dropdown-item d-flex align-items-center justify-content-between" href="#" data-bs-toggle="modal" data-bs-target=".forwardModal">Chuyển tiếp <i class="bx bx-share-alt ms-2 text-muted"></i></a>\
//                     <a class="dropdown-item d-flex align-items-center justify-content-between copy-message" href="#" id="copy-message-'+ messageIds+'">Copy <i class="bx bx-copy text-muted ms-2"></i></a>\
//                     <a class="dropdown-item d-flex align-items-center justify-content-between" href="#">Mark as Unread <i class="bx bx-message-error text-muted ms-2"></i></a>\
//                     <a class="dropdown-item d-flex align-items-center justify-content-between delete-item" href="#">Xóa <i class="bx bx-trash text-muted ms-2"></i></a>\
//                 </div>\
//             </div>'         
//     }
//     msgHTML += '</div>';
//     return msgHTML;
// }

  // //Chat Message
  // function getChatMessages(jsonFileUrl) {
  //   getJSONFile(jsonFileUrl, function (err, data) {
  //     if (err !== null) {
  //       console.log("Something went wrong: " + err);
  //     } else {
  //       var chatsData =
  //         currentSelectedChat == "users" ? data[0].chats : data[0].channel_chat;

  //       document.getElementById(
  //         currentSelectedChat + "-conversation"
  //       ).innerHTML = "";
  //       var isContinue = 0;
  //       chatsData.forEach(function (isChat, index) {          
  //         if(isContinue > 0) {
  //           isContinue = isContinue-1;
  //           return;
  //         }
  //         var isAlighn = isChat.from_id == userChatId ? " right" : " left";
  //         var user = usersList.find(function (list) {
  //           return list.id == isChat.from_id;            
  //         });
  //         var msgHTML = '<li class="chat-list' + isAlighn + '" id=' + isChat.id + '>\
  //                       <div class="conversation-list">';
  //                       if(userChatId != isChat.from_id)
  //                       msgHTML += '<div class="chat-avatar"><img src="' + user.profile + '" alt=""></div>';

  //                       msgHTML += '<div class="user-chat-content">';
  //                       msgHTML += getMsg(isChat.id, isChat.msg, isChat.has_images, isChat.has_files, isChat.has_dropDown);
  //                       if (chatsData[index + 1] && isChat.from_id == chatsData[index + 1]["from_id"]) {
  //                         isContinue = getNextMsgCounts(chatsData, index, isChat.from_id);
  //                         msgHTML += getNextMsgs(chatsData, index, isChat.from_id, isContinue);
  //                       }

  //           msgHTML +=
  //             '<div class="conversation-name"><small class="text-muted time">' +
  //             isChat.datetime +
  //             '</small> <span class="text-success check-message-icon"><i class="bx bx-check-double"></i></span></div>';
  //         msgHTML += "</div>\
  //               </div>\
  //           </li>";

  //         document.getElementById(currentSelectedChat + "-conversation").innerHTML += msgHTML;
  //       });
  //     }
  //     deleteMessage();
  //     deleteChannelMessage();
  //     deleteImage();
  //     copyMessage();
  //     copyChannelMessage();
  //     scrollToBottom('users-chat');
  //     updateLightbox();      
  //   });
  // }
  // GLightbox Popup
  // function updateLightbox() {
  //   var lightbox = GLightbox({
  //     selector: ".popup-img",
  //     title: false,
  //   });    
  // }
})();

  var input, filter, ul, li, a, i,j,div;
  // // Search User
  // function searchUser() {    
  //   input = document.getElementById("serachChatUser");      
  //   filter = input.value.toUpperCase();  
  //   ul = document.querySelector(".chat-room-list");    
  //   li = ul.getElementsByTagName("li");     
  //   for (i = 0; i < li.length; i++) {
  //     var item = li[i];      
  //     var txtValue = item.querySelector("p").innerText;      
  //     if (txtValue.toUpperCase().indexOf(filter) > -1) {
  //       li[i].style.display = "";
  //     } else {
  //       li[i].style.display = "none";
  //     }
  //   }
  // }
  
  // //Search Contacts
  //   function searchContacts(){
  //     input = document.getElementById("searchContact");
  //     filter = input.value.toUpperCase();
  //     list = document.querySelector(".sort-contact");     
  //     li = list.querySelectorAll(".mt-3 li");
  //     div = list.querySelectorAll(".mt-3 .contact-list-title");
      
  //     for (j = 0; j < div.length; j++){             
  //       var contactTitle = div[j];               
  //       txtValue = contactTitle.innerText;
  //       if (txtValue.toUpperCase().indexOf(filter) > -1) {
  //         div[j].style.display = "";
  //       } else {
  //         div[j].style.display = "none";
  //       }
  //     }
           
     
  //     for (i = 0; i < li.length; i++){           
  //       contactName = li[i];            
  //       txtValue = contactName.querySelector("h5").innerText;                   
  //       if (txtValue.toUpperCase().indexOf(filter) > -1) {
  //         li[i].style.display = "";
  //       } else {
  //         li[i].style.display = "none";
  //       }
  //       }     
  //     }

     //Search contact on contactModalList
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
        txtValue = contactName.querySelector("h5").innerText;                   
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          li[i].style.display = "";
        } else {
          li[i].style.display = "none";
        }
        }     
      }
    