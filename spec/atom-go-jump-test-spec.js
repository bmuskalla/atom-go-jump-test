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
      projectPath = createTestProject()
      createBothFiles(projectPath)
      openEditor(projectPath, "code.go")

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
      projectPath = createTestProject()
      createBothFiles(projectPath)
      openEditor(projectPath, "code_test.go")


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

    it('creates the test file if it doesnt exist', () => {
      projectPath = createTestProject()
      createFileInProject(projectPath, "code.go")
      openEditor(projectPath, "code.go")

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

  });

  it('creates the code file if it doesnt exist', () => {
    projectPath = createTestProject()
    createFileInProject(projectPath, "code_test.go")
    openEditor(projectPath, "code_test.go")

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

  function waitForEditorToOpen() {
    waitsFor(() => {
      return atom.workspace.getTextEditors().length > 1
    })
  }

  function createTestProject(filename) {
    return temp.mkdirSync('goproject')
  }

  function openEditor(projectPath, filename) {
    waitsForPromise(() => {
      return openFile(path.join(projectPath, filename));
    });
  }

  function createFileInProject(projectPath, filename) {
    const file = path.join(projectPath, filename)
    fs.writeFile(file, "contents")
  }

  function createBothFiles(projectPath) {
    createFileInProject(projectPath, "code.go")
    createFileInProject(projectPath, "code_test.go")
  }

});
