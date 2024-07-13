import {Script} from "esphome-config-ts/dist/components/index.js";

const LAMBDA = `
ESP_LOGD("set_led_rgb", "Index %d, Input: %s", led_index, color.c_str());

int firstComma = color.find(',');
int secondComma = color.find(',', firstComma + 1);

ESP_LOGD("set_led_rgb", "Commas are: %d, %d", firstComma, secondComma);

auto rs = color.substr(1, firstComma);
auto gs = color.substr(firstComma + 1, secondComma);
auto bs = color.substr(secondComma + 1, color.length() - 1);

ESP_LOGD("set_led_rgb", "%s-%s-%s", rs.c_str(), gs.c_str(), bs.c_str());
ESP_LOGD("set_led_rgb", "%d, %d, %d", stoi(rs), stoi(gs), stoi(bs));

auto light = ((AddressableLight*)id(ledstrip).get_output());
light->get(led_index).set(Color(stoi(rs), stoi(gs), stoi(bs)));
light->schedule_show();
`.trim();

export const scriptSetLedRgb = new Script({
    id: "set_led_rgb",
    parameters: {led_index: 'int', color: 'string'},
    mode: "queued",
    then: [{
        lambda: LAMBDA
    }]
});
