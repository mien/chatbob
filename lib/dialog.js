'use strict';
const EventEmitter = require('events');
const _ = require('lodash');

class Dialog extends EventEmitter {
  constructor(params) {
    super()
    if (_.isNil(params.name)) {
      throw new Error('Dialog name is required')
    }
    this.name = params.name;
    this.args = params.args || null;
    this._currentQuestionIndex = params.currentQuestion || 0;
    this.dialogData = {}; // data stored specific to this dialog
    this.questions = []; // questions // to be asked
    this.waiting = false // Thread is waiting when it asked for a question
    this.trigger_pattern = params.trigger_pattern;
  }

  resetState() {
    let resetStateData = {
      'currentQuestion': 0,
      'dialogData': null
    }
    this.restoreState(resetStateData);
  }

  getState() {
    return {
      'dialogData': this.dialogData,
      'name': this.name,
      'currentQuestion': this._currentQuestionIndex
    }
  }

  restoreState(stateData) {
    this.dialogData = stateData.dialogData;
    this._currentQuestionIndex = stateData.currentQuestion;
  }

  setTrigger(pattern) {
    this.trigger_pattern = pattern;
  }

  getTrigger() {
    return this.trigger_pattern;
  }

  isDialogDone() {
    return this._currentQuestionIndex >= this.questions.length;
  }

  getCurrentQuestion() {
    return this.questions[this._currentQuestionIndex];
  }

  incCurrentQuestion() {
    return this._currentQuestionIndex += 1;
  }

  /**
   * add quesition to queue of questions to be asked
   * @param {String} text    question to asked
   * @param {String} key     response to the quesition will be stored in this
   *                         key and when the thread is finished final response
   *                         will be be json with this key
   * @param {callback} handler called with the user responses
   */
  addQuestion(text, handler) {
    this.questions.push({
      'text': text,
      'handler': handler
    })
  }

  getNextQuestion() {
    if (this.isDialogDone()) {
      console.log('End of dialog %s', this.name);
      //TODO : end the dialog here
      this.emit('end', {
        'response': this.dialogData,
        'name': this.name
      })
    } else {
      return this.questions[this._currentQuestionIndex];
    }
  }

  handle(ctx, msg, cb) {
    this.getCurrentQuestion()
      .handler(ctx, msg, (err) => {
        if (err) {
          //handle error
          console.log('Validation err', err);
        } else {
          this.incCurrentQuestion();
          cb()
        }
      })
  }

  repeat() {
    this._currentQuestionIndex -= 1
  }

  restart() {
    this._currentQuestionIndex = 0
  }

  end() {
    this._currentQuestionIndex = this.questions.length;
  }
  endWithReponse(response) {}
}

module.exports = Dialog
