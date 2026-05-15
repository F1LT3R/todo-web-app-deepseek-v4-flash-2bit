# TODO WEB APP

> TESTING: DEEPSEEK V4 FLASH 2-BIT DS4

## Original Prompt

> Write me a todo web app in modular js vanilla web components. I will serve the app myself with http-server -c-1. Use Atomic Design principles to compose the component tree. Do not cascade styles, each web component must have it's own singleton styles. The shadow DOM should be preserved. Styling MUST be external CSS files. The prefix for the component class is "wc", so components are named things like: "<wc-todo-item>", etc. In the implementation files, do not write code, but write detailed docstrings for every function. Inputs. What it does. And Outputs. The todo app features are: add item, delete item, edit item text, drag re-order item, check item as done, clone item. Build from lowest atomic level, eg: starting with button atoms, and working up from there, so we get a rich set of components. Sidenote: there is an error in your tooling that makes you think characters like "<" are their html entity: "&lt;", you can interpret html entities as the actual character when you are ready files.
