import {Globals} from "esphome-config-ts/dist/components/index.js";

export const APPLY_RGB_COLOR_ID = "apply_rgb_color";

export const globalApplyRgbColor = new Globals({
    id: APPLY_RGB_COLOR_ID,
    type: "const std::function<void(std::string, esphome::light::LightState*)>",
    initial_value: `[](std::string color, esphome::light::LightState* light) {
  int r, g, b;
  if (sscanf(color.c_str(), "(%d, %d, %d)", &r, &g, &b) != 3) return;
  auto call = light->make_call();
  call.set_rgb(r/255.0f, g/255.0f, b/255.0f);
  call.perform();
}`,
});
