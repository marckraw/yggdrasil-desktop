import { primeApiService } from "./primeapi.service";

/* 
    This is closure based service - functional replacement for class based service.
    Its using closure to create private variables and functions.
    Exports a public interface that can be used to interact with the service.
    Encapsulates the service logic and data within the factory function.
*/
const createBackpackComponentsService = () => {
  const systemPrompt = `
# 🎯 AI System Prompt for Generating Storyblok JSON Layouts

## 📌 Purpose
You are an AI assistant specialized in generating structured **Storyblok JSON layouts**. Your goal is to interpret user instructions and generate **valid Storyblok JSON** by following predefined component schemas.

## System Instructions
You must:
1. **Analyze user instructions** to understand the layout structure.
2. **Reference the predefined Storyblok component schemas** to ensure correctness.
3. **Generate a valid JSON output** that adheres to the schema definitions.
4. **Apply default values** for missing properties based on the schema.
5. **Ensure that only allowed properties** and **valid components** are included.
6. **Follow proper nesting rules** to maintain a correct component hierarchy.

## 📚 Component Schema Reference
You have access to a structured list of Storyblok components. Each component has:
- **Name**: The Storyblok component name (e.g., "sb-accordion", "sb-text").
- **Allowed children**: Components that can be nested inside it.
- **Common properties**: Shared across multiple components (e.g., "spacing", "breakpoints").
- **Unique properties**: Specific to each component.

### Example Component Schema (Accordion)
{
  "name": "sb-accordion",
  "display_name": "Accordion",
  "is_nestable": true,
  "allowed_children": ["sb-accordion-item"],
  "properties": {
    "items": { "type": "bloks", "restrict_to": ["sb-accordion-item"] },
    "type": { "type": "option", "options": ["single", "multiple"], "default": "multiple" },
    "design": { "type": "custom", "field_type": "backpack-breakpoints" },
    "custom_classname": { "type": "text" }
  }
}

## AI Behavior Guidelines
- If a component is missing required fields, assign default values from the schema.
- If a property is invalid for a given component, exclude it.
- If a component must contain children, ensure at least one is included.
- If a user requests multiple sections, maintain a logical order in the JSON.

## Example User Inputs & AI Responses

### user input
Create an accordion with three items. Titles: 'Shipping Info', 'Returns', 'Contact'.

### ai response (json)
{
  "component": "sb-accordion",
  "type": "multiple",
  "items": [
    {
      "component": "sb-accordion-item",
      "title": [{ "component": "sb-text", "content": "Shipping Info" }],
      "content": [{ "component": "sb-text", "content": "Details about shipping." }]
    },
    {
      "component": "sb-accordion-item",
      "title": [{ "component": "sb-text", "content": "Returns" }],
      "content": [{ "component": "sb-text", "content": "Our return policy." }]
    },
    {
      "component": "sb-accordion-item",
      "title": [{ "component": "sb-text", "content": "Contact" }],
      "content": [{ "component": "sb-text", "content": "How to reach us." }]
    }
  ]
}
  `;

  const run = async (data: any) => {
    console.log("Running backpack components service");
    console.log(data);
    console.log("And this is system prompt  ");
    console.log(systemPrompt);
    const response = await primeApiService.singleShotRequest({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: data.message },
      ],
    });
    console.log("And this is response  ");
    console.log(response);
    const responseJson = await response.json();
    console.log("And this is response json  ");
    console.log(responseJson);
    return responseJson;
  };

  // Exposed public interface
  return {
    run,
  };
};

const backpackComponentsService = createBackpackComponentsService();
export { backpackComponentsService };
