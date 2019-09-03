import { PageEvent } from 'typedoc/dist/lib/output/events';

import { heading } from './formatting-basic';
import { reflectionTitle } from './reflection-title';

export function mainTitle(this: PageEvent) {
    switch (this.model.kindString) {
        case 'Class':
            return `${reflectionTitle.call(this)}\n===`;
        default:
            return `${heading(1)} ${reflectionTitle.call(this)}`;
    }
}
