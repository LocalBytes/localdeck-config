import {Script} from "esphome-config-ts/dist/components/index.js";

const LAMBDA = `
ESP_LOGD("set_led_rgb", "Entity %s, Input: %s", entity.c_str(), color.c_str());

if (color.length() < 7) return;

int firstComma = color.find(',');
int secondComma = color.find(',', firstComma + 1);

ESP_LOGV("set_led_rgb", "Commas are: %d, %d", firstComma, secondComma);

float r = stoi(color.substr(1, firstComma));
float g = stoi(color.substr(firstComma + 1, secondComma));
float b = stoi(color.substr(secondComma + 1, color.length() - 1));

ESP_LOGD("set_led_rgb", "%d, %d, %d", r,g,b);

for (auto *light : App.get_lights()){
  ESP_LOGV("set_led_rgb", "Checking light %s", light->get_object_id().c_str());
  if (light->get_object_id().c_str() == entity){
      ESP_LOGD("set_led_rgb", "Setting light %s", light->get_object_id().c_str());
      auto call = light->make_call();
      call.set_rgb(r/255, g/255, b/255);
      call.perform();
  }
}
`.trim();

export const scriptSetLedRgb = new Script({
    id: "set_led_rgb",
    parameters: {color: 'string', entity: 'string'},
    mode: "queued",
    then: [{
        lambda: LAMBDA
    }]
});
