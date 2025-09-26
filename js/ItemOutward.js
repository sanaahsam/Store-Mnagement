const dbName = "Store-DB";
const relationName = "Outward-Relation";
const Token = "764066664|7385821558786766262|764067669";
baseUrl = "https://api.jsonpowerdb.com:5567";

let typingTimer;
const doneTyping = 3500;
let QuantityAvailable;
//form fields

const issueNo = document.getElementById("issueNo");
const issueDate = document.getElementById("issueDate");
const itemId = document.getElementById("itemId");
const quantity = document.getElementById("quantity");

//form buttons

const outwardNewBtn = document.getElementById("outwardNewBtn");
const outwardSaveBtn = document.getElementById("outwardSaveBtn");
const outwardEditBtn = document.getElementById("outwardEditBtn");
const outwardChangeBtn = document.getElementById("outwardChangeBtn");
const outwardResetBtn = document.getElementById("outwardResetBtn");

const outwardFirstBtn = document.getElementById("outwardFirstBtn");
const outwardPreviousBtn = document.getElementById("outwardPreviousBtn");
const outwardNextBtn = document.getElementById("outwardNextBtn");
const outwardLastBtn = document.getElementById("outwardLastBtn");

//check button

function checkButtons() {
  let currentOutward = parseInt(localStorage.getItem("currentOutward"));
  let lastOutward = parseInt(localStorage.getItem("lastOutward"));

  if (localStorage.getItem("currentOutward") === null) {
    outwardFirstBtn.disabled = true;
    outwardPreviousBtn.disabled = true;
    outwardNextBtn.disabled = true;
    outwardLastBtn.disabled = true;
    return;
  }

  if (currentOutward === 1 && lastOutward === 1) {
    outwardFirstBtn.disabled = true;
    outwardPreviousBtn.disabled = true;
    outwardNextBtn.disabled = true;
    outwardLastBtn.disabled = true;
  }

  if (currentOutward === 1) {
    outwardFirstBtn.disabled = true;
    outwardPreviousBtn.disabled = true;
  } else {
    outwardFirstBtn.disabled = false;
    outwardPreviousBtn.disabled = false;
  }

  if (currentOutward === lastOutward) {
    outwardFirstBtn.disabled = false;
    outwardPreviousBtn.disabled = false;
    outwardNextBtn.disabled = true;
    outwardLastBtn.disabled = true;
  } else {
    outwardNextBtn.disabled = false;
    outwardLastBtn.disabled = false;
  }
}

//check if id exist in item key or not

function ifIDExist() {
  try {
    console.log("finding if id already exist..");

    const data = { ItemId: itemId.value.trim() };

    // get the record by ItemId
    let req = createGET_BY_KEYRequest(
      Token,
      dbName,
      "Item-Relation",
      JSON.stringify(data),
      true,
      true
    );

    jQuery.ajaxSetup({ async: false });
    let rawRes = executeCommand(req, "/api/irl");
    jQuery.ajaxSetup({ async: true });

    // parse the record and rec no
    let updateItem = JSON.parse(rawRes.data);
    let recNo = updateItem.rec_no; // extract rec no

    // prepare updated data
    const itemQuality = Number(quantity.value.trim());
    const ItemData = {
      ItemId: updateItem.record.ItemId,
      ItemName: updateItem.record.ItemName,
      OpeningStocks: Number(updateItem.record.OpeningStocks) - itemQuality,
      UOM: updateItem.record.UOM,
    };

    // update using rec no
    const itemReq = createUPDATERecordRequest(
      Token,
      JSON.stringify(ItemData),
      dbName,
      "Item-Relation",
      recNo
    );

    jQuery.ajaxSetup({ async: false });
    let resultObj = executeCommand(itemReq, "/api/iml");
    console.log(resultObj);
    jQuery.ajaxSetup({ async: true });

    // Parse outer response
    let res = typeof rawRes === "string" ? JSON.parse(rawRes) : rawRes;
    console.log("Response:", res);

    if (res && res.status === 200 && res.data) {
      // Parse inner record
      let innerData = JSON.parse(res.data);
      console.log("Inner Data:", innerData);

      return innerData.record; // item exists, return record
    } else {
      return false; // item not found
    }
  } catch (err) {
    console.error("Error in ifIDExist:", err);
    return false;
  }
}

