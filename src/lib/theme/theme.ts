import * as fs from 'fs-extra';

import { NavigationItem, Renderer } from 'typedoc';
import { ContainerReflection, DeclarationReflection, ProjectReflection, Reflection, ReflectionKind } from 'typedoc/dist/lib/models/reflections';
import { DefaultTheme, TemplateMapping } from 'typedoc/dist/lib/output/themes/DefaultTheme';
import { UrlMapping } from 'typedoc/dist/lib/output/models/UrlMapping';
import { Theme } from 'typedoc/dist/lib/output/theme';

export default class MarkdownTheme extends Theme {
    /**
     * Mappings of reflections kinds to templates used by this theme.
     */
    private static MAPPINGS: TemplateMapping[] = [{
        kind: [ReflectionKind.Class],
        isLeaf: false,
        directory: 'classes',
        template: 'reflection.hbs',
    }, {
        kind: [ReflectionKind.Interface],
        isLeaf: false,
        directory: 'interfaces',
        template: 'reflection.hbs',
    }, {
        kind: [ReflectionKind.Enum],
        isLeaf: false,
        directory: 'enums',
        template: 'reflection.hbs',
    }, {
        kind: [ReflectionKind.Module, ReflectionKind.ExternalModule],
        isLeaf: false,
        directory: 'modules',
        template: 'module.hbs',
    }];

    private navigation: NavigationItem;
    private navigationTitlesMap = {};

    // tslint:disable-next-line: no-any
    constructor(renderer: Renderer, basePath: string, options: any) {
        super(renderer, basePath);
        renderer.removeComponent('navigation');
        renderer.removeComponent('assets');
        renderer.removeComponent('javascript-index');
        renderer.removeComponent('toc');
        renderer.removeComponent('pretty-print');
    }

    public isOutputDirectory(outputDirectory: string): boolean {
        let isOutputDirectory = true;
        const allowedListings = [
            this.indexName,
            'globals.md',
            'SUMMARY.md',
            'classes',
            'enums',
            'interfaces',
            'media',
            'modules',
            '.DS_Store',
        ];

        const listings = fs.readdirSync(outputDirectory);

        if (!listings.includes(this.indexName)) {
            isOutputDirectory = false;
        }

        listings.forEach(listing => {
            if (!allowedListings.includes(listing)) {
                isOutputDirectory = false;
            }
        });

        return isOutputDirectory;
    }

    public getUrls(project: ProjectReflection): UrlMapping[] {
        const urls: UrlMapping[] = [];
        const entryPoint = this.getEntryPoint(project);

        if (project.readme && this.application.options.getValue('readme') !== 'none') {
            entryPoint.url = this.globalsName;
            urls.push(new UrlMapping(this.globalsName, entryPoint, 'globals.hbs'));
            urls.push(new UrlMapping(this.indexName, entryPoint, 'index.hbs'));
        } else {
            entryPoint.url = this.indexName;
            urls.push(new UrlMapping(this.indexName, entryPoint, 'globals.hbs'));
        }

        if (entryPoint.children) {
            entryPoint.children.forEach((child: Reflection) => {
                if (child instanceof DeclarationReflection) {
                    this.buildUrls(child, urls);
                }
            });
        }

        this.navigation = this.getNavigation(project);
        if (this.navigation.children) {
            this.navigation.children.forEach(navItem => {
                navItem.children.forEach(navItemChild => {
                    this.navigationTitlesMap[navItemChild.url] = navItemChild.title;
                });
            });
        }

        return urls;
    }

    private static getMapping(reflection: DeclarationReflection): TemplateMapping | undefined {
        return MarkdownTheme.MAPPINGS.find(mapping => reflection.kindOf(mapping.kind));
    }

