"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const bin_1 = require("./bin");
const hover_1 = require("./bin/hover");
const jump2lang_1 = require("./bin/jump2lang");
const provideCompletionItems_1 = require("./bin/provideCompletionItems");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "locale-transform" is now active!');
    let localeTransformCommand = vscode.commands.registerCommand("locale-transform.transform", (context) => {
        (0, bin_1.localeTransform)(context);
    });
    context.subscriptions.push(localeTransformCommand);
    let hover = vscode.languages.registerHoverProvider({ scheme: "file" }, {
        provideHover: hover_1.hoverProvider,
    });
    context.subscriptions.push(hover);
    let complete = vscode.languages.registerCompletionItemProvider({ scheme: 'file' }, {
        provideCompletionItems: provideCompletionItems_1.provideCompletionItems
    }, '.');
    context.subscriptions.push(complete);
    context.subscriptions.push(vscode.languages.registerDefinitionProvider({ scheme: 'file' }, new jump2lang_1.MyDefinitionProvider()));
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map