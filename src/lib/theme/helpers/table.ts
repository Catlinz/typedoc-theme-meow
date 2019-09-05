import { PIPE_SPACED, SPACE_STR } from './constants';

export class MDTable {
    private _headers: string[] = [];
    private _items: string[] = [];

    public readonly id: string;

    constructor(id: string) {
        this.id = id;
    }

    public addHeaders(...headers: string[]) {
        this._headers.push(...(headers).filter(it => !!it));
    }

    public sortHeaders(fn?: (a: string, b: string) => number) {
        this._headers = this._headers.sort(fn);
    }

    public add(str: string) {
        this._items.push(str);
    }

    public addRow(row: string[]) {
        this._items.push(...row);
    }

    public sortItems(fn?: (a: string, b: string) => number) {
        this._items = this._items.sort(fn);
    }

    public toString(): string {
        const rows: string[] = [];
        const cols = this._headers.length;

        // Construct the rows.
        const items = this._items;
        if (items.length) {
            for (let i = 0; i < items.length - cols; i += cols) {
                let row = items[i];
                
                for (let k = 1; k < cols; ++k) {
                    row  = row + PIPE_SPACED + items[i + k];
                }
    
                rows.push(row);
            }
    
            const lastRowStart = Math.max(0, items.length - cols);
            let lastRow = items[lastRowStart];
    
            for (let k = 1; k < cols; ++k) {
                lastRow = lastRow + PIPE_SPACED + (items[lastRowStart + k] || SPACE_STR);
            }
    
            rows.push(lastRow);
        }

        const headerRow = this._headers.join(PIPE_SPACED);
        const headerSepRow = this._headers.map(_ => ':---').join(PIPE_SPACED);

        return headerRow + ' |\n' + headerSepRow + ' |\n' + rows.join(' |\n');
    }
}
