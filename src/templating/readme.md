# Templating

## Motivation
- We want to render things multiple times without writing the html by hand
- We want to render dynamic data, not known before runtime
- We want to write our html as html, not using Javascript's DOM manipulation API
- We want to decouple our html from our javascript and need a way to bind them back together when needed

## Implementation
- function that accepts template string returns new function which accepts data
- second function has reference to template string
- calling second function with data object literal iterates over each property - value pair
- on each iteration, searches templatestring for a placeholder with the name of the property and replaces it with value
- when done, returns html string where placeholders were replaced with actual values
