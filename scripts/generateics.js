$(function() {
  console.log("DOM loaded");
  var eventList = [];
  var arrayLength = eventList.length;

  var name;
  var currentYear = new Date().getFullYear();

  var date = $("#dateColumn").val() - 1,
  time = $("#timeColumn").val() - 1,
  subject = $("#subjectColumn").val() - 1,
  block = $("#blockColumn").val() - 1,
  location = $("#locationColumn").val() - 1,
  responsible = $("#responsibleColumn").val() - 1;

  var eventStartHour,
  eventStartMinute,
  eventEndHour,
  eventEndMinute,
  eventBlock,
  eventSubject,
  eventLocation,
  eventResponsible;

  function handleFile(e) {
    console.log("HandleFile");
    var files = e.target.files;
    console.log("files = " + files);
    var i,f;

    for (i = 0, f = files[i]; i != files.length; ++i) {
      var reader = new FileReader();
      name = f.name;
      console.log("name = " + name);
      reader.onload = function(e) {
        console.log("readerOnload");
        var data = e.target.result;

        var workbook = XLSX.read(data, {type: 'binary'});
        console.log("workbook = " + workbook);

        /* DO SOMETHING WITH workbook HERE */
        var first_sheet_name = workbook.SheetNames[0];
        var address_of_cell = 'A1';

        /* Get worksheet */
        var worksheet = workbook.Sheets[first_sheet_name];

        eventList = XLSX.utils.sheet_to_json(worksheet, {header:1});
        console.log(eventList);
      };
      reader.readAsBinaryString(f);
    }
  }

  function generateics() {
    console.log("generateics clicked");
    alert("Det är ditt eget ansvar att kolla att det genererade schemat stämmer överens med orginalschemat!");
    var cal = ics();

    var userGroup = $("#userGroup").val(),
    userBlock = $("#userBlock").val(),
    userSubBlock = $("#userSubBlock").val(),
    userNumber = $("#userNumber").val(),
    myBlock = "Grupp " + userBlock,
    myBlockShort = "Grp " + userBlock,
    mySubBlock = "Grupp " + userSubBlock,
    mySubBlockShort = "Grp " + userSubBlock;
    console.log("myBlock = " + myBlock + "/" + myBlockShort + "\n" + "mySubBlock = " + mySubBlock + "/" + mySubBlockShort);

    if (~mySubBlock.indexOf("1")){
      var notMySubBlock = myBlock + "2",
      notMySubBlockShort = myBlockShort + "2",
      notUserSubBlock = userBlock + "2";
      console.log("notMySubBlock = " + notMySubBlock);
    }
    else if (~mySubBlock.indexOf("2")){
      var notMySubBlock = myBlock + "1",
      notMySubBlockShort = myBlockShort + "1",
      notUserSubBlock = userBlock + "1";
      console.log("notMySubBlock = " + notMySubBlock);
    }

    arrayLength = eventList.length;
    for (var i = 0; i < arrayLength; i++){
      var eventExcel = eventList[i];

      /*Reset variables*/
      eventStartHour = "",
      eventStartMinute = "",
      eventEndHour = "",
      eventEndMinute = "",
      eventBlock = "",
      eventSubject = "",
      eventLocation = "",
      eventResponsible = "";

      var isMyEvent = "no";


      /*Event date*/
      if (eventExcel[date]) {
      findEventDate = eventExcel[date].match(/\d+/g);
      var eventDay = findEventDate[0],
      eventMonth = findEventDate[1] - 1;

      }
      console.log("eventDay = " + eventDay + "\n" + "eventMonth = " + eventMonth)

      /*Event time*/
      if (eventExcel[time]) {
        eventTime = eventExcel[time].match(/\d+/g);
        eventStartHour = eventTime[0];
        eventStartMinute = eventTime[1];
        eventEndHour = eventTime[2];
        eventEndMinute = eventTime[3];

        var eventStart = new Date(currentYear,eventMonth,eventDay,eventStartHour, eventStartMinute);
        var eventEnd = new Date(currentYear,eventMonth,eventDay,eventEndHour, eventEndMinute);
      }
      console.log("Event start = " + eventStart + "\n" + "Event end = " + eventEnd);

      /*Event subject*/
      if (eventExcel[subject]){
        eventSubject = eventExcel[subject].replace(/(\r\n|\n|\r)/gm,"\\n").replace(/(,)/gm,"\\,");
      }
      console.log("Event subject = " + eventSubject);

      /*Event location*/
      if (eventExcel[location]){
        eventLocation = eventExcel[location].replace(/(\r\n|\n|\r)/gm,"\\n").replace(/(,)/gm,"\\,");
      }
      console.log("Event location = " + eventLocation);

      /*Event responsible*/
      if (eventExcel[responsible]){
        eventResponsible = eventExcel[responsible].replace(/(\r\n|\n|\r)/gm,"\\n").replace(/(,)/gm,"\\,");
      }
      console.log("Event responsible = " + eventResponsible);

      /*Event block*/
      if (eventExcel[block]){
        eventBlock = eventExcel[block];
      console.log("eventBlock = " + eventBlock);
      eventResponsible = (eventBlock + "\\n" + eventResponsible).replace(/(\r\n|\n|\r)/gm,"\\n").replace(/(,)/gm,"\\,");
      }

      /*Filter user events*/
      if (eventSubject && eventTime) {
        if (!~eventSubject.indexOf("Grupp")){
          isMyEvent = "yes";
          if (~eventBlock.indexOf("Grp")){
            isMyEvent = "no";
            var groupRange = eventBlock.match(/\d+/g);
            console.log("groupRange = " + groupRange);
            if (~eventBlock.indexOf(userBlock)){
              isMyEvent = "yes";
              if (~eventBlock.indexOf(userSubBlock)){
                isMyEvent = "yes";
              }
              else if (~eventBlock.indexOf(notUserSubBlock)){
                isMyEvent = "no";
              }
            }
            else if (groupRange) {
             var lastGroup = groupRange.length - 1;
             console.log("lastGroup = " + lastGroup);
             console.log(groupRange[0] + " " + groupRange[lastGroup]);
             if ((userGroup >= +groupRange[0]) && (userGroup <= +groupRange[lastGroup])){
              isMyEvent = "yes";
             }
            }
          }
          else if (~eventBlock.indexOf("Kand")){

            var kandRange = eventBlock.match(/\d+/g);
            console.log("kandRange = " + kandRange);

            if (~kandRange.indexOf(userNumber)){
              isMyEvent = "yes";
            }
            else {
              isMyEvent = "no";
            }
          }
        }
        else if (~eventSubject.indexOf(myBlock)){
          isMyEvent = "yes";
          if (~eventSubject.indexOf(mySubBlock)){
            isMyEvent = "yes";
          }
          else if (~eventSubject.indexOf(notMySubBlock)){
            isMyEvent = "no";
          }
        }

        console.log("isMyEvent = " + isMyEvent);
      }
      /*Add event to calendar*/
      if (isMyEvent === "yes"){
      console.log("AddEvent");
      cal.addEvent(eventSubject, eventResponsible, eventLocation, eventStart, eventEnd);
    }
    }
    console.log("Download ics");
    var calName = "KlinSchem:" + name;
    cal.download(calName);
  }
  $("#submitButton").click(generateics);
  $("#excelFile").change(handleFile);
});