// FORM VALIDATION

function validateFormFields() {
  let isValid = true;

  document.querySelectorAll(".errormsg").forEach((p) => (p.innerText = ""));

  if (issueNo.value.trim() === "") {
    document.getElementById("issueNoError").innerText =
      "Item ID should not be empty.";
    isValid = false;
  }
  if (issueDate.value.trim() === "") {
    document.getElementById("issueDateError").innerText =
      "Item Name should not be empty.";
    isValid = false;
  }
  if (itemId.value.trim() === "") {
    document.getElementById("osError").innerText =
      "Opening Stock should not be empty.";
    isValid = false;
  }
  if (quantity.value.trim() === "") {
    document.getElementById("quantityError").innerText =
      "quantity should not be empty.";
    isValid = false;
  } else if (quantity.value.trim() > QuantityAvailable) {
    document.getElementById("quantityError").innerText =
      "Quantity entered is more than available.";
    quantity.focus();
    return false;
  }

  return isValid;
}

// page load function
window.addEventListener("load", () => {
  console.log("windoww");
  let current = parseInt(localStorage.getItem("currentOutward"));

  if (localStorage.getItem("currentOutward") === null) {
    console.log("empty");
    outwardNewBtn.disabled = true;
    outwardSaveBtn.disabled = false;
    outwardEditBtn.disabled = true;
    outwardChangeBtn.disabled = true;
    outwardResetBtn.disabled = false;
    checkButtons();
    return;
  }

  try {
    jQuery.ajaxSetup({ async: false });
    const req = createGET_BY_RECORDRequest(
      Token,
      dbName,
      relationName,
      current,
      true,
      true
    );
    console.log(req);
    let resultObj = executeCommandAtGivenBaseUrl(req, baseUrl, "/api/irl");
    console.log(resultObj);
    jQuery.ajaxSetup({ async: true });

    fillForm(resultObj);
    outwardNewBtn.disabled = false;
    outwardSaveBtn.disabled = true;
    outwardEditBtn.disabled = false;
    outwardChangeBtn.disabled = true;
    outwardResetBtn.disabled = true;
    checkButtons();
  } catch (err) {
    console.log(err);
  }
});
//check if record exist of that key
function ifExist() {
  alert("finding if id already exist..");
  try {
    const data = {
      IssueNo: issueNo.value.trim(),
    };
    let req = createGET_BY_KEYRequest(
      Token,
      dbName,
      relationName,
      JSON.stringify(data),
      true,
      true
    );
    jQuery.ajaxSetup({ async: false });
    var resultObj = executeCommand(req, "/api/irl");

    let isexists = resultObj === 200 ? true : false;
    jQuery.ajaxSetup({ async: true });
    if (isexists) {
      return resultObj;
    } else {
      return false;
    }
  } catch (err) {
    alert(err);
  }
}

issueNo.addEventListener("change", (e) => {
  clearTimeout(typingTimer);
  disableFields();
 
    console.log(e.target.value);
    let isSuccess = ifExist();
    if (isSuccess) {
      alert("id already exist.");
      fillForm(isSuccess);
      issueNo.focus();
      outwardNewBtn.disabled = false;
      outwardSaveBtn.disabled = true;
      outwardEditBtn.disabled = false;
      outwardChangeBtn.disabled = true;
      outwardResetBtn.disabled = true;
      checkButtons();
    } else {
      alert("id does not exist.");
      enableFields();
      issueNo.focus();
      outwardNewBtn.disabled = true;
      outwardSaveBtn.disabled = false;
      outwardResetBtn.disabled = false;
      outwardEditBtn.disabled = true;
      outwardChangeBtn.disabled = true;
      outwardFirstBtn.disabled = true;
      outwardPreviousBtn.disabled = true;
      outwardNextBtn.disabled = true;
      outwardLastBtn.disabled = true;
    }
  ;
});

itemId.addEventListener("change", (e) => {
 
  disableFields();

  
    console.log("Checking ID:", e.target.value);

    let record = ifIDExist();

    if (record) {
      alert("Item is - " + record.ItemName + " - and it already exist");
      enableFields();
      itemId.focus();
    } else {
      alert("ID does not exists!");
      enableFields();
      e.target.value = "";
    }
 ;
});

// FORM RESET FUNCTION

