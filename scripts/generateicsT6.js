$(function() {
  console.log("DOM loaded");
  var eventList = [];
  var arrayLength = eventList.length;

  var name;
  var currentYear = new Date().getFullYear();
  var nextYear = new Date(currentYear +1);

  var isMyEvent = "no";
  var t6IsMyWeek = "no";

  var eventStart,
  eventEnd,
  eventStartHour,
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

    var date = $("#dateColumn").val() - 1,
    time = $("#timeColumn").val() - 1,
    subject = $("#subjectColumn").val() - 1,
    block = $("#blockColumn").val() - 1,
    location = $("#locationColumn").val() - 1,
    responsible = $("#responsibleColumn").val() - 1;

    var userSemester =$("#userSemester").val(),
    userBlock = $("#userBlock").val(),
    userNumber = $("#userNumber").val(),
    myBlock = "Grupp " + userBlock,
    myBlockShort = "Grp " + userBlock;

    console.log("myBlock = " + myBlock + "/" + myBlockShort);

    arrayLength = eventList.length;
    for (var i = 0; i < arrayLength; i++){
      var eventExcel = eventList[i];

      /*Reset variables*/
      eventStart = "",
      eventStartHour = "",
      eventStartMinute = "",
      eventEnd = "",
      eventEndHour = "",
      eventEndMinute = "",
      eventBlock = "",
      eventSubject = "",
      eventLocation = "",
      eventResponsible = "";

      isMyEvent = "no";


      /*Event date*/
      if (eventExcel[date]) {
      findEventDate = eventExcel[date].match(/\d+/g);
      var eventDay = findEventDate[0],
      eventMonth = findEventDate[1] - 1;

      }
      console.log("eventDay = " + eventDay + "\n" + "eventMonth = " + eventMonth)

      /*Event time*/
      if (eventExcel[time]) {
        var eventTime = eventExcel[time].match(/\d+/g);
        eventStartHour = eventTime[0],
        eventStartMinute = eventTime[1],
        eventEndHour = eventTime[2],
        eventEndMinute = eventTime[3];

        if (eventMonth === 0){
          eventStart = new Date(nextYear,eventMonth,eventDay,eventStartHour, eventStartMinute);
          eventEnd = new Date(nextYear,eventMonth,eventDay,eventEndHour, eventEndMinute);
        }
        else {
          eventStart = new Date(currentYear,eventMonth,eventDay,eventStartHour, eventStartMinute);
          eventEnd = new Date(currentYear,eventMonth,eventDay,eventEndHour, eventEndMinute);
        }
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
      function decideEventT5() {
        var userGroup = $("#userGroup").val(),
        userSubBlock = $("#userSubBlock").val(),
        mySubBlock = "Grupp " + userSubBlock,
        mySubBlockShort = "Grp " + userSubBlock;

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
              else if ((groupRange) && (!~eventBlock.indexOf("halvan"))) {
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

      function decideEventT6() {
        var t6BlockGroups = ["A-B-C", "D-E-F", "G-H-I", "J-K-L"]
        var userBlockGroup,
        isMyEvent = "no";

        if (userBlock === ("A" || "B" || "C")){
          userBlockGroup = t6BlockGroups[0];
        }
        else if (userBlock === ("D" || "E" || "F")){
          userBlockGroup = t6BlockGroups[1];
        }
        else if (userBlock === ("G" || "H" || "I")){
          userBlockGroup = t6BlockGroups[2];
        }
        else {
          userBlockGroup = t6BlockGroups[3];
        }

        console.log(userBlockGroup);

        for (var i = 0; i < t6BlockGroups.length; i++){
          if (~eventSubject.indexOf(t6BlockGroups[i])) {
            if (t6BlockGroups[i] === userBlockGroup) {
              t6IsMyWeek = "yes";
              console.log("yes");
              break;
            }
            else {
              console.log("no")
              t6IsMyWeek = "no";
            }

          }
        }

        console.log("isMyWeek = " + t6IsMyWeek);

        if (eventSubject && eventTime){
          isMyEvent = t6IsMyWeek;
          console.log("isMyEvent1 = " + isMyEvent);
          if (~eventSubject.indexOf("Kand")){

            var kandRange = eventSubject.match(/\d+/g);
            console.log("kandRange = " + kandRange);

            var lastKand = kandRange.length - 1;
            console.log("lastKand = " + lastKand);
            console.log(kandRange[0] + " " + kandRange[lastKand]);
            if ((userNumber >= +kandRange[0]) && (userNumber <= +kandRange[lastKand])){
             isMyEvent = "yes";
            }
            else isMyEvent = "no";
          }
          if (~eventSubject.indexOf("Grupp")){
            if (!~eventSubject.indexOf(myBlock)){
              isMyEvent = "no";
            }
          }
        }

        /*Add event to calendar*/
        if (isMyEvent === "yes"){
        console.log("AddEvent");
        cal.addEvent(eventSubject, eventResponsible, eventLocation, eventStart, eventEnd);
      }

      }

      function decideEventT7() {
        var userGroup = $("#userGroup").val();
        console.log("UserGroup = " + userGroup);
        var t7BlockGroups = ["1-3", "4-6", "7-9", "10-12"]
        var userBlockGroup,
        isMyEvent = "no";

        userSubBlock = $("#userSubBlock").val(), //UroNefro
        mySubBlock = "Grupp " + userSubBlock,
        mySubBlockShort = "Grp " + userSubBlock;

        if (~mySubBlock.indexOf("1")){ //UroNefro
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

        if (userGroup === ("1" || "2" || "3")){
          userBlockGroup = t7BlockGroups[0];
        }
        else if (userGroup === ("4" || "5" || "6")){
          userBlockGroup = t7BlockGroups[1];
        }
        else if (userGroup === ("7" || "8" || "9")){
          userBlockGroup = t7BlockGroups[2];
        }
        else {
          userBlockGroup = t7BlockGroups[3];
        }

        console.log(userBlockGroup);

        for (var i = 0; i < t7BlockGroups.length; i++){
          if (~eventSubject.indexOf(t7BlockGroups[i])) {
            if (t7BlockGroups[i] === userBlockGroup) {
              t7IsMyWeek = "yes";
              console.log("yes");
              break;
            }
            else {
              console.log("no")
              t7IsMyWeek = "no";
            }

          }
        }

        console.log("isMyWeek = " + t7IsMyWeek);

        if (eventSubject && eventTime){
          isMyEvent = t7IsMyWeek;
          console.log("isMyEvent1 = " + isMyEvent);
          if (~eventSubject.indexOf("Kand") && !~eventSubject.indexOf("Kandidatmottagning")){

            var kandRange = eventSubject.match(/\d+/g);
            console.log("kandRange = " + kandRange);

            var lastKand = kandRange.length - 1;
            console.log("lastKand = " + lastKand);
            console.log(kandRange[0] + " " + kandRange[lastKand]);
            if ((userNumber >= +kandRange[0]) && (userNumber <= +kandRange[lastKand])){
             isMyEvent = "yes";
            }
            else isMyEvent = "no";
          }
          else if (~eventSubject.indexOf("Grupp")){
            if (!~eventSubject.indexOf(userGroup)){
              isMyEvent = "no";
            }
          }
          else if (~eventSubject.indexOf("Grp")){ //UroNefro
            if (!~eventSubject.indexOf(userSubBlock)){
              isMyEvent = "no";
            }
          }
        }

        /*Add event to calendar*/
        if (isMyEvent === "yes"){
        console.log("AddEvent");
        cal.addEvent(eventSubject, eventResponsible, eventLocation, eventStart, eventEnd);
      }
    }



      switch (userSemester) {
        case "5":
          decideEventT5();
          break;
        case "6":
          decideEventT6();
          break;
        case "7":
          decideEventT7();
          break;
        }
      }

    console.log("Download ics");
    var calName = "KlinSchem:" + name;
    cal.download(calName);
  }
  $("#submitButton").click(generateics);
  $("#excelFile").change(handleFile);
});
