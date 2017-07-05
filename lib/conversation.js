'use strict';
const mm = require('micromatch');
const _ = require('lodash');
const Message = require('./message');

class Conversation {
  constructor(params) {
    this._dialogsLibrary = {}; // dialog id to dialog mapping
    this._dialogsPatterns = {}; // dialog trigger pattern to dialog mapping
    this._dialogStack = []; // conversation dialog stack
    this._currentDialog = null;
    this.connector = params.connector;
    this.userObj = params.userObj;
    this.defaultDialog = params.defaultDialog; // greeting dialog
    if (params.dialogs) {
      this.addDialogs(params.dialogs)
    }
  }

  sendMessage(text) {
    let reply_msg = new Message(this.msg);
    reply_msg.setUser(this.userObj);
    reply_msg.text = text;
    this.connector.postMessage(reply_msg);
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
      this.defaultDialog.resetState();
      this._currentDialog = this.defaultDialog;
    } else if (name) {
      this._dialogsLibrary[name].resetState();
      this._currentDialog = this._dialogsLibrary[name];
    }
    return this._currentDialog;
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
    return this.getDialogStack().length == 0;
  }

  getCurrentDialog() {
    console.log('dialog stack length %s', this.getDialogStack().length)
    if (!this.isDialogStackEmpty()) {
      return this._currentDialog;
    } else {
      console.log('Dialog stack is empty');
      return null
    }
  }

  pushDialog(dialog) {
    this._dialogStack.push(dialog.getState());
  }

  popDailog() {
    let prevDialogState = this._dialogStack.pop();
    if (prevDialogState) {
      let prevDialog = this._dialogsLibrary[prevDialogState.name]
      prevDialog.restoreState(prevDialogState);
      this._currentDialog = prevDialog;
      return this._currentDialog;
    } else {
      this._currentDialog = null;
      return null;
    }
  }

  /**
   * switch conversation from on dialog to another
   * @param  {String} name    name of new dialog
   * @param  {Boolean} restart should dialog be resumed or restarted
   * @return {None}
   */
  switchTo(name, args, restart) {
    console.log('Switching to dialog : ' + name)
    this._nextDialog = {
      'name': name,
      'args': args
    }
  }

  dialogNextHandler(isFresh) {
    let currentDialog = this.getCurrentDialog();
    if (this._nextDialog) {
      this.pushDialog(currentDialog);
      currentDialog = this.createDialog(this._nextDialog.name)
      currentDialog.args = this._nextDialog.args;
      this._nextDialog = null;
    }
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
      console.log('User dialog stack is empty')
      //if no dialog is going on the search for matching msg
      let dialog = this.searchDailog(msg.text);
      if (!dialog) {
        console.log('No dialog found from user interaction. starting default dialog.')
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
      let dialogName = matchingDailog[Object.keys(matchingDailog)[0]]
      console.log('found %s matches for %s', dialogName, searchPattern)
      return this.createDialog(dialogName);
    } else {
      // TODO: should we emit event telling we can't handle this
      return null;
    }
  }
}
module.exports = Conversation
