/*
 * Input Manager for desktop and mobile browsers
 */

function KeyboardInputManager() {
  this.events = {};
  this.listen();
  mainMenuVisible = true;
}

KeyboardInputManager.prototype.on = function (event, callback) {
  if (!this.events[event]) {
    this.events[event] = [];
  }
  this.events[event].push(callback);
};

KeyboardInputManager.prototype.emit = function (event, data) {
  devdebug("Emit event '" + event + (data ?  ("': " + JSON.stringify(data)) : ""));
  var callbacks = this.events[event];
  if (callbacks) {
    callbacks.forEach(function (callback) {
      callback(data);
    });
  }
};

KeyboardInputManager.prototype.bindButtonPress = function (selector, fn) {
  var button = document.querySelector(selector);
  button.addEventListener("click", fn.bind(this));
  button.addEventListener(this.eventTouchend, fn.bind(this));
};

KeyboardInputManager.prototype.listen = function(){
  var colorSaveOption        = document.getElementById("cbsavecolor");
  var languageSelection      = document.querySelector(".ln-selection");
  var questionnaireSelection = document.querySelector(".questionnaires-selection");

  languageSelection.addEventListener("change",      this.selectTranslation.bind(this));
  colorSaveOption.addEventListener("change",        this.setOption.bind(this));
  questionnaireSelection.addEventListener("change", this.selectQuestionnaire.bind(this));

  this.bindButtonPress(".button-random",      this.newQuestion);
  this.bindButtonPress(".button-menu",        this.showMenu);
  this.bindButtonPress(".button-start",       this.showQuestion);
  this.bindButtonPress(".button-description", this.showModal);
  this.bindButtonPress(".modal-close",        this.closeModal);

  this.bindButtonPress(".button-newcolor",  this.newColor);
  this.bindButtonPress(".button-reset",     this.resetApplicationManager);

};

KeyboardInputManager.prototype.selectTranslation = function(event){
  var ln = event.target.value;
  this.emit("translateUI", ln);
};

KeyboardInputManager.prototype.selectQuestionnaire = function(event) {
  var questionnaire = event.target.value;
  this.emit("selectQuestionnaire", questionnaire);
};

KeyboardInputManager.prototype.newQuestion = function(event){
  event.preventDefault();
  this.emit("newQuestion");
};

KeyboardInputManager.prototype.showMenu = function(event){
  event.preventDefault();
  mainMenuVisible = true;
  this.emit("showMenu");
};

KeyboardInputManager.prototype.showQuestion = function(event){
  event.preventDefault();
  mainMenuVisible = false;
  this.emit("showQuestion");
};

KeyboardInputManager.prototype.showModal = function(event){
  mainMenuVisible = false;
};

KeyboardInputManager.prototype.closeModal = function(event){
  mainMenuVisible = true;
};

KeyboardInputManager.prototype.newColor = function(event){
  event.preventDefault();
  this.emit("newColor");
};

KeyboardInputManager.prototype.setOption = function(event){
  var data = {};
  data.type   = "saveColor";
  data.value  = event.target.checked;
  event.preventDefault();
  this.emit("setOption", data);
};

KeyboardInputManager.prototype.resetApplicationManager = function(event){
  event.preventDefault();
  this.emit("resetApplicationManager");
};
