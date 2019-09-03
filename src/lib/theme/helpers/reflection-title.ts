import { PageEvent } from 'typedoc/dist/lib/output/events';

export function reflectionTitle(this: PageEvent) {
    const title = [];
    if (this.model.kindString) {
        title.push(`${this.model.kindString}: `);
    }

    const isClass = this.model.kindString === 'Class';

    if (isClass) { title.push('**`'); }

    if (this.model.typeParameters) {
        const typeParameters = this.model.typeParameters.map(typeParameter => typeParameter.name).join(', ');
        title.push(this.model.name + `<${typeParameters}>`);
    } else {
        title.push(this.model.name);
    }

    if (isClass) { title.push('`**'); }

    return title.join('');
}
