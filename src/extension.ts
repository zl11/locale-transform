// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { localeTransform } from "./bin";
import { hoverProvider } from "./bin/hover";
import { MyDefinitionProvider } from "./bin/jump2lang";
import { provideCompletionItems } from './bin/provideCompletionItems'

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "locale-transform" is now active!'
  );

  let localeTransformCommand = vscode.commands.registerCommand(
    "locale-transform.transform",
    (context) => {
      localeTransform(context);
    }
  );
  context.subscriptions.push(localeTransformCommand);

  let hover = vscode.languages.registerHoverProvider(
    { scheme: "file" }, {
    provideHover: hoverProvider,
  });

  context.subscriptions.push(hover);

  let complete = vscode.languages.registerCompletionItemProvider(
    { scheme: 'file' },
    {
      provideCompletionItems
    },
    '.'
  );
  
  context.subscriptions.push(complete);

  context.subscriptions.push(
    vscode.languages.registerDefinitionProvider(
      { scheme: 'file' }, 
      new MyDefinitionProvider()
    )
  )

}

// this method is called when your extension is deactivated
export function deactivate() {}
