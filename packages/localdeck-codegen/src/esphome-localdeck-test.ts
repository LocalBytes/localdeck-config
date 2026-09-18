import { Configuration } from "esphome-config-ts";
import {
  Esp32Platform,
  Esp32RmtLedStripLight,
  EsphomePlatform,
  SubstitutionsPlatform,
} from "esphome-config-ts/components";

const config = new Configuration();

config.updateComponent(
  new SubstitutionsPlatform({
    name: "localdeck-test",
    friendly_name: "LocalDeck TEST",
  }),
);
config.updateComponent(
  new Esp32Platform({
    board: "esp32-c3-devkitm-1",
    framework: {
      type: "esp-idf",
      sdkconfig_options: {},
    },
  }),
);

config.updateComponent(
  new EsphomePlatform({
    name: "${name}",
    friendly_name: "${friendly_name}",
    name_add_mac_suffix: true,
    on_boot: [
      {
        "light.turn_on": {
          id: "ledstrip",
          brightness: "50%",
          effect: "Addressable Rainbow",
        },
      },
    ],
  }),
);

config.addComponent(
  new Esp32RmtLedStripLight({
    name: "Ledstrip",
    id: "ledstrip",
    channel_colors: "GRB",
    // ignore_strapping_warning suppresses ESP32-C3 boot warning
    pin: { number: "GPIO8", ignore_strapping_warning: true },
    num_leds: 24,
    chipset: "SK6812",
    restore_mode: "RESTORE_AND_OFF",
    effects: [{ addressable_rainbow: { name: "Addressable Rainbow" } }],
  }),
);

console.log(config.synthYaml());
