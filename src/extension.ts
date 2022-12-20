import * as vscode from "vscode";

const filterByPosition = (editor: vscode.TextEditor, upward: boolean = true) => {
  if (editor.selections.length < 2) {
    return;
  }

  // index 0 of Selections seems to be the position just before starting multi-cursor-mode.
  const origin = editor.selections[0];

  editor.selections = editor.selections.filter((sel) => {
    if (upward) {
      if (sel.end.line == origin.end.line) {
        return sel.end.character <= origin.end.character;
      }
      return sel.end.line < origin.end.line;
    }
    if (origin.start.line == sel.start.line) {
      return origin.start.line <= sel.start.line;
    }
    return origin.start.line < sel.start.line;
  });
};

const filterByRegExp = (editor: vscode.TextEditor, caseSensitive: boolean = true, exclusive: boolean = false) => {
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
const caseSensitive: boolean = config.get("caseSensitive") || false;

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand("filter-selections.filter-upward", (editor: vscode.TextEditor) => {
      filterByPosition(editor, true);
    })
  );
  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand("filter-selections.filter-downward", (editor: vscode.TextEditor) => {
      filterByPosition(editor, false);
    })
  );
  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand("filter-selections.filter-inclusive", (editor: vscode.TextEditor) => {
      filterByRegExp(editor, caseSensitive, false);
    })
  );
  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand("filter-selections.filter-exclusive", (editor: vscode.TextEditor) => {
      filterByRegExp(editor, caseSensitive, true);
    })
  );
}

export function deactivate() {}
