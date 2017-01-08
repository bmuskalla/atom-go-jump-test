'use babel';

import AtomGoJumpTest from '../lib/atom-go-jump-test';
import {openFile} from '../lib/utils'
import temp from 'temp'
import path from 'path'
import fs from 'fs'

describe('AtomGoJumpTest', () => {
  let workspaceElement, activationPromise;

  beforeEach(() => {
    workspaceElement = atom.views.getView(atom.workspace);
    activationPromise = atom.packages.activatePackage('atom-go-jump-test');
    temp.track();
  });

  describe('when the atom-go-jump-test:jump event is triggered', () => {
    it('jumps from a go source file to corresponding go test file', () => {
      createTestProjectAndOpenEditor("code.go")

      runs(() => {
        let editor = atom.workspace.getActiveTextEditor()
        expect(path.basename(editor.getPath())).toEqual("code.go")
        editor.getGrammar().scopeName = 'source.go'

        atom.commands.dispatch(atom.views.getView(editor), 'atom-go-jump-test:jump')
      });

      waitForEditorToOpen()

      runs(() => {
        editor = atom.workspace.getActiveTextEditor()
        expect(path.basename(editor.getPath())).toEqual("code_test.go")
      });

    });

    it('jumps from a go test file to corresponding go source file', () => {
      createTestProjectAndOpenEditor("code_test.go")

      runs(() => {
        let editor = atom.workspace.getActiveTextEditor()
        expect(path.basename(editor.getPath())).toEqual("code_test.go")
        editor.getGrammar().scopeName = 'source.go'

        atom.commands.dispatch(atom.views.getView(editor), 'atom-go-jump-test:jump')
      });

      waitForEditorToOpen()

      runs(() => {
        editor = atom.workspace.getActiveTextEditor()
        expect(path.basename(editor.getPath())).toEqual("code.go")
      });

    });
  });

  function waitForEditorToOpen() {
    waitsFor(() => {
      return atom.workspace.getTextEditors().length > 1
    })
  }

  function createTestProjectAndOpenEditor(filename) {
    dirPath = temp.mkdirSync('goproject')
    const goFile = path.join(dirPath, 'code.go')
    const goTestFile = path.join(dirPath, 'code_test.go')
    fs.writeFile(goFile, "prod")
    fs.writeFile(goTestFile, "test")
    waitsForPromise(() => {
      return openFile(path.join(dirPath, filename));
    });
  }

});
