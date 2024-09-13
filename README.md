# LocalDeck Config

## Installation

To install the LocalDeck Configurator, you will need to have a working HomeAssistant instance, and the LocalDeck integration installed.

All of our addons are published to  [LocalBytes/hass-addons](https://github.com/LocalBytes/hass-addons), which you can add to your HomeAssistant.

There are two versions of the configurator available:
- [LocalDeck Configurator] - Published on each tagged release.
- [LocalDeck Configurator (Dev)] - Published on each commit to the `main` branch.

Click on either of the links above to install the configurator.  
You can have both installed at the same time

[LocalDeck Configurator]: https://my.home-assistant.io/redirect/supervisor_addon/?repository_url=https%3A%2F%2Fgithub.com%2FLocalBytes%2Fhass-addons&addon=f0d5d1e0_localdeck-configurator
[LocalDeck Configurator (Dev)]: https://my.home-assistant.io/redirect/supervisor_addon/?repository_url=https%3A%2F%2Fgithub.com%2FLocalBytes%2Fhass-addons&addon=f0d5d1e0_localdeck-configurator-dev

## About

This is the repo for the LocalDeck configurator, it is split into multiple parts:

- [localdeck-codegen](./packages/localdeck-codegen) 
    - Actual code-generation logic (no UI)
    - Holds the factory configuration(s)
- [localdeck-components](./packages/localdeck-components)
    - Vue components for the configurator
    - Business logic for serializing/deserializing the configuration
    - UI for the "Deck Pad" view, with it's associated logic
    - Most of the value is provided by this package
- [localdeck-configurator](./packages/localdeck-configurator)
    - The actual configurator
    - A relatively thin wrapper that provides a runtime for the configurator
    - Includes server routes for saving/loading configurations and other file management

All of our UI is written in [NuxtJS]/[Vue], and we use [RippleUI] for the UI components where applicable.

## Contributing

The best way to contribute to the LocalDeck (and it's configurator) is by using the development version in your HomeAssistant, and reporting any issues you find.
Additionally, we would appreciate it if you were to be active on the Forum should we solicit feedback on a new feature or change.

If you are a developer, you can also contribute by submitting a pull request to this repository. Please be aware that any code contributed will become the property of Allport-IT LTD.

## Licence
This project is currently published with no specific licence:
- This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY
- As an individual user, you are free learn from it, and use it in your own projects
- You must not claim it as your own

Unless otherwise stated, all code is &copy; Allport-IT LTD. All rights reserved.

[NuxtJS]: https://nuxtjs.org/
[Vue]: https://vuejs.org/
[RippleUI]: https://rippleui.com/
