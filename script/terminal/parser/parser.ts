export class Parser {

    async getFileData(path: string) {
        const response = await fetch(path);
        if (!response.ok) throw new Error("Failed to load the file:" + path);
        const data = await response.text();
        return data;
    }

    async parseFile(path: string): Promise<string> {
        const input = await this.getFileData(path);
        const lines = input.split('\n');

        let inCodeBlock: boolean = false;
        const parsedLines: string[] = [];

        for(const line of lines) {
            if (line.startsWith("```")) {
                if(!inCodeBlock) {
                    inCodeBlock = true;
                    parsedLines.push('<pre><code>');
                } else {
                    inCodeBlock = false;
                    parsedLines.push('</code></pre>');
                }
                continue;
            }

            if (inCodeBlock) {
                parsedLines.push(line.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"));
            } else {
                parsedLines.push(await this.parseText(line));
            }
        }
        return parsedLines.join('\n');
    }

    parseInline(line: string): string {

        line = line.replace(/`([^`]+?)`/g, '<code>$1</code>');
        line = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        line = line.replace(/\*(.+?)\*/g, '<em>$1</em>');
        line = line.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

        return line;
    }

    async parseText(line: string): Promise<string> {
        const headers = line.match(/^(#{1,6})\s+(.*)$/);
        if(headers) {
            const level = headers[1]?.length;
            return `<h${level}>${this.parseInline(headers[2]!)}</h${level}>`;
        }

        const list = line.match(/^[-*]\s+(.*)$/);
        if(list) return `<li>${this.parseInline(list[1]!)}</li>`;
        if (line.trim() === "") return "<br>";
        return `<p>${this.parseInline(line)}</p>`;
    }
}
