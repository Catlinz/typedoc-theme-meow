import { ProjectReflection, ReflectionKind, Reflection } from 'typedoc';
import { MDTable } from './table';
import { formatURLStr, properURL } from './formatting-basic';
import { reflectionSymbol } from './reflection-symbol';
import { NBSP } from './constants';

export function globalIndex(this: ProjectReflection): string {
    const tables: {[key: string]: MDTable} = {};

    for (const mod of this.children!) {
        if (mod.children) {
            for (const child of mod.children!) {
                const headerStr = getTableHeaderFromKind(child);
                
                if (!tables[headerStr]) {
                    const table = new MDTable(headerStr);
                    table.addHeaders('― ' + headerStr + ' ―', ...(colCount[headerStr] || colCount.Default));
                    tables[headerStr] = table;
                }
        
                tables[headerStr].add(formatURLStr(reflectionSymbol.call(child) + NBSP + child.name, properURL(child.url)));
            }
        }
    }

    const tableArr = Object.values(tables).sort(sortTables);
    
    for (const t of tableArr) {
        t.sortItems();
    }

    return tableArr.map(it => it.toString()).join('\n\n&nbsp;\n\n&nbsp;\n\n');
}

function getTableHeaderFromKind(ref: Reflection) {
    switch (ref.kind) {
        case ReflectionKind.Class:
            return 'Classes';
        case ReflectionKind.Interface:
            return 'Interfaces';
        case ReflectionKind.Module:
            return 'Modules';
        case ReflectionKind.Enum:
            return 'Enumerations';
        case ReflectionKind.Function:
            return 'Functions';
        case ReflectionKind.TypeAlias:
            return 'Type aliases';
        case ReflectionKind.ObjectLiteral:
            return 'Object literals';
        case ReflectionKind.Variable:
            return 'Variables';
        default:
            return ref.kindString + 's'; 
    }
}

const sortOrder: {[key: string]: number} = {
    'Classes': 10,
    'Interfaces': 20,
    'Modules': 30,
    'Enumerations': 40,
    'Functions': 50,
    'Type aliases': 60,
    'Object literals': 70,
    'Variables': 80,
};

const colCount: {[key: string]: string[]} = {
    Variables: [' '],
    Enumerations: [' ', ' ', ' '],
    Default: [' ', ' '],
};

function sortTables(a: MDTable, b: MDTable): number {
    const aOrder = sortOrder[a.id] || 100;
    const bOrder = sortOrder[b.id] || 100;
    
    return aOrder - bOrder;
}
