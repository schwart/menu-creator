var forms = require("forms");
var widgets = forms.widgets;
var fields = forms.fields;

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 1000;

var my_form = forms.create({
  Menu_Title: fields.string({
    required: true,
    widget: widgets.text({ classes: ['input-with-feedback'] }),
    cssClasses: {
      label: ['control-label col col-lg-3']
    }
  }),
  Starter_Title: fields.string({
    required: true,
    widget: widgets.text({ classes: ['input-with-feedback'] }),
    cssClasses: {
      label: ['control-label col col-lg-3']
    }
  }),
  Starter_Description: fields.string({
    widget: widgets.text({ classes: ['input-with-feedback'] }),
    cssClasses: {
      label: ['control-label col col-lg-3']
    }
  }),
  Main_Title: fields.string({
    required: true,
    widget: widgets.text({ classes: ['input-with-feedback'] }),
    cssClasses: {
      label: ['control-label col col-lg-3']
    }
  }),
  Main_Description: fields.string({
    widget: widgets.text({ classes: ['input-with-feedback'] }),
    cssClasses: {
      label: ['control-label col col-lg-3']
    }
  }),
  Dessert_Title: fields.string({
    required: true,
    widget: widgets.text({ classes: ['input-with-feedback'] }),
    cssClasses: {
      label: ['control-label col col-lg-3']
    }
  }),
  Dessert_Description: fields.string({
    widget: widgets.text({ classes: ['input-with-feedback'] }),
    cssClasses: {
      label: ['control-label col col-lg-3']
    }
  }),
});

var bootstrapField = function (name, object) {
  if (!Array.isArray(object.widget.classes)) { object.widget.classes = []; }
  if (object.widget.classes.indexOf('form-control') === -1) {
    object.widget.classes.push('form-control');
  }

  var label = object.labelHTML(name);
  var error = object.error ? '<div class="alert alert-error help-block">' + object.error + '</div>' : '';

  var validationclass = object.value && !object.error ? 'has-success' : '';
  validationclass = object.error ? 'has-error' : validationclass;

  var widget = object.widget.toHTML(name, object);
  return '<div class="form-group ' + validationclass + '">' + label + widget + error + '</div>';
};

var html = my_form.toHTML(bootstrapField);

document.getElementById("form-content").innerHTML = html;

function createCanvas() {
  let canvas = document.createElement("canvas");
  canvas.setAttribute("width", `${CANVAS_WIDTH}`);
  canvas.setAttribute("height", `${CANVAS_HEIGHT}`);
  let context = canvas.getContext("2d");
  return {
    canvas: canvas,
    context: context
  }
}

function downloadImage(canvas, menu_title) {
  let dataUrl = canvas.toDataURL("image/png");
  let a = document.createElement("a");
  a.href = dataUrl;
  a.download = "your-menu.png";
  document.body.appendChild(a);
  a.click();
}

