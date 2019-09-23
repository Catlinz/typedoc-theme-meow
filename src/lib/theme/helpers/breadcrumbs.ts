import { ProjectReflection, Reflection } from 'typedoc';

import { properURL, formatURLStr } from './formatting-basic';
import { PageEvent } from 'typedoc/dist/lib/output/events';
import { reflectionSymbol } from './reflection-symbol';
import { SPACE_STR } from './constants';

export function breadcrumbs(this: PageEvent) {
    return breadcrumb(this.model as Reflection, this.project, []);
}

function breadcrumb(model: Reflection, project: ProjectReflection, md: string[]) {
    if (model && model.parent) {
        breadcrumb(model.parent, project, md);
        if (model.url) {
            md.push(formatURLStr(reflectionSymbol(model) + SPACE_STR + model.name, properURL(model.url)));
        } else {
            md.push(model.url);
        }
    } else {
        md.push(formatURLStr(GLOBALS_STR, properURL(project.url)));
    }
    return md.join(CRUMB_SEP);
}

const CRUMB_SEP = ' › ';
const GLOBALS_STR = 'Globals';