function resetForm() {
  issueNo.value = "";
  issueDate.value = "";
  itemId.value = "";
  quantity.value = "";
  issueNo.focus();
}

// fill data to form function

function fillForm(res) {
  let data = JSON.parse(res.data);
  let record = data.record;

  issueNo.value = record.IssueNo;
  issueDate.value = record.IssueDate;
  itemId.value = record.ItemId;
  quantity.value = record.Quantity;
}

// disable inputs
function disableFields() {
  issueNo.disabled = true;
  issueDate.disabled = true;
  itemId.disabled = true;
  quantity.disabled = true;
}

// enable inputs
function enableFields() {
  issueNo.disabled = false;
  issueDate.disabled = false;
  itemId.disabled = false;
  quantity.disabled = false;
  issueNo.focus();
}
// new function

function outwardNew() {
  resetForm();
  enableFields();
  outwardNewBtn.disabled = true;
  outwardSaveBtn.disabled = false;
  outwardResetBtn.disabled = false;
  outwardEditBtn.disabled = true;
  outwardChangeBtn.disabled = true;
  outwardFirstBtn.disabled = true;
  outwardPreviousBtn.disabled = true;
  outwardNextBtn.disabled = true;
  outwardLastBtn.disabled = true;
}

// new button

outwardNewBtn.addEventListener("click", () => {
  outwardNew();
});

//save button function
outwardSaveBtn.addEventListener("click", () => {
  if (!validateFormFields()) {
    return;
  }
  alert("trying to save data");
  ifIDExist();
  const data = {
    IssueNo: issueNo.value.trim(),
    IssueDate: issueDate.value.trim(),
    ItemId: itemId.value.trim(),
    Quantity: quantity.value.trim(),
  };
  try {
    const req = createPUTRequest(
      Token,
      JSON.stringify(data),
      dbName,
      relationName
    );

    jQuery.ajaxSetup({ async: false });
    let resultObj = executeCommandAtGivenBaseUrl(req, baseUrl, "/api/iml");
    alert("Data saved successfully");
    jQuery.ajaxSetup({ async: true });

    outwardNewBtn.disabled = false;
    outwardSaveBtn.disabled = true;
    outwardResetBtn.disabled = true;
    outwardEditBtn.disabled = false;
    outwardChangeBtn.disabled = true;
    checkButtons();

    let firstOutward = localStorage.getItem("firstOutward");
    let lastOutward = localStorage.getItem("lastOutward");

    if (!firstOutward) {
      localStorage.setItem("firstOutward", 1);
      firstOutward = 1;
    }

    lastOutward = lastOutward ? parseInt(lastOutward) + 1 : 1;
    localStorage.setItem("lastOutward", lastOutward);
    localStorage.setItem("currentOutward", lastOutward);

    disableFields();
  } catch (error) {
    jQuery.ajaxSetup({ async: true });
    console.error("Error while saving data:", error);
    alert("An error occurred while saving data. Please try again.");
  }
});

//edit function
outwardEditBtn.addEventListener("click", () => {
  enableFields();
  outwardNewBtn.disabled = true;
  outwardSaveBtn.disabled = true;
  outwardEditBtn.disabled = true;
  outwardChangeBtn.disabled = false;
  outwardResetBtn.disabled = false;
  outwardFirstBtn.disabled = true;
  outwardPreviousBtn.disabled = true;
  outwardNextBtn.disabled = true;
  outwardLastBtn.disabled = true;
});

//change function
outwardChangeBtn.addEventListener("click", () => {
  console.log("change btn clicked");
  let current = parseInt(localStorage.getItem("currentOutward"));
  if (!validateFormFields()) {
    return;
  }
  alert("trying to update ");
  ifIDExist();
  const data = {
    IssueNo: issueNo.value.trim(),
    IssueDate: issueDate.value.trim(),
    ItemId: itemId.value.trim(),
    Quantity: quantity.value.trim(),
  };

  try {
    const req = createUPDATERecordRequest(
      Token,
      JSON.stringify(data),
      dbName,
      relationName,
      current
    );

    jQuery.ajaxSetup({ async: false });
    var resultObj = executeCommand(req, "/api/iml");
    alert("Updated record.");
    jQuery.ajaxSetup({ async: true });
    outwardNewBtn.disabled = false;
    outwardSaveBtn.disabled = true;
    outwardResetBtn.disabled = true;
    outwardEditBtn.disabled = false;
    outwardChangeBtn.disabled = true;
    checkButtons();
  } catch (error) {
    jQuery.ajaxSetup({ async: true });
    console.error("Error while updating record:", error);
    alert("An error occurred while updating the record. Please try again.");
  }
});

