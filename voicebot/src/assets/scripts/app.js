function isChrome() {
  var isChromium = window.chrome,
    winNav = window.navigator,
    vendorName = winNav.vendor,
    isOpera = winNav.userAgent.indexOf("OPR") > -1,
    isIEedge = winNav.userAgent.indexOf("Edge") > -1,
    isIOSChrome = winNav.userAgent.match("CriOS");

  if(isIOSChrome){
    return true;
  } else if(isChromium !== null && isChromium !== undefined && vendorName === "Google Inc." && isOpera == false && isIEedge == false) {
    return true;
  } else {
    return false;
  }
}

function gotoListeningState() {
  const micListening = document.querySelector(".mic .listening");
  const micReady = document.querySelector(".mic .ready");

  micListening.style.display = "block";
  micReady.style.display = "none";
}

function gotoReadyState() {
  const micListening = document.querySelector(".mic .listening");
  const micReady = document.querySelector(".mic .ready");

  micListening.style.display = "none";
  micReady.style.display = "block";
}

function addBotItem(text) {
  const appContent = document.querySelector(".app-content");
  appContent.innerHTML += '<div class="item-container item-container-bot"><div class="item"><p>' + text + '</p></div></div>';
  appContent.scrollTop = appContent.scrollHeight; // scroll to bottom
}

function addUserItem(text) {
  const appContent = document.querySelector(".app-content");
  appContent.innerHTML += '<div class="item-container item-container-user"><div class="item"><p>' + text + '</p></div></div>';
  appContent.scrollTop = appContent.scrollHeight; // scroll to bottom
}

function displayCurrentTime() {
  const timeContent = document.querySelector(".time-indicator-content");
  const d = new Date();
  const s = d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  timeContent.innerHTML = s;
}

function addError(text) {
  addBotItem(text);
  const footer = document.querySelector(".app-footer");
  footer.style.display = "none";
}

function getCustomerType(text) {
  if (text.includes("existing")) {
    return 1
  }

  if (text.includes("new")) {
    return 2
  }

  return 0
}

function getCustomerTopQuestion(text) {
  if (text.includes("existing")) {
    return "Share you number or customer id or enquiry reference number?"
  }

  if (text.includes("new")) {
    return "Please share your name?"
  }

  return "Invalid option!!! Please share existing query or new query?";
}

function updateFeedback(jsonObj) {
  if (jsonObj["status"] == 1) {
    var postModel = {
      "Rating" : 4,
      "FeedBack" : "YES",
      "EnquiryNo" : jsonObj["data"]["Enquiry"]["EnquiryNo"]
    }
    var jsonStr = JSON.stringify(postModel);
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", `http://192.168.27.58/api/UpdateFeedback`, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(jsonStr);
  }
}


function sendEmail(jsonObj) {
  if (jsonObj["status"] == 1) {
    var postModel = {
      "UserName" : jsonObj["data"]["Customer"]["CustomerName"],
      "EmailId" : jsonObj["data"]["Customer"]["EmailId"],
      "EnquiryNo" : jsonObj["data"]["Enquiry"]["EnquiryNo"]
    }
    var jsonStr = JSON.stringify(postModel);
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", `http://192.168.27.58/api/SendEmailNotification`, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(jsonStr);
  }
}

function getEnquiredDetails(searchQuery) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log(this.responseText)
       var jsonObj = JSON.parse(this.responseText)
       console.log(jsonObj)
       updateEnquiryDetails(jsonObj)
    } else {
      console.log("FAILED");
    }
  };
  xhttp.open("POST", `http://192.168.27.58/api/GetEnquiryByCustomer?input=${searchQuery.replace(/ /g, "")}`, true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send();
}

