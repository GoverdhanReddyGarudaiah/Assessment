import { Given, When, Then } from "@cucumber/cucumber";
import cucumberJson from "wdio-cucumberjs-json-reporter";
import { getScreenShot } from "../Utils/utils";
import { helpers } from "../Helpers/helpers";
import { SupportTicket } from "../Helpers/SupportTicket";

var primary_links,
  secondary_links,
  primary_response,
  secondary_response,
  createUserResponse,
  loginResponse,
  createSupportTicketResponse,
  getSupportTicketResponse,
  supportTicketId,
  shouldPass = true;

Given(/^Launch the "([^"]*)" website$/, async (WebAddress) => {
  await browser.url(WebAddress);
  cucumberJson.attach(await getScreenShot(), "image/png");
});

When(/^Get list of all links in the screen$/, async () => {
  primary_links = await helpers.getListofhrefs();
});

Then(/^Naviage to each of the valid links and verify the links under each page are not broken$/, async () => {
  for (const primary_link of primary_links) {
    try {
      primary_response = await helpers.getResponse(primary_links);
      await browser.url(primary_link);
      cucumberJson.attach(`Passed Primary Link: ${primary_link} - Status: ${primary_response.status}`);
      secondary_links = await helpers.getListofhrefs();
      for (const secondary_link of secondary_links) {
        try {
          secondary_response = await helpers.getResponse(secondary_link);
          cucumberJson.attach(`Passed Secondary Link: ${secondary_link} - Status: ${secondary_response.status}`);
        } catch (error) {
          shouldPass = false;
          cucumberJson.attach(
            `Failed Secondary Link: ${secondary_link} - Status: BROKEN (Error: ${
              error.secondary_response ? error.secondary_response.status : error.message
            })`
          );
        }
      }
    } catch (error) {
      shouldPass = false;
      cucumberJson.attach(
        `Failed Primary Link: ${primary_link} - Status: BROKEN (Error: ${error.primary_response ? error.primary_response.status : error.message})`
      );
    }
    await cucumberJson.attach(await getScreenShot(), "image/png");
  }
  expect(shouldPass).toBe(true);
});

Given(/^Create a new user "([^"]*)" and password "([^"]*)" using register endpoint$/, async (UserName, Password) => {
  createUserResponse = await helpers.registerNewUser(UserName, Password);
  expect(createUserResponse.status).toBe(200);
});

Then(/^Verify the user "([^"]*)" and password "([^"]*)" is able to login using login endpoint$/, async (UserName, Password) => {
  loginResponse = await helpers.login(UserName, Password);
  expect(loginResponse.status).toBe(200);
  await cucumberJson.attach(`The user is able to login: ${JSON.stringify(loginResponse.data)}`);
});

When(/^Create a support ticket using tickets endpoint with "([^"]*)" title and "([^"]*)" description$/, async (Title, Description) => {
  createSupportTicketResponse = await helpers.createSupportTicket(Title, Description, 1);
  expect(createSupportTicketResponse.status).toBe(200);
  supportTicketId = createSupportTicketResponse.data.id;
  await cucumberJson.attach(`The support ticket is created: ${JSON.stringify(createSupportTicketResponse.data)}`);
  await cucumberJson.attach(`The support ticket id is: ${JSON.stringify(supportTicketId)}`);
});

Then(/^Verify the ticket id generated is available in tickets endpoint$/, async () => {
  getSupportTicketResponse = await helpers.getSupportTicket();
  const tickets: SupportTicket[] = getSupportTicketResponse.data;
  expect(getSupportTicketResponse.status).toBe(200);
  await cucumberJson.attach(`The list of support tickets is: ${JSON.stringify(tickets)}`);
  expect(tickets.some((ticket) => ticket.id === supportTicketId)).toBe(true);
  await cucumberJson.attach(`Ticket is verified to be in support tickets list: ${supportTicketId}`);
});
