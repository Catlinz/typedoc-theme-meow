import { PageEvent } from 'typedoc/dist/lib/output/events';

export function projectTitle(this: PageEvent) {
  return this.project.name;
}
