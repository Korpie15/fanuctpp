import * as vscode from 'vscode';

export class CallDefinitionProvider implements vscode.DefinitionProvider {
    async provideDefinition(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken
    ): Promise<vscode.Location | vscode.Location[] | null> {
        const range = document.getWordRangeAtPosition(position, /\bCALL\s+(\w+)|\bRUN\s+(\w+)/);
        if (range) {
            const word = document.getText(range);
            const programNameMatch = word.match(/\bCALL\s+(\w+)|\bRUN\s+(\w+)/);
            if (programNameMatch) {
                const programName = programNameMatch[1] || programNameMatch[2];
                const searchPattern = `**/${programName}.ls`;

                const matchingFiles = await vscode.workspace.findFiles(searchPattern, '**/node_modules/**', 1);

                if (matchingFiles.length > 0) {
                    const targetUri = matchingFiles[0];
                    return new vscode.Location(targetUri, new vscode.Position(0, 0));
                } else {
                    vscode.window.showErrorMessage(`Program '${programName}.ls' not found in workspace.`);
                }
            }
        }
        return null;
    }
}
