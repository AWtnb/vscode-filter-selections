import * as vscode from "vscode";

const shrinkSelection = (sel: vscode.Selection): vscode.Selection => {
  return new vscode.Selection(sel.anchor, sel.anchor);
};

const filterByPosition = (editor: vscode.TextEditor, upward: boolean = true) => {
  if (editor.selections.length < 2) {
    return;
  }

  // index 0 of Selections seems to be the position just before starting multi-cursor-mode.
  const origin = editor.selections[0];

  editor.selections = editor.selections.map((sel) => {
    if (sel.isEmpty) {
      return sel;
    }
    if (upward) {
      if (sel.end.line == origin.end.line) {
        if (sel.end.character <= origin.end.character) {
          return sel;
        }
        return shrinkSelection(sel);
      }
      if (sel.end.line < origin.end.line) {
        return sel;
      }
      return shrinkSelection(sel);
    }
    if (origin.start.line == sel.start.line) {
      if (origin.start.character <= sel.start.character) {
        return sel;
      }
      return shrinkSelection(sel);
    }
    if (origin.start.line < sel.start.line) {
      return sel;
    }
    return shrinkSelection(sel);
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
      editor.selections = editor.selections.map((sel) => {
        const line = editor.document.lineAt(sel.active).text;
        const isMatch = reg.test(line);
        if (exclusive) {
          if (isMatch) {
            return shrinkSelection(sel);
          }
          return sel;
        }
        if (isMatch) {
          return sel;
        }
        return shrinkSelection(sel);
      });
    });
  Promise.resolve(filterProcess).catch((reason) => {
    vscode.window.showErrorMessage("filter-selections: " + reason.message);
  });
};

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

  const config = vscode.workspace.getConfiguration("filter-selections");
  const caseSensitive: boolean = config.get("caseSensitive") || false;
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
