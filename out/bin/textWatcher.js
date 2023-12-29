"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
vscode.window.onDidChangeTextEditorSelection(event => {
    let editor = vscode.window.activeTextEditor;
    let selection = editor.selection;
    let word = editor.document.getText(selection);
    let suggestions = [];
    console.log(word, '---', event);
});
//# sourceMappingURL=textWatcher.js.map