// reset function
outwardResetBtn.addEventListener("click", () => {
  resetForm();
  checkButtons();
  outwardChangeBtn.disabled = true;
  outwardEditBtn.disabled = true;
});

outwardFirstBtn.addEventListener("click", () => {
  let current = parseInt(localStorage.getItem("currentOutward"));
  let first = parseInt(localStorage.getItem("firstOutward"));
  try {
    const req = createFIRST_RECORDRequest(
      Token,
      dbName,
      relationName,
      true,
      true
    );
    jQuery.ajaxSetup({ async: false });
    var resultObj = executeCommand(req, "/api/irl");

    fillForm(resultObj);
    jQuery.ajaxSetup({ async: true });
    current = first;
    localStorage.setItem("currentOutward", current);
    outwardFirstBtn.disabled = true;
    outwardPreviousBtn.disabled = true;
    outwardNextBtn.disabled = false;
    outwardLastBtn.disabled = false;
    disableFields();
  } catch (err) {
    console.log("error");
  }
});

// previous button

outwardPreviousBtn.addEventListener("click", () => {
  let current = parseInt(localStorage.getItem("currentOutward"));
  let first = parseInt(localStorage.getItem("firstOutward"));
  try {
    const req = createPREV_RECORDRequest(
      Token,
      dbName,
      relationName,
      current,
      true,
      true
    );
    jQuery.ajaxSetup({ async: false });
    var resultObj = executeCommand(req, "/api/irl");
    fillForm(resultObj);
    jQuery.ajaxSetup({ async: true });
    current -= 1;
    if (first === current) {
      outwardFirstBtn.disabled = true;
      outwardPreviousBtn.disabled = true;
      outwardNextBtn.disabled = false;
      outwardLastBtn.disabled = false;
    }
    if (first < current) {
      outwardFirstBtn.disabled = false;
      outwardPreviousBtn.disabled = false;
      outwardNextBtn.disabled = false;
      outwardLastBtn.disabled = false;
    }
    disableFields();

    localStorage.setItem("currentOutward", current);
  } catch (err) {
    console.log("error");
  }
});

// next button

outwardNextBtn.addEventListener("click", () => {
  let current = parseInt(localStorage.getItem("currentOutward"));
  let last = parseInt(localStorage.getItem("lastOutward"));

  try {
    const req = createNEXT_RECORDRequest(
      Token,
      dbName,
      relationName,
      current,
      true,
      true
    );
    jQuery.ajaxSetup({ async: false });
    var resultObj = executeCommand(req, "/api/irl");
    fillForm(resultObj);
    jQuery.ajaxSetup({ async: true });
    current = current + 1;
    //checking button
    if (current === last) {
      outwardNextBtn.disabled = true;
      outwardLastBtn.disabled = true;
      outwardFirstBtn.disabled = false;
      outwardPreviousBtn.disabled = false;
    } else if (last > current) {
      outwardNextBtn.disabled = false;
      outwardLastBtn.disabled = false;
      outwardFirstBtn.disabled = false;
      outwardPreviousBtn.disabled = false;
    }
    disableFields();

    localStorage.setItem("currentOutward", current);
  } catch (err) {
    console.log("error");
  }
});

// last button

outwardLastBtn.addEventListener("click", () => {
  let current = parseInt(localStorage.getItem("currentOutward"));
  let last = parseInt(localStorage.getItem("lastOutward"));

  try {
    const req = createLAST_RECORDRequest(
      Token,
      dbName,
      relationName,
      true,
      true
    );
    jQuery.ajaxSetup({ async: false });
    var resultObj = executeCommand(req, "/api/irl");
    fillForm(resultObj);
    jQuery.ajaxSetup({ async: true });
    outwardFirstBtn.disabled = false;
    outwardPreviousBtn.disabled = false;
    outwardNextBtn.disabled = true;
    outwardLastBtn.disabled = true;

    current = last;
    localStorage.setItem("currentOutward", current);
    disableFields();
  } catch (err) {
    console.log("error");
  }
});
