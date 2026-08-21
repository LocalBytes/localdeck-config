import newConfig from '@/esphome-localdeck.js';
import { BUTTON_NUMBERS, ConfiguredButton, zConfiguredButtonOpts } from '@/virtuals/configured-button.ts';
import { DashboardImportPlatform } from 'esphome-config-ts/components';

import _ from 'lodash';

const { config } = newConfig();

config.updateComponent(new DashboardImportPlatform({
  package_import_url: 'github://LocalBytes/localdeck-config/packages/localdeck-codegen/esphome-localdeck.yaml',
}));

const esphomeComponent = config.components.find(c => c.componentName === 'esphome');
if (!esphomeComponent) throw new Error('esphome component not found');
esphomeComponent.config = _.merge(esphomeComponent.config, {
  name_add_mac_suffix: true,
  project: {
    name: 'localbytes.localdeck',
    version: '0.0.1',
  },
  on_boot: [
    { 'light.turn_on': { id: 'ledstrip', brightness: '25%', effect: 'Addressable Rainbow' } },
  ],
});

BUTTON_NUMBERS
  .sort()
  .forEach(num => config.addComponent(new ConfiguredButton(zConfiguredButtonOpts.parse({
    keyNum: num,
    label: { text: `Button ${num.toString()}` },
    component: { num },
  }))));

console.log(config.synthYaml());
