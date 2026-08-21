import { Configuration } from 'esphome-config-ts';
import {
  Esp32ImprovPlatform,
  Esp32Platform, Esp32RmtLedStripLight,
  EsphomePlatform, ImprovSerialPlatform, MatrixKeypadPlatform,
  SubstitutionsPlatform,
  TemplateOutput, WifiInfoTextSensor,
  WifiPlatform,
} from 'esphome-config-ts/components';
import { KEYS } from '@/virtuals/configured-button.ts';
import { scriptBlipLight } from '@/scripts/blip-light.ts';
import { globalApplyRgbColor } from '@/scripts/apply-rgb-color.ts';
import { SliderNumber } from '@/virtuals/slider-number.ts';

export const PINS_ROWS = [21, 20, 3, 7] as const;
export const PINS_COLS = [0, 1, 10, 4, 5, 6] as const;

export interface newConfigOpts {
  withDefaults?: boolean;
  stopBeforeCustom?: boolean;
}

function newConfig(opts: newConfigOpts = {
  withDefaults: true,
  stopBeforeCustom: false,
}) {
  const config = new Configuration();

  if (opts.withDefaults) {
    config.addDefaults();
    config.updateComponent(new SubstitutionsPlatform({
      name: 'localdeck',
      friendly_name: 'LocalBytes LocalDeck',
    }));

    config.updateComponent(new EsphomePlatform({
      name: '${name}',
      friendly_name: '${friendly_name}',
      name_add_mac_suffix: false,
      platformio_options: {
        'board_build.flash_mode': 'dio',
      },
      on_boot: [
        {
          'light.turn_on': {
            id: 'ledstrip',
            brightness: '25%',
            effect: 'Addressable Rainbow',
          },
        },
        { delay: '5s' },
        { 'light.turn_off': { id: 'ledstrip' } },
      ],
    }))
      .updateComponent(new Esp32Platform({
        board: 'esp32-c3-devkitm-1',
        framework: {
          type: 'esp-idf',
          sdkconfig_options: {},
        },
      }))
      .updateComponent(new WifiPlatform({
        ap: { ssid: '${friendly_name}' },
      }))
      .updateComponent(new TemplateOutput({
        id: 'improv_status',
        type: 'binary',
        write_action: [
          {
            if: {
              condition: [{ lambda: 'return state;' }],
              then: [{ 'light.turn_on': { id: 'keypad_button_01_light' } }],
              else: [{ 'light.turn_off': { id: 'keypad_button_01_light' } }],
            },
          },
        ],
      }))
      .updateComponent(new Esp32ImprovPlatform({
        status_indicator: 'improv_status',
        authorizer: 'keypad_button_01',
      }))
      .updateComponent(new ImprovSerialPlatform({}));
  }

  if (opts.stopBeforeCustom) {
    return { config };
  }

  config.addComponent(new WifiInfoTextSensor({
    mac_address: {
      id: 'wifi_info_mac_address',
    },
  }));

  const ledstrip = (new Esp32RmtLedStripLight({
    name: 'Ledstrip',
    id: 'ledstrip',
    rgb_order: 'GRB',
    // ignore_strapping_warning suppresses ESP32-C3 boot warning
    pin: { number: 'GPIO8', ignore_strapping_warning: true },
    num_leds: 24,
    chipset: 'SK6812',
    restore_mode: 'RESTORE_AND_OFF',
    effects: [
      { addressable_rainbow: { name: 'Addressable Rainbow' } },
    ],
  })).addTo(config);

  const keypad = (new MatrixKeypadPlatform({
    id: 'keypad',
    keys: KEYS,
    rows: PINS_ROWS.map(pin => ({ pin: `GPIO${pin.toString()}` })),
    columns: PINS_COLS.map(pin => ({
      pin: {
        number: `GPIO${pin.toString()}`,
        drive_strength: '5mA',
      },
    })),
  })).addTo(config);

  config.addComponent([
    scriptBlipLight,
    globalApplyRgbColor,
  ]);

  const brightness = (new SliderNumber({
    id: 'brightness',
    name: 'Brightness',
    min: '0',
    max: '1',
    step: '0.01',
    initial_value: '1',
    type: 'float',
  })).addTo(config);

  return { config, keypad, ledstrip, brightness };
}

export default newConfig;