function submitConnectionDetails(formData) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log(this.responseText)
       var jsonObj = JSON.parse(this.responseText)
       console.log(jsonObj)
       updateNewConnectionDetails(jsonObj)
    } else {
      console.log("FAILED");
    }
  };

  var postModel = {
    "CustomerName" : formData["NAME"],
    "Location" : formData["LOCATION"],
    "Zipcode" : formData["ZIPCODE"].replace(/ /g, ""),
    "EmailId" : formData["EMAILID"].replace(/ /g, ""),
    "ContactNo" : formData["CONTACTNUMBER"].replace(/ /g, ""),
    "SecondaryNo" : formData["ALTNUMBER"].replace(/ /g, ""),
    "CallType" : formData["CALLTYPE"]
  }

  var jsonStr = JSON.stringify(postModel);
  console.log(jsonStr);
  xhttp.open("POST", `http://192.168.27.58/api/InsertCustomer`, true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(jsonStr);
}

function updateNewConnectionDetails(jsonObj) {
  var textMsg = "Invalid search!!! Please try again...";
  if (jsonObj["status"] == 1) {
    console.log(jsonObj["data"])
    var enquiryDetails = jsonObj["data"]
    textMsg = `Your enquiry has been successfully registered with reference number ${enquiryDetails['Enquiry']['EnquiryNo']}. Please use this number for future reference with respect to this issue.`;
  }
  addBotItem(textMsg)
  var msg = new SpeechSynthesisUtterance(textMsg);
  window.speechSynthesis.speak(msg);
  sendEmail(jsonObj)
}

function updateEnquiryDetails(jsonObj) {
    var textMsg = "Invalid search!!! Please try again...";
    if (jsonObj["status"] == 1) {
      console.log(jsonObj["data"])
      var enquiryDetails = jsonObj["data"]
      if (enquiryDetails != null ) {
        if (enquiryDetails.length == 1) {
          textMsg = `Hi ${jsonObj["msg"]}, Your latest enquiry id is ${enquiryDetails[0]['EnquiryNo']}. Currently status is ${enquiryDetails[0]['Status']}.`
          if (enquiryDetails[0]['Description'] != null) {
            textMsg += `<br/><br/> ${enquiryDetails[0]['Description']}`;
          }
          if (enquiryDetails[0]['Status'] == "Closed") {
            textMsg += "<br/><br/>This ticket has been closed recently. Would you like to share the feedback?";
          }   
        } else if (enquiryDetails.length > 1) {
          textMsg = `Hi ${jsonObj["msg"]}, You have multiple enquiries are available. <br/>`;
          for (var element in enquiryDetails) {
            textMsg += `Enquiry Id:  ${enquiryDetails[element]['EnquiryNo']} - Current status is ${enquiryDetails[element]['Status']} <br/>`
          }
        } else {
            textMsg = "Information not available. Please try again with correct Customer Id or Reference ID or Primary Contact Number."
        }
      } else {
            textMsg = "Information not available. Please try again with correct Customer Id or Reference ID or Primary Contact Number."
      }
    }
  
    addBotItem(textMsg)
    var msg = new SpeechSynthesisUtterance(textMsg);
    window.speechSynthesis.speak(msg);
}


