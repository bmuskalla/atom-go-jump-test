'use babel';

import { CompositeDisposable } from 'atom';
import {isValidEditor, openFile} from './utils'
import path from 'path'
import fs from 'fs'

export default {
  subscriptions: null,

  activate(state) {
    this.subscriptions = new CompositeDisposable();

    this.subscriptions.add(atom.commands.add('atom-text-editor', {
      'atom-go-jump-test:jump': () => this.jump()
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },


  jump() {
    const editor = atom.workspace.getActiveTextEditor()
    if (!isValidEditor(editor)) {
      return
    }

    const cursor = editor.getCursorBufferPosition()
    const currentFile = editor.getPath()
    const cwd = path.dirname(editor.getPath())
    var filename = path.basename(currentFile, ".go")
    const jumpSource = filename.endsWith("_test") ? "test" : "prod"
    if(jumpSource == "test") {
      filename = filename.substring(0, filename.length - 5);
    }
    var otherFile = this.findCorrespondingFile(cwd, filename, currentFile)
    if(otherFile == undefined) {
      if(jumpSource == "test") {
        otherFile = filename + ".go"
      } else {
        otherFile = filename + "_test.go"
      }
      otherFile = path.join(cwd, otherFile)
    }
    if(!fs.existsSync(otherFile)) {
      fs.writeFileSync(otherFile, "")
    }
    return openFile(otherFile)
  },

  findCorrespondingFile(workingDirectory, filename, fullFilename) {
    files = fs.readdirSync(workingDirectory)
    found = files.find(file => file.endsWith(".go") && file.startsWith(filename) && !fullFilename.endsWith(file))
    if(found == undefined) {
        return undefined
    }
    return path.join(workingDirectory, found);
  }

};
