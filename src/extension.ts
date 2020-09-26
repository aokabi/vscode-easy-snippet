// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { readFile, readFileSync, writeFile } from 'fs';
import { stringify } from 'querystring';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Extension "snippet-add-easy" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	// let disposable = vscode.commands.registerCommand('extension.helloWorld', () => {
	// 	// The code you place here will be executed every time your command is executed

	// 	// Display a message box to the user
	// 	vscode.window.showInformationMessage('Hello World!');
	// });
	const addSnippet = () => {
		let editor = vscode.window.activeTextEditor;
		if (editor === undefined) { return; }
		/*let thenable = editor.edit((editBuilder: vscode.TextEditorEdit) => {
			editBuilder.insert(new vscode.Position(2, 0), "insert text");
		});*/
		vscode.window.showInformationMessage(editor.document.languageId);
		let selectedText = editor.document.getText(editor.selection);
		//頑張ってsnippetの形にする
		let snippetFilePath = process.env.APPDATA + "\\Code\\User\\snippets\\" + editor.document.languageId + ".json";
		console.log(snippetFilePath);
		//snippetFilePathがあるかどうか確認したほうが良さそう
		vscode.commands.executeCommand("vscode.open", vscode.Uri.file(snippetFilePath));
		//中身jsonだからいい感じに追加できそうな気がしてきた
		let snippet = readFileSync(vscode.Uri.file(snippetFilePath).fsPath).toString();
		if (snippet.length === 0) {
			snippet = "{}";
		}
		let snippetObj = JSON.parse(snippet.toString());
		snippetObj.title = new Snippet(selectedText.split("\r\n"));
		let snippetString = JSON.stringify(snippetObj, null, "\t");
		writeFile(vscode.Uri.file(snippetFilePath).fsPath, snippetString, () => { });
	};
	let disposable2 = vscode.commands.registerCommand('extension.addSnippet', addSnippet);
	// context.subscriptions.push(disposable);
	context.subscriptions.push(disposable2);
}

// this method is called when your extension is deactivated
export function deactivate() {
	console.log("deactivate");
}

class Snippet {
	prefix: string = "default prefix";
	body: Array<string>;
	description: string = "";
	constructor(body: Array<string>) {
		this.body = body;
	}
} 