    public getNavigation(project: ProjectReflection) {
        function createNavigationGroup(name: string, url = null) {
            const navigationGroup = new NavigationItem(name, url as string);
            navigationGroup.children = [];
            delete navigationGroup.cssClasses;
            delete navigationGroup.reflection;
            return navigationGroup;
        }

        function getNavigationGroup(reflection: DeclarationReflection) {
            if (reflection.kind === ReflectionKind.ExternalModule) {
                return externalModulesNavigation;
            }
            if (reflection.kind === ReflectionKind.Module) {
                return modulesNavigation;
            }
            if (reflection.kind === ReflectionKind.Class) {
                return classesNavigation;
            }
            if (reflection.kind === ReflectionKind.Enum) {
                return enumsNavigation;
            }
            if (reflection.kind === ReflectionKind.Interface) {
                return interfacesNavigation;
            }
            return null;
        }

        function addNavigationItem(reflection: DeclarationReflection, parentNavigationItem?: NavigationItem, group?) {
            let navigationGroup: NavigationItem;
            if (group) {
                navigationGroup = group as NavigationItem;
            } else {
                navigationGroup = getNavigationGroup(reflection);
            }
            let titlePrefix = '';
            if (parentNavigationItem && parentNavigationItem.title) {
                titlePrefix = parentNavigationItem.title.replace(/\"/g, '') + '.';
            }

            const title = titlePrefix + reflection.name.replace(/\"/g, '');
            const url = reflection.url;
            const nav = new NavigationItem(title, url, parentNavigationItem);
            nav.parent = parentNavigationItem;

            navigationGroup.children.push(nav);
            if (reflection.children) {
                reflection.children.forEach(reflectionChild => {
                    if (reflectionChild.hasOwnDocument) {
                        addNavigationItem(reflectionChild, nav, navigationGroup);
                    }
                });
            }
            delete nav.cssClasses;
            delete nav.reflection;
            return nav;
        }
        const isModules = this.application.options.getValue('mode') === 1;

        const navigation = createNavigationGroup(project.name, this.indexName);
        const externalModulesNavigation = createNavigationGroup('External Modules');
        const modulesNavigation = createNavigationGroup('Modules');
        const classesNavigation = createNavigationGroup('Classes');
        const enumsNavigation = createNavigationGroup('Enums');
        const interfacesNavigation = createNavigationGroup('Interfaces');

        if (!isModules) {
            project.groups.forEach(group => {
                group.children.forEach(reflection => {
                    if (reflection.hasOwnDocument) {
                        addNavigationItem(reflection as DeclarationReflection);
                    }
                });
            });
        }

        if (isModules) {
            project.groups[0].children.forEach(module => {
                const moduleNavigation = addNavigationItem(module as DeclarationReflection);
                if ((module as DeclarationReflection).children) {
                    (module as DeclarationReflection).children.forEach(reflection => {
                        if (reflection.hasOwnDocument) {
                            addNavigationItem(reflection, moduleNavigation);
                        }
                    });
                }
            });
        }

        if (externalModulesNavigation.children.length) {
            navigation.children.push(externalModulesNavigation);
        }
        if (modulesNavigation.children.length) {
            navigation.children.push(modulesNavigation);
        }
        if (classesNavigation.children.length) {
            navigation.children.push(classesNavigation);
        }
        if (enumsNavigation.children.length) {
            navigation.children.push(enumsNavigation);
        }
        if (interfacesNavigation.children.length) {
            navigation.children.push(interfacesNavigation);
        }

        return navigation;
    }

    private getEntryPoint(project: ProjectReflection): ContainerReflection {
        const entryPoint = this.owner.entryPoint;
        if (entryPoint) {
            const reflection = project.getChildByName(entryPoint);
            if (reflection) {
                if (reflection instanceof ContainerReflection) {
                    return reflection;
                } else {
                    this.application.logger.warn('The given entry point `%s` is not a container.', entryPoint);
                }
            } else {
                this.application.logger.warn('The entry point `%s` could not be found.', entryPoint);
            }
        }

        return project;
    }

    private buildUrls(reflection: DeclarationReflection, urls: UrlMapping[]): UrlMapping[] {
        const mapping = MarkdownTheme.getMapping(reflection);
        if (mapping) {
            if (!reflection.url || !DefaultTheme.URL_PREFIX.test(reflection.url)) {
                // const url = `${mapping.directory}/${DefaultTheme.getUrl(reflection)}.md`;
                const url = MarkdownTheme.getURL(reflection, mapping);
                urls.push(new UrlMapping(url, reflection, mapping.template));
                reflection.url = url;
                reflection.hasOwnDocument = true;
            }
            for (const child of reflection.children || []) {
                if (mapping.isLeaf) {
                    this.applyAnchorUrl(child, reflection);
                } else {
                    this.buildUrls(child, urls);
                }
            }
        } else if (reflection.parent) {
            this.applyAnchorUrl(reflection, reflection.parent);
        }
        return urls;
    }

    private applyAnchorUrl(reflection: Reflection, container: Reflection) {
        if (!reflection.url || !DefaultTheme.URL_PREFIX.test(reflection.url)) {
            reflection.url = container.url + '#' + this.getAnchor(reflection);
            reflection.anchor = this.getAnchor(reflection);
            reflection.hasOwnDocument = false;
        }
        reflection.traverse(child => {
            if (child instanceof DeclarationReflection) {
                this.applyAnchorUrl(child, container);
            }
        });
    }

    private getAnchor(reflection: Reflection) {
        return MarkdownTheme.getAnchorRef(reflection);
    }

    private static getAnchorRef(reflection: Reflection) {
        function parseAnchorRef(ref: string) {
            return ref.replace(/"/g, '').replace(/ /g, '-');
        }
        let anchorPrefix = '';
        reflection.flags.forEach(flag => (anchorPrefix += `${flag}-`));
        const prefixRef = parseAnchorRef(anchorPrefix);
        const reflectionRef = parseAnchorRef(reflection.name);
        const anchorRef = prefixRef + reflectionRef;
        return anchorRef.toLowerCase();
    }

    private static getURL(reflection: Reflection, mapping: TemplateMapping): string {
        if (reflection.kind === ReflectionKind.Module || reflection.kind === ReflectionKind.ExternalModule) {
            return `${mapping.directory}/${reflection.sources[0].file.fileName}.md`;
        }

        const sourceFile = reflection.sources[0].file.fileName;
        return `${mapping.directory}/${sourceFile.slice(0, sourceFile.lastIndexOf('/'))}/${reflection.name}.md`;
    }

    get indexName() {
        return 'README.md';
    }

    get globalsName() {
        return 'globals.md';
    }
}
