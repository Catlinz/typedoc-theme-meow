import { PageEvent } from 'typedoc/dist/lib/output/events';
// import { relativeUrl } from './relative-url';

export function projectTitle(this: PageEvent) {
  if (!isVisible()) {
    return '';
  }
  // return `**[${this.project.name}](${relativeUrl(MarkdownPlugin.theme.indexName)})**`;
  return this.project.name;
}

function isVisible() {
    return true;
}