document.addEventListener("DOMContentLoaded", function(event) {

  // test for relevant API-s
  // for (let api of ['speechSynthesis', 'webkitSpeechSynthesis', 'speechRecognition', 'webkitSpeechRecognition']) {
  //   console.log('api ' + api + " and if browser has it: " + (api in window));
  // }
  displayCurrentTime();

  // check for Chrome
  if (!isChrome()) {
    addError("This demo only works in Google Chrome.");
    return;
  }

  if (!('speechSynthesis' in window)) {
    addError("Your browser doesn’t support speech synthesis. This demo won’t work.");
    return;
  }

  if (!('webkitSpeechRecognition' in window)) {
    addError("Your browser cannot record voice. This demo won’t work.");
    return;
  }

  // Now we’ve established that the browser is Chrome with proper speech API-s.

  // api.ai client
  const apiClient = new ApiAi.ApiAiClient({accessToken: '329dcb8e2a8f4876acbf7fb616978686'});
  var userTypes = ["NEWCONNECTTION", "EXISTING"];
  var customerTypeKnown = false;
  var selectedType = 0;
  var currentStepID = 0;
  var existingConnecttion = ["GETID"];
  var newConnection = ["NAME", "LOCATION", "ZIPCODE", "EMAILID", "CONTACTNUMBER", "ALTNUMBER", "CALLTYPE"];
  var newData = {
    "NAME" : "",
    "LOCATION" : "",
    "ZIPCODE" : "",
    "EMAILID" : "",
    "CONTACTNUMBER" : "",
    "ALTNUMBER" : "",
    "CALLTYPE" : ""
  }

  var newMessages = {
    "NAME" : "Please tell your name?",
    "LOCATION" : "Please share your location?",
    "ZIPCODE" : "Please share your Zipcode?",
    "EMAILID" : "Please share your Email ID?",
    "CONTACTNUMBER" : "Please tell your contact number?",
    "ALTNUMBER" : "Please share your alternate number?",
    "CALLTYPE" : "Like to know about New connection or general enquiry?"
  }

  // Initial feedback message.
  var initialMessage = "Hi! Let me know type of enquiry its new or existing?";
  addBotItem(initialMessage);

  var recognition = new webkitSpeechRecognition();
  var recognizedText = null;
  recognition.continuous = false;
  recognition.onstart = function() {
    recognizedText = null;
  };
  recognition.onresult = function(ev) {
    recognizedText = ev["results"][0][0]["transcript"];
    addUserItem(recognizedText);
    //ga('send', 'event', 'Message', 'add', 'user');

    if (customerTypeKnown == false) {
      selectedType = getCustomerType(recognizedText)
      if (selectedType > 0) {
        customerTypeKnown = true
      }
      handleTopMessages(recognizedText)
    } else {
      var textMsg = "";
      if (selectedType == 1) {
        getEnquiredDetails(recognizedText);
        return false
      } else if(selectedType == 2) {
        newData[newConnection[currentStepID]] = recognizedText
        currentStepID++;
        if (currentStepID < newConnection.length) {
          textMsg = newMessages[newConnection[currentStepID]];
        } else {
          textMsg = "API will be called to submit the details"; 
          submitConnectionDetails(newData);
          return false
        }
      } else {
        currentStepID = 0
        textMsg = "No details available. Please re-try another from starting...";
      }
      
      generateMsgWithListener(textMsg, true)
    }

    function handleTopMessages(text) {
      var textMsg = getCustomerTopQuestion(text);
      generateMsgWithListener(textMsg, true)
    }
  };

  recognition.onerror = function(ev) {
    console.log("Speech recognition error", ev);
  };
  recognition.onend = function() {
    gotoReadyState();
  };

  function generateMsgWithListener(textMsg, withListener = false) {
    // Set a timer just in case. so if there was an error speaking or whatever, there will at least be a prompt to continue
    var timer = window.setTimeout(function() { startListening(); }, 3000);
    if (withListener == true) {
      window.clearTimeout(timer);
    }
    addBotItem(textMsg)
    var msg = new SpeechSynthesisUtterance(textMsg);
    msg.addEventListener("end", function(ev) {
      window.clearTimeout(timer);
      startListening();
    });
    msg.addEventListener("error", function(ev) {
      window.clearTimeout(timer);
      startListening();
    });
    window.speechSynthesis.speak(msg);
  }
  

  function startListening() {
    gotoListeningState();
    recognition.start();
  }

  const startButton = document.querySelector("#start");
  startButton.addEventListener("click", function(ev) {
    //ga('send', 'event', 'Button', 'click');
    startListening();
    ev.preventDefault();
  });

  // Esc key handler - cancel listening if pressed
  // http://stackoverflow.com/questions/3369593/how-to-detect-escape-key-press-with-javascript-or-jquery
  document.addEventListener("keydown", function(evt) {
    evt = evt || window.event;
    var isEscape = false;
    if ("key" in evt) {
        isEscape = (evt.key == "Escape" || evt.key == "Esc");
    } else {
        isEscape = (evt.keyCode == 27);
    }
    if (isEscape) {
        recognition.abort();
    }
  });


});
