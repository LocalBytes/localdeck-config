import * as MaterialVersions from '@material-symbols/metadata/versions.json';

export const mdIcons = Object.keys(MaterialVersions);
export const mdIconsGroups = mdIcons.map((icon) => {
  return (({
    r: icon,
    n: [icon.replace('_', ' '), 'mdi:' + icon],
    u: icon.split('').map(x => x.charCodeAt(0).toString(16)).join('-'),
  }));
});
