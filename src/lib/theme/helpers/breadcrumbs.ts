import { ProjectReflection, Reflection } from 'typedoc';
import { PageEvent } from 'typedoc/dist/lib/output/events';
import { properURL } from './formatting-basic';
import { reflectionSymbol } from './reflection-symbol';

export function breadcrumbs(this: PageEvent) {
  if (!isVisible()) {
    return '';
  }
  return breadcrumb(this.model, this.project, []);
}

function breadcrumb(model: Reflection, project: ProjectReflection, md: string[]) {
  if (model && model.parent) {
    breadcrumb(model.parent, project, md);
    if (model.url) {
      md.push(`[${reflectionSymbol.call(model)} ${model.name}](${properURL(model.url)})`);
    } else {
      md.push(model.url);
    }
  } else {
    md.push(`[Globals](${properURL(project.url)})`);
  }
  return md.join(' › ');
}

function isVisible() {
  return true;
}
