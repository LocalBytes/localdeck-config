import type { HassEntity } from '@localbytes/localdeck-components/src/utils/types';

const example = [
  { entity_id: 'light.livingroom_bulb', attributes: { friendly_name: 'Livingroom Bulb' } },
  { entity_id: 'light.bedroom_light', attributes: { friendly_name: 'Bedroom Bulb' } },
  {
    entity_id: 'sensor.bedroom_light_last_restart_time',
    attributes: { friendly_name: 'Bedroom Bulb Last Restart Time' },
  },
  {
    entity_id: 'sensor.bedroom_light_wifi_connect_count',
    attributes: { friendly_name: 'Bedroom Bulb WiFi Connect Count' },
  },
  {
    entity_id: 'sensor.bedroom_light_mqtt_connect_count',
    attributes: { friendly_name: 'Bedroom Bulb MQTT Connect Count' },
  },
  { entity_id: 'sensor.bedroom_light_restart_reason', attributes: { friendly_name: 'Bedroom Bulb Restart Reason' } },
  { entity_id: 'switch.bed_heater', attributes: { friendly_name: 'Bed Heater' } },
  { entity_id: 'scene.evening_warm', attributes: { friendly_name: 'Orange Glow' } },
  { entity_id: 'scene.warm_glow', attributes: {} },
];
export default defineEventHandler(async (event) => {
  const { api_url, api_token } = useRuntimeConfig();
  let response: typeof example;

  if (api_url && api_token) {
    response = await fetch(api_url + '/states', {
      headers: { authorization: `Bearer ${api_token}` },
    }).then(response => response.json());
  }
  else {
    response = example;
  }

  return response
    .map((state): HassEntity => {
      const id = state.entity_id;
      const name = state.attributes.friendly_name
        ?? id.split('.')[1]
          .split('_').map((word: string) => word[0].toUpperCase() + word.slice(1))
          .join(' ');

      return ({ name, id });
    });
});