function getLines(ctx, text, maxWidth) {
  var words = text.split(" ");
  var lines = [];
  var currentLine = words[0];

  for (var i = 1; i < words.length; i++) {
    var word = words[i];
    var width = ctx.measureText(currentLine + " " + word).width;
    if (width < maxWidth) {
      currentLine += " " + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
}

function drawMenu(context, menuDetails) {
  // draw background
  context.fillStyle = "#fbf7f5";
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  let cornerOffset = 10;
  context.beginPath();
  context.moveTo(cornerOffset, cornerOffset);
  context.lineTo(CANVAS_WIDTH - cornerOffset, cornerOffset);
  context.moveTo(CANVAS_WIDTH - cornerOffset, CANVAS_HEIGHT - cornerOffset);
  context.lineTo(cornerOffset, CANVAS_HEIGHT - cornerOffset);
  context.strokeStyle = "black";
  context.lineWidth = 5;
  context.stroke();


  let courseHeightOffset = 300;
  let descriptionHeightOffset = 40;
  let descriptionLineOffset = 25;

  let menuTitleHeight = 65;
  let starterTitleHeight = 180;
  let mainTitleHeight = starterTitleHeight + courseHeightOffset;
  let dessertTitleHeight = mainTitleHeight + courseHeightOffset;

  let menuTitleFont = "50px Arvo-Regular";
  let courseTitleFont = "40px Arvo-Regular";
  let courseDescriptionFont = "25px Arvo-Regular";

  context.fillStyle = "black";

  // draw menu title
  context.font = menuTitleFont;
  context.textAlign = "center";
  context.fillText(menuDetails.menu_title, CANVAS_WIDTH / 2, menuTitleHeight);

  context.beginPath();
  context.lineWidth = 2;
  let menuLineOffset = 200;
  let menuLineHeight = menuTitleHeight + 20;
  context.moveTo(menuLineOffset, menuLineHeight);
  context.lineTo(CANVAS_WIDTH - menuLineOffset, menuLineHeight);
  context.stroke();

  // draw starter
  context.font = courseTitleFont;
  context.fillText(menuDetails.starter_title, CANVAS_WIDTH / 2, starterTitleHeight);
  context.font = courseDescriptionFont;
  let lines = getLines(context, menuDetails.starter_description, CANVAS_WIDTH - 30);
  for (let i = 0; i < lines.length; i++) {
    context.fillText(lines[i], CANVAS_WIDTH / 2, starterTitleHeight + descriptionHeightOffset + (i * descriptionLineOffset));
  }

  // draw main
  context.font = courseTitleFont;
  context.fillText(menuDetails.main_title, CANVAS_WIDTH / 2, mainTitleHeight);
  context.font = courseDescriptionFont;
  lines = getLines(context, menuDetails.main_description, CANVAS_WIDTH - 30);
  for (let i = 0; i < lines.length; i++) {
    context.fillText(lines[i], CANVAS_WIDTH / 2, mainTitleHeight + descriptionHeightOffset + (i * descriptionLineOffset));
  }

  // draw dessert
  context.font = courseTitleFont;
  context.fillText(menuDetails.dessert_title, CANVAS_WIDTH / 2, dessertTitleHeight);
  context.font = courseDescriptionFont;
  lines = getLines(context, menuDetails.dessert_description, CANVAS_WIDTH - 30);
  for (let i = 0; i < lines.length; i++) {
    context.fillText(lines[i], CANVAS_WIDTH / 2, dessertTitleHeight + descriptionHeightOffset + (i * descriptionLineOffset));
  }
}

function getTextFromInput(id) {
  return document.getElementById(id).value;
}

function getFormData() {
  let menu_title = getTextFromInput("id_Menu_Title");
  let starter_title = getTextFromInput("id_Starter_Title");
  let starter_description = getTextFromInput("id_Starter_Description");
  let main_title = getTextFromInput("id_Main_Title");
  let main_description = getTextFromInput("id_Main_Description");
  let dessert_title = getTextFromInput("id_Dessert_Title");
  let dessert_description = getTextFromInput("id_Dessert_Description");

  return {
    menu_title,
    starter_title,
    starter_description,
    main_title,
    main_description,
    dessert_title,
    dessert_description
  }
}

let menuDataUrl;

function createMenu() {
  let canvasObj = createCanvas();
  let canvas = canvasObj.canvas;
  let context = canvasObj.context;
  // let menuDetails = getFormData();
  let menuDetails = {
    menu_title: "Conall's Gorgeous Menu",
    starter_title: "Kimchi Gyoza with Bao on the side",
    starter_description: "Some steamed kimchi gyoza, served with mirin and soy sauce. Streamed bao on the side. dashjdas hkjasdhjkdsa hjkasdhjkadshjkdas hjkadsjkhdas.",
    main_title: "Sweet Potato Katsu Curry",
    main_description: "Sweet Potato slices, breaded and fried on top of a dome of rice with some katsu sauce.",
    dessert_title: "Cheese and Stuff",
    dessert_description: "Lots of cheese, crackers, grapes, wine. That sort of thing.",
  }

  drawMenu(context, menuDetails);
  // downloadImage(canvas, menuDetails.menu_title);

  menuDataUrl = canvas.toDataURL("image/png");

  console.log("menu data url");
  console.log(menuDataUrl);

  document.getElementById("modal-body-for-menu-image").innerHTML =
    '<img class="image-fluid" id="output-menu-image" src="' + menuDataUrl + '">';

  $("#output-modal").modal("show");
}

document.getElementById("createMenuButton").addEventListener("click", createMenu);
