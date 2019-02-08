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
    return "Share you number or customer id?"
  }

  if (text.includes("new")) {
    return "Please share your name?"
  }
}

function getEnquiredDetails() {
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
  xhttp.open("POST", "http://192.168.27.58/api/GetEnquiryByCustomer?input=9003567895", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send();
}

function updateEnquiryDetails(jsonObj) {
    if (jsonObj["status"] == 1) {
      console.log(jsonObj["data"])
      var enquiryDetails = jsonObj["data"]
      if (enquiryDetails.length == 1) {
        var textMsg = `Your latest enquiry id is ${enquiryDetails[0]['EnquiryNo']}. Currently status is ${enquiryDetails[0]['Status']}`
        addBotItem(textMsg)
        var msg = new SpeechSynthesisUtterance(textMsg);
        msg.addEventListener("end", function(ev) {
          startListening();
        });
        msg.addEventListener("error", function(ev) {
          startListening();
        });
        window.speechSynthesis.speak(msg);
      }
    }
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
  var newConnection = ["NAME", "LOCATION CODE", "EMAIL ID", "CONTACT NUMEBR", "ALTERNATE NUMBER"];

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
    console.log(recognizedText)
    addUserItem(recognizedText);
    ga('send', 'event', 'Message', 'add', 'user');

    if (customerTypeKnown == false) {
      console.log("FIRST TIME")
      selectedType = getCustomerType(recognizedText)
      if (selectedType > 0) {
        customerTypeKnown = true
      }
      handleTopMessages(recognizedText)
    } else {
      console.log("SECOND SETS")
      var textMsg = "";
      if (selectedType == 1) {
        //textMsg = "Please wait while checking...";
        getEnquiredDetails();
        return false
      } else if(selectedType == 2) {
        currentStepID++;
        if (currentStepID < newConnection.length) {
          textMsg = newConnection[currentStepID];
        } else {
          textMsg = "API will be called to submit the details";
        }
      } else {
        currentStepID = 0
        textMsg = "No details available. Please re-try another from starting...";
      }
      // Set a timer just in case. so if there was an error speaking or whatever, there will at least be a prompt to continue
      var timer = window.setTimeout(function() { startListening(); }, 5000);
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

    function handleTopMessages(text) {
      // Set a timer just in case. so if there was an error speaking or whatever, there will at least be a prompt to continue
      var timer = window.setTimeout(function() { startListening(); }, 5000);

      var textMsg = getCustomerTopQuestion(text);
      var msg = new SpeechSynthesisUtterance(textMsg);
      addBotItem(textMsg);
      ga('send', 'event', 'Message', 'add', 'bot');
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

    /*let promise = apiClient.textRequest(recognizedText);

    promise
        .then(handleResponse)
        .catch(handleError);

    function handleResponse(serverResponse) {

      // Set a timer just in case. so if there was an error speaking or whatever, there will at least be a prompt to continue
      var timer = window.setTimeout(function() { startListening(); }, 5000);

      const speech =  "Please share your customer id or primary contact number?"//serverResponse["result"]["fulfillment"]["speech"];
      var msg = new SpeechSynthesisUtterance(speech);
      addBotItem(speech);
      ga('send', 'event', 'Message', 'add', 'bot');
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
    function handleError(serverError) {
      console.log("Error from api.ai server: ", serverError);
    } */
  };

  recognition.onerror = function(ev) {
    console.log("Speech recognition error", ev);
  };
  recognition.onend = function() {
    gotoReadyState();
  };

  function startListening() {
    gotoListeningState();
    recognition.start();
  }

  const startButton = document.querySelector("#start");
  startButton.addEventListener("click", function(ev) {
    ga('send', 'event', 'Button', 'click');
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
