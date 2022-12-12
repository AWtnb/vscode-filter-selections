import * as vscode from "vscode";

const filterSelections = (editor: vscode.TextEditor, caseSensitive: boolean = true, exclusive: boolean = false) => {
  if (editor.selections.length < 2) {
    return;
  }
  const filterProcess = vscode.window
    .showInputBox({
      title: caseSensitive ? "filter-line (case-sensitive)" : "filter-line (ignore-case)",
      prompt: exclusive ? "Selection on lines that matches the specified regular expression will be unselected." : "Selections on lines that do not match the specified regular expression will be unselected.",
    })
    .then((query: string | undefined) => {
      if (!query) {
        return;
      }
	  const opt = caseSensitive ? "" : "i";
      const reg = new RegExp(query, opt);
      editor.selections = editor.selections.filter((sel) => {
        const line = editor.document.lineAt(sel.active).text;
        const isMatch = reg.test(line);
        if (exclusive) {
          return !isMatch;
        }
        return isMatch;
      });
    });
  Promise.resolve(filterProcess).catch((reason) => {
    vscode.window.showErrorMessage("filter-selections: " + reason.message);
  });
};

const config = vscode.workspace.getConfiguration("filter-selections");
const caseSensitive:boolean = config.get("caseSensitive") || false;

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand("filter-selections.filter-inclusive", (editor: vscode.TextEditor) => {
      filterSelections(editor, caseSensitive, false);
    })
  );
  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand("filter-selections.filter-exclusive", (editor: vscode.TextEditor) => {
      filterSelections(editor, caseSensitive, true);
    })
  );
}

export function deactivate() {}
