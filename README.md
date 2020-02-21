
### The Scenario
##### Assume you are working on the admin controls of a product that allows builders to set up their own input forms (e.g., how Google Forms, SurveyMonkey, or Quick Base allow you to build a survey with a multiple choice field). *The project is to create a control to modify the properties of a multiple choice field.* It’s not necessary to have the control actually build a multiple choice field; assume that functionality is handled by a service and you just need to interact with its APIs.

### Core Requirements/Tasks
1. The builder can add and remove choices from the list of choices. In the visual spec provided, the builder adds and removes choices in a textarea element. Individual items are separated by a new line. Feel free to modify this interaction to meet the requirement of being able to add and remove choices.

2. Validate the following rules and notify the builder if there are any validation issues.
* The Label field is required.
* Duplicates choices are not allowed.
* There cannot be more than 50 choices total.

3. If the default value is not one of the choices, it should be added to the list of choices when the field is saved.

4. For the purpose of the demo, you may want the form to keep its values after the form is submitted. This helps demonstrate the prior requirement (that the default value is added).

5. Add a button that allows the builder to clear the form and start fresh.

6. The submit button should create a json object and post it to http://www.mocky.io/v2/566061f21200008e3aabd919. It should also log the post data to the console. You can add a function to FieldService in MockFieldService.js to accomplish this, but everything is up to you. Feel free to modify or change anything you would like as long as it meets the minimum requirement of posting json data to the back-end endpoint.

###### This application was built by Erin N. Bacon
