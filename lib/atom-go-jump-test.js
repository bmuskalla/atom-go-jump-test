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
    // TODO: replace with getEditor?
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
    fs.readdir(cwd, (err, files) => {
      files.forEach(file => {
        console.log(currentFile);
        if(file.endsWith(".go") && file.startsWith(filename) && !currentFile.endsWith(file)) {
          console.log("opened " + file);
          return openFile(path.join(cwd, file))
        }
      });
    })
  }

};
