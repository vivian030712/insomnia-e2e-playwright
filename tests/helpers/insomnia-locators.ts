export const locators = {
  createRequestButton: 'button:has-text("New Request")',
  requestNameField: 'input[name="requestName"]',
  methodDropdown: '[data-testid="method-dropdown"]',
  urlInput: '[data-testid="url-input"]',
  sendButton: 'button:has-text("Send")',

  newRequestButton: '[data-testid="request-create-button"]',
  requestNameInput: '[data-testid="request-name-input"]',
  createRequestConfirm: '[data-testid="request-create-done"]',
 
  errorBanner: '[data-testid="error-message"]',


  // Response
  responseStatus: '[data-testid="response-status"]',
  responseBody: '[data-testid="response-body"]',

  // Body fields
  bodyTab: 'button:has-text("Body")',
  jsonEditor: '.cm-content',

  // Environment
  envButton: '[data-testid="environment"]',
  createEnvButton: 'button:has-text("New Environment")',
  envNameInput: 'input[name="environmentName"]',
  envEditor: '.cm-content',

  // Mock server
  mockServerMenu: 'button:has-text("Mock Server")',
  createMockServer: 'button:has-text("New Mock Server")',
  mockServerRouteButton: 'button:has-text("Add Route")',
  routePathInput: 'input[name="routePath"]',
  routeStatusInput: 'input[name="routeStatus"]',
  routeBodyEditor: '.cm-content'
};
