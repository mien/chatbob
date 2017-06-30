'use strict';
const mm = require('micromatch');
const _ = require('lodash');

class Conversation {
  constructor(params) {
    this._dialogsLibrary = {}; // dialog id to dialog mapping
    this._dialogsPatterns = {}; // dialog trigger pattern to dialog mapping
    this._dialogStack = []; // conversation dialog stack
    this.connector = params.connector;
    this.defaultDialog = params.defaultDialog; // greeting dialog
    if (params.dialogs) {
      this.addDialogs(params.dialogs)
    }
  }

  sendMessage(text) {
    this.connector.postMessage(this.msg.channel_id, text);
  }

  beginDialog(name) {
    this.switchTo(name);
  }

  restoreState(stateData) {
    this._dialogStack = stateData;
  }

  getState() {
    return this._dialogStack;
  }

  endDialog() {
    this.popDailog();
  }

  /**
   * create new dialog copy of the dialog given
   * @param  {String} name name of dialog to create copy of
   * @return {Dialog}      clone instance of the dialog
   */
  createDialog(name) {
    if (name == 'default') {
      return _.cloneDeep(this.defaultDialog)
    } else if (name) {
      return _.cloneDeep(this._dialogsLibrary[name])
    }
  }

  setDefaultDialog(dialog) {
    this.defaultDialog = dialog;
  }

  addDialogs(dialogs) {
    dialogs.forEach(dialog => this.addDialog(dialog))
  }

  addDialog(dialog) {
    if (dialog.getTrigger()) {
      this._dialogsPatterns[dialog.getTrigger()] = dialog.name;
    }
    this._dialogsLibrary[dialog.name] = dialog;
  }

  getDialogStack() {
    return this._dialogStack;
  }

  isDialogStackEmpty() {
    return this.getDialogStack().length == 0
  }

  getCurrentDialog() {
    console.log('dialog stack length %s', this.getDialogStack().length)
    if (!this.isDialogStackEmpty()) {
      return this.getDialogStack()[this.getDialogStack().length - 1];
    } else {
      console.log('Dialog stack is empty');
      null
    }
  }
  
  pushDialog(dialog) {
    this._dialogStack.push(dialog);
  }

  popDailog() {
    this._dialogStack.pop();
  }

  /**
   * switch conversation from on dialog to another
   * @param  {String} name    name of new dialog
   * @param  {Boolean} restart should dialog be resumed or restarted
   * @return {None}
   */
  switchTo(name, restart) {
    console.log('Switching to dialog : ' + name)
    this.pushDialog(this.createDialog(name));
  }

  dialogNextHandler(isFresh) {
    let currentDialog = this.getCurrentDialog();
    if (currentDialog) {
      this.respondBack(currentDialog)
      console.log('Dialog %s done %s', currentDialog.name, currentDialog.isDialogDone())
      if (currentDialog.isDialogDone()) {
        this.popDailog();
        this.dialogNextHandler(true);
      }
    } else {
      console.log('No more dialog in stack to deal with')
    }
  }

  resumeDialog() {}

  respondBack(dialog) {
    let nextQuestion = dialog.getNextQuestion();
    if (nextQuestion) {
      // keep the chain of quesitons running
      this.sendMessage(nextQuestion.text);
    } else {
      // end of the chain on one dialog
      // pop prev dialog and continue from there
    }
  }

  onMessage(msg) {
    this.msg = msg;
    if (this.isDialogStackEmpty()) {
      //if no dialog is going on the search for matching msg
      let dialog = this.searchDailog(msg.text);
      if (!dialog) {
        console.log('No dialog found from user interaction')
        dialog = this.createDialog('default');
      }
      this.pushDialog(dialog)
      this.respondBack(dialog)
    } else {
      // in case we already have a dialog going on
      let currentDailog = this.getCurrentDialog();
      currentDailog.handle(this, msg, this.dialogNextHandler.bind(this));
    }
  }
  searchDailog(searchPattern) {
    const matchingDailog = mm.matchKeys(this._dialogsPatterns, searchPattern);
    if (Object.keys(matchingDailog).length > 0) {
      console.log('found %s matches for %s', Object.keys(matchingDailog).length, searchPattern)
      return this.createDialog(matchingDailog[Object.keys(matchingDailog)[0]]);
    } else {
      // TODO: should we emit event telling we can handle this
      return null;
    }
  }
}
module.exports = Conversation
