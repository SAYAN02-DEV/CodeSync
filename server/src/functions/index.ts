
type FileTreeItem = {
    id: string;
    name: string;
    type: 'file' | 'folder';
    lang?: string;
    isOpen?: boolean;
    children?: FileTreeItem[];
};

const extensionLanguageMap: Record<string, string> = {
    js: 'javascript',
    jsx: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',
    json: 'json',
    css: 'css',
    scss: 'scss',
    md: 'markdown',
    html: 'html'
};

function pathSplitter(path: string): string[] {
    return path.split('/').filter(Boolean);
}

function inferLanguage(filename: string): string | undefined {
    const parts = filename.split('.');
    if (parts.length < 2) {
        return undefined;
    }

    const extension = parts.pop();
    if (!extension) {
        return undefined;
    }

    return extensionLanguageMap[extension.toLowerCase()];
}

function childrenMaker(paths: string[]): FileTreeItem[] {
    const tree: FileTreeItem[] = [];
    let idCounter = 1;

    paths.forEach((path) => {
        const segments = pathSplitter(path);
        if (segments.length === 0) {
            return;
        }

        let currentLevel = tree;

        segments.forEach((segment, index) => {
            const isLast = index === segments.length - 1;

            if (isLast) {
                const existingFile = currentLevel.find(
                    (item) => item.type === 'file' && item.name === segment
                );

                if (!existingFile) {
                    const lang = inferLanguage(segment);
                    currentLevel.push({
                        id: String(idCounter++),
                        name: segment,
                        type: 'file',
                        ...(lang ? { lang } : {})
                    });
                }
                return;
            }

            let folder = currentLevel.find(
                (item) => item.type === 'folder' && item.name === segment
            );

            if (!folder) {
                folder = {
                    id: String(idCounter++),
                    name: segment,
                    type: 'folder',
                    isOpen: index === 0,
                    children: []
                };
                currentLevel.push(folder);
            }

            if (!folder.children) {
                folder.children = [];
            }

            currentLevel = folder.children;
        });
    });

    return tree;
}

export { pathSplitter, childrenMaker, type FileTreeItem };