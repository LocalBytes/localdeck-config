import { GlobalsPlatform } from 'esphome-config-ts/components';

export const APPLY_RGB_COLOR_ID = 'apply_rgb_color';

const applyRgbColorImpl = /* cpp */`[](std::string color, esphome::light::LightState* light) {
  ESP_LOGD("apply_rgb_color", "Light %s, Input: %s", light->get_name().c_str(), color.c_str());
  if (color == "None") return;
  int r, g, b;
  if (sscanf(color.c_str(), "(%d, %d, %d)", &r, &g, &b) != 3) return;
  auto call = light->make_call();
  call.set_rgb(r/255.0f, g/255.0f, b/255.0f);
  call.perform();
}`;

export const globalApplyRgbColor: GlobalsPlatform = new GlobalsPlatform({
    id: APPLY_RGB_COLOR_ID,
  type: 'const std::function<void(std::string, esphome::light::LightState*)>',
    initial_value: applyRgbColorImpl,
});
