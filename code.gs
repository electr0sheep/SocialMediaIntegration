var ADDON_TITLE = 'Social Media Integration';

function onOpen(e) {
  FormApp.getUi()
      .createAddonMenu()
      .addItem('Toggle buttons', 'showSidebar')
      .addItem('About', 'showAbout')
      .addToUi();
}

function onInstall(e) {
  onOpen(e);
}

function showSidebar() {
  var ui = HtmlService.createHtmlOutputFromFile('Sidebar')
      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
      .setTitle('Social Media Buttons');
  FormApp.getUi().showSidebar(ui);
}

function showAbout() {
  var ui = HtmlService.createHtmlOutputFromFile('About')
      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
      .setWidth(420)
      .setHeight(270);
  FormApp.getUi().showModalDialog(ui, 'About Social Media Integration');
}

function saveSettings(settings) {
  PropertiesService.getDocumentProperties().setProperties(settings);
  var form = FormApp.getActiveForm();
  var newConfirmationMessage = form.getConfirmationMessage();
  var thisPage = encodeURIComponent(form.getPublishedUrl());

  // clear previous entries
  newConfirmationMessage = newConfirmationMessage.replace(/^Facebook: .*\n?/m, '');
  newConfirmationMessage = newConfirmationMessage.replace(/^Twitter: .*\n?/m, '');
  newConfirmationMessage = newConfirmationMessage.replace(/^Google: .*\n?/m, '');
  newConfirmationMessage = newConfirmationMessage.replace(/^LinkedIn: .*\n?/m, '');
  newConfirmationMessage = newConfirmationMessage.trim();

  if (settings.facebookSetting == true) {
    newConfirmationMessage += "\n\nFacebook: https://www.facebook.com/sharer/sharer.php?u=" + thisPage + ";src=sdkpreparse";
  }
  if (settings.twitterSetting == true) {
    newConfirmationMessage += "\n\nTwitter: https://twitter.com/home?status=" + thisPage;
  }
  if (settings.googleSetting == true) {
    newConfirmationMessage += "\n\nGoogle: https://plus.google.com/share?url=" + thisPage;
  }
  if (settings.linkedinSetting == true) {
    newConfirmationMessage += "\n\nLinkedIn: https://www.linkedin.com/shareArticle?mini=true&url=" + thisPage + "&title=&summary=&source=";
  }
  form.setConfirmationMessage(newConfirmationMessage);
}

function getSettings() {
  var settings = PropertiesService.getDocumentProperties().getProperties();

  // Use a default email if the creator email hasn't been provided yet.
  if (!settings.creatorEmail) {
    settings.creatorEmail = Session.getEffectiveUser().getEmail();
  }

  // Get text field items in the form and compile a list
  //   of their titles and IDs.
  var form = FormApp.getActiveForm();
  var textItems = form.getItems(FormApp.ItemType.TEXT);
  settings.textItems = [];
  for (var i = 0; i < textItems.length; i++) {
    settings.textItems.push({
      title: textItems[i].getTitle(),
      id: textItems[i].getId()
    });
  }
  return settings;
}
