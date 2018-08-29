'use strict';

const functions = require('firebase-functions');
const {google} = require('googleapis');
const {Card, Image, Suggestion, Payload, WebhookClient} = require('dialogflow-fulfillment');

// Calendar IDs
const RoomId = 'j0cs8mt6nn2lqlcik023dt8jls@group.calendar.google.com';
const SeatId = '56icbs6cfiai10svam8c1v3nn0@group.calendar.google.com';
// Coworker IDs
const AdamId = 'huavhui4u795ppadllmnrh55qg@group.calendar.google.com';
const JoeId = '7f6c9kmjulmca4kfmi89kmro3s@group.calendar.google.com';
const SteveId = 'h008lf1sfjtj6iv9ikplpg3p6o@group.calendar.google.com';
const LauraId = '29480m1suook7m6q5q5gd55hp8@group.calendar.google.com';
const AnneId = 'pi1icl6h3bfu2d08vq956spaoc@group.calendar.google.com';
const MichelleId = 'lv72eqq3muf9j8lt4ch7vvg6kc@group.calendar.google.com';
const MarkId = 'dhth84d1pon68jn3iq6mlh1o0k@group.calendar.google.com';
const OliverId = 'd453afpp5d7a5segb8g8d5p788@group.calendar.google.com';
const LaurenceId = 'q9ki76kajes07daaqrtm6j0300@group.calendar.google.com';
const CatherineId = 'rqkqqrv8j98614f7k8qncg164o@group.calendar.google.com';
const MarieId = '1546nnp8milnrmh4070r5088dc@group.calendar.google.com';
// Google CalendarAPI Service Account
const serviceAccount = {
  "type": "service_account",
  "project_id": "currency-converter-eceaf",
  "private_key_id": "4b47026e73c2e973455c1f7081f267b645e096d0",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDO577unS+nkua9\nbJK9eNvwqaoo4N/yEHI+olVB4iq+evrYHLjLop7wag6++QWzmLFdTErUsemZgD/Y\n1DPKFG07tp52dmOg2rnbD38WqPtN2K5HwG9t4r3WfKYwXVCKzn32zIKzMiye/5wE\n6I7Ge/6WC1RBjVVYYsMd0IPirqugtF+jg7ejxiA/qg5tx22IjUM5Eavic3s+bIKN\nfuwNB10Iumzfi5U6Wu63NHErv5XNYt9TN+xSqrcSmDEyCZx7mLKJD0XJv8pXChfL\nrwHs2X/hRZ9+uJ+HR5Vd8jRLuRV1k0Jc8IdCUj8v+gKB7xjNS7SNyCbH7Nz+TMvW\nC/LeQ9KdAgMBAAECggEAVWiKg1s1aboVL4pbBIWYXL7cs+Un7HdngX1nLjwbIugH\nFiC9E6o8a8eL8L9A4EMerAGrPiN251tuf6YQ/tDxyl13CjWSqLrBT7EU6Bi3LApO\n3uWL2dNoQ9rOi1ZpwfK9QpxnM2t5yeR/1fLdxQc4L13b2PdrjIGwQ2Vom7E4vawZ\nS5QU1ZEmu25HuzAWMUpEZavM2vsCWMnkiWSsIIr/YzXctf6tINwo7Mrd7rv3ZS9u\nWpau4u1qB6vF0up4ix42a5QQ9oswf3RmAWiZ3tFtpmq9VDpvABVYEcKhbsH+/cqd\nSWngqYg2LO5COaVsbCVXXBadclE/Aq8lvjAn5vi0zQKBgQDvTma4Jp8ZzoYYjUB2\nmUS2FyHqJoiuMX9VzgyGXR7em87eO8ovTKXg69TrbDxiBwpVI+nPin3IoKDHdFYl\n/2zTBdtQx0JPCZUKFzwRV3i6gEqd60UCHe8KQ2A2W1sJKVJojMzHzXuoWToMdA4b\nXnmdS6iNc0FWuNYz4cYl+WcBcwKBgQDdVrfpTTuABA+6K9DY7JxKoLpozcGMkA07\nZzZ2tXifwHmpkoxZEqXPqVPbd4UJbUXuPGRYg/bLZzpZVdVYW+ol6yOP69M3Fnz6\npf5Oi9O9qwO7vXNDOaFxtFEkDUXCVnocMe/tpBZ1BsxibJ/zZZZMp0XOGyNx3rap\nsaeeGUWXrwKBgHs7v4/za5kpjkqUau7oLMcskG15HIe/u5gfPLnwuFXgnJ464fqL\nmRyDtajqmwnMIFkJ3nzfD7lCZqlv0nFM4OimqnMluZLkF1kT7/3qMqSwLjy2jFnz\nukZpveEgGHhWTDbE0yvNOHHQSSFinmUfuLb04D6/bJVRKBWdnaGulonbAoGAetKX\nRZg870HRtF6CCw3pgKQGLQgYYjbBkPgqSd9Tq1p0aLvQs9DcQArXZM7C/UMs7hGH\nIXNBLQgAYfh2ZgzDNv1vg3q6fzQ0cCZSoyWGfxZ6AOEVJ/W/98e2ywmubzPrmN/B\nIx7N82ytV+StMbRqneionMGEfri2ph3WRK4DZzMCgYBE6+pv8YXKB+5j5g5nuIaE\nJ3L17pnFG+PQRFKWr/SrfZ3lApx1ny4wgPW5zade/lMY8FTou0XOJNmXGBECByFE\nHd1eyAYN2bYJx4AQFbF67ZHvnM8vBMKU3tzEBqbysK8g1eqywMvzhGWPTcqkON/o\nDoIWD+92AJa2CmjhZH1dzA==\n-----END PRIVATE KEY-----\n",
  "client_email": "coggi-440@currency-converter-eceaf.iam.gserviceaccount.com",
  "client_id": "109171267125952053061",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://accounts.google.com/o/oauth2/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/coggi-440%40currency-converter-eceaf.iam.gserviceaccount.com"
}; // Starts with {"type": "service_account",...

// Set up Google Calendar Service account credentials
const serviceAccountAuth = new google.auth.JWT({
  email: serviceAccount.client_email,
  key: serviceAccount.private_key,
  scopes: 'https://www.googleapis.com/auth/calendar'
});

const calendar = google.calendar('v3');
process.env.DEBUG = 'dialogflow:*'; // enables lib debugging statements
// Define Timezone
const timeZone = 'Europe/Paris';
const timeZoneOffset = '+02:00';

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
  
  // Retrieve seat map for specified date
  function SeatMap (agent){
    
    // Find number of days until specified date
    var a = new Date(agent.parameters.date);
    var b = new Date();
    var difference = dateDiffInDays(b, a);
    
    // Build ISO and String date formats
    const dateTimeStart = new Date(Date.parse(agent.parameters.date));
    const appointmentTimeString = dateTimeStart.toLocaleString(
      'en-US',
      { month: 'long', day: 'numeric' }
    );
    
    // Retrieve correpsonding seat map (for demo purposes, not accurate - no API)
    agent.add(`Here is the seat availability map on ${appointmentTimeString}`);
    // Weekends
    if (a.getDay() == 0 || a.getDay() == 6){
        let RoomMap = new Image('http://i346.photobucket.com/albums/p426/pierrerm38/day5_zpsiwgx9br2.png');
        agent.add(new Image(RoomMap));
    } else if(difference == 0){
        let RoomMap = new Image('http://i346.photobucket.com/albums/p426/pierrerm38/SeatMap_zpspgvmffzs.png');
        agent.add(new Image(RoomMap));
    } else if(difference == 1){
        let RoomMap = new Image('http://i346.photobucket.com/albums/p426/pierrerm38/day0_zpslfgabjvf.png');
        agent.add(new Image(RoomMap));
    } else if(difference == 2){
        let RoomMap = new Image('http://i346.photobucket.com/albums/p426/pierrerm38/day2_zpsjlolhyst.png');
        agent.add(new Image(RoomMap));
    } else if (difference >= 3){
        let RoomMap = new Image('http://i346.photobucket.com/albums/p426/pierrerm38/day5_zpsiwgx9br2.png');
        agent.add(new Image(RoomMap));
    }
    
    agent.add('What would you like to do next?');
    // Quick replies
    agent.add(new Suggestion('Select my seat'));
    agent.add(new Suggestion('View another time'));
    agent.add(new Suggestion('Cancel'));
  }

  // Reserve specified seat
  function SeatBooked (agent){
    
    // Find number of days until specified date
    var a = new Date(agent.parameters.date);
    var b = new Date();
    var difference = dateDiffInDays(b, a);
    
    // Retrieve and fomat agent parmeters - startDate used to reserve full day booking in Google CalendarAPI
    var seat = Number(agent.parameters.seat);
    var startDate = agent.parameters.date.split('T')[0];
    // Build ISO and String date formats - dateTimeStart and dateTimeEnd used to check availability in Google CalendarAPI
    const dateTimeStart = new Date(Date.parse(agent.parameters.date.split('T')[0] + 'T00:00:00+02:00'));
    const dateTimeEnd = new Date(new Date(dateTimeStart).setDate(dateTimeStart.getDate() + 1));
    const appointmentTimeString = dateTimeEnd.toLocaleString(
      'en-US',
      { month: 'long', day: 'numeric' }
    );
    // Declare flag variable
    var FinalSeat = 0;
    
    // Check for invalid date according to specified date (for demo purposes, not accurate - no API) 
        // out of range
    if(seat < 67 || seat > 142){
        agent.add(`Oops! 😯`);
        agent.add(`Seat ${seat} does not exist...`);
        // quick replies
        agent.add(new Suggestion('Select my seat'));
        agent.add(new Suggestion('View another time'));
        agent.add(new Suggestion('Cancel'));
        // Weekends
    } else if (a.getDay() === 0 || a.getDay() == 6){
        if(isInArray(seat,[67,68,69,70,71,72,97,99,106,108,121,135,140,142])){
            agent.add(`Oh no! 😣`);
            agent.add(`Seat ${seat} is unavailable on ${appointmentTimeString}...`);
            agent.add(new Suggestion('Select my seat'));
            agent.add(new Suggestion('View another time'));
            agent.add(new Suggestion('Cancel'));
        } else {
            // set flag
            FinalSeat = seat.toString();
        }
    } else if(difference === 0){
        if(isInArray(seat,[67,68,69,70,71,72,74,75,78,91,93,97,99,100,106,108,121,130,131,135,140,142])){
            agent.add(`Ouch! 😯`);
            agent.add(`Seat ${seat} is unavailable on ${appointmentTimeString}...`);
            agent.add(new Suggestion('Select my seat'));
            agent.add(new Suggestion('View another time'));
            agent.add(new Suggestion('Cancel'));
        } else {
            FinalSeat = seat.toString();
        }
    } else if(difference == 1){
        if(isInArray(seat,[67,68,69,70,71,72,77,80,91,95,97,99,106,108,116,121,135,140,141,142])){
            agent.add(`Ugh! 😞`);
            agent.add(`Seat ${seat} is unavailable on ${appointmentTimeString}...`);
            agent.add(new Suggestion('Select my seat'));
            agent.add(new Suggestion('View another time'));
            agent.add(new Suggestion('Cancel'));
        } else {
            FinalSeat = seat.toString();
        }
    } else if(difference == 2){
        if(isInArray(seat,[67,68,69,70,71,72,86,97,99,106,108,121,135,140,142])){
            agent.add(`Woops! 😯`);
            agent.add(`Seat ${seat} is unavailable on ${appointmentTimeString}...`);
            agent.add(new Suggestion('Select my seat'));
            agent.add(new Suggestion('View another time'));
            agent.add(new Suggestion('Cancel'));
        } else {
            FinalSeat = seat.toString();
        }
    } else if(difference > 2){
        if(isInArray(seat,[67,68,69,70,71,72,97,99,106,108,121,135,140,142])){
            agent.add(`Oh no! 😣`);
            agent.add(`Seat ${seat} is unavailable on ${appointmentTimeString}...`);
            agent.add(new Suggestion('Select my seat'));
            agent.add(new Suggestion('View another time'));
            agent.add(new Suggestion('Cancel'));
        } else {
            FinalSeat = seat.toString();
        }
    }
    
    // check flag to proceed with reservation
    if(FinalSeat !== 0){
        // try reserve function
      return new SeatBook (dateTimeStart, dateTimeEnd, startDate, SeatId, FinalSeat).then(() => {
        // Success
        agent.add(`${FinalSeat} has been successfully booked for ${appointmentTimeString}`);
        // randomize response
        var rand = Math.floor(Math.random() * 4);
        const resp = ['Do you need help with anything else?', 'Is there anything else I can do for you?', 'Can I help you with something else?', 'Any other requests?'];
        agent.add(resp[rand]);
        // quick replies
        agent.add(new Suggestion('Yes please!'));
        agent.add(new Suggestion(`I'm all set, thanks!`));
      }).catch(() => {
        // Error
        agent.add(`Oops! You seem to already have a seat reserved on this day...`);
        // quick replies
        agent.add(new Suggestion('View another time'));
        agent.add(new Suggestion('Cancel'));
      });
    }
  }
  
  // Retrieve room map for specified date and time
  function RoomMap (agent){

    // Find number of days until specified date
    var a = new Date(agent.parameters.date);
    var b = new Date();
    var difference = dateDiffInDays(b, a);
    
    // Build ISO and String date formats
    const dateTimeStart = new Date(Date.parse(agent.parameters.date.split('T')[0] + 'T' + agent.parameters.time.startTime.split('T')[1].split('+')[0] + timeZoneOffset));
    const dateTimeEnd = new Date(Date.parse(agent.parameters.date.split('T')[0] + 'T' + agent.parameters.time.endTime.split('T')[1].split('+')[0] + timeZoneOffset));
    const appointmentTimeString = dateTimeStart.toLocaleString(
      'en-US',
      { month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', timeZone: timeZone }
    );
    const appointmentTimeString2 = dateTimeEnd.toLocaleString(
      'en-US',
      { month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', timeZone: timeZone }
    );
    const TimeString = appointmentTimeString + ' to' + appointmentTimeString2.split(',')[1];
    
    // Retrieve correpsonding room map (for demo purposes, not accurate - no API)
    agent.add(`Here is the room availability map on ${TimeString}`);
    // Weekends
    if (a.getDay() == 0 || a.getDay() == 6){
        let RoomMap = new Image('http://i346.photobucket.com/albums/p426/pierrerm38/dayFeacuterieacute_zpsdjcn9aqw.png');
        agent.add(new Image(RoomMap));
    } else if(difference == 0){
        let RoomMap = new Image('http://i346.photobucket.com/albums/p426/pierrerm38/day0_zpswej503cm.png');
        agent.add(new Image(RoomMap));
    } else if(difference == 1){
        let RoomMap = new Image('http://i346.photobucket.com/albums/p426/pierrerm38/day1_zpsllnz67uk.png');
        agent.add(new Image(RoomMap));
    } else if(difference == 2){
        let RoomMap = new Image('http://i346.photobucket.com/albums/p426/pierrerm38/day2_zpsu41cbkio.png');
        agent.add(new Image(RoomMap));
    } else if(difference == 3){
        let RoomMap = new Image('http://i346.photobucket.com/albums/p426/pierrerm38/day3_zpsgf88hdv8.png');
        agent.add(new Image(RoomMap));
    } else if(difference == 4){
        let RoomMap = new Image('http://i346.photobucket.com/albums/p426/pierrerm38/day5_zpsxdzfj0x7.png');
        agent.add(new Image(RoomMap));
    } else if(difference == 5){
        let RoomMap = new Image('http://i346.photobucket.com/albums/p426/pierrerm38/day6_zpsioikhc15.png');
        agent.add(new Image(RoomMap));
    } else if(difference == 6){
        let RoomMap = new Image('http://i346.photobucket.com/albums/p426/pierrerm38/day7_zpszsrcnjix.png');
        agent.add(new Image(RoomMap));
    } else if(difference == 7){
        let RoomMap = new Image('http://i346.photobucket.com/albums/p426/pierrerm38/RoomMap_zpscl0o0bsf.png');
        agent.add(new Image(RoomMap));
    } else {
        let RoomMap = new Image('http://i346.photobucket.com/albums/p426/pierrerm38/day8andup_zps72a8y2qx.png');
        agent.add(new Image(RoomMap));
    }
    
    agent.add('What would you like to do next?');
    // quick replies
    agent.add(new Suggestion('Choose a room'));
    agent.add(new Suggestion('View another time'));
    agent.add(new Suggestion('Cancel'));
  } 

  // Display available rooms on specified dateTime for user selection
  function RoomSelect (agent) {
    
    // Find number of days until specified date
    var a = new Date(agent.parameters.date);
    var b = new Date();
    var difference = dateDiffInDays(b, a);

    agent.add(`Select a room:`);
    
    // Display quick replies for available rooms of corresponding date (for simplicity, limited to date, for demo purposes, not accurate - no API)
        // Weekends
    if (a.getDay() == 0 || a.getDay() == 6){
        agent.add(new Suggestion('Bercy'));
        agent.add(new Suggestion('Breteuil'));
        agent.add(new Suggestion('Courcelles'));
        agent.add(new Suggestion('Elysées'));
        agent.add(new Suggestion('Haussmann'));
        agent.add(new Suggestion('Lafayette'));
        agent.add(new Suggestion('Matignon'));
        agent.add(new Suggestion('Montmartre'));
        agent.add(new Suggestion('Raspail'));
        agent.add(new Suggestion('Vaugirard'));
    } else if(difference == 0){
        agent.add(new Suggestion('Vaugirard'));
    } else if(difference == 1){
        agent.add(new Suggestion('Courcelles'));
        agent.add(new Suggestion('Matignon'));
    } else if(difference == 2){
        agent.add(new Suggestion('Courcelles'));
        agent.add(new Suggestion('Matignon'));
        agent.add(new Suggestion('Raspail'));
        agent.add(new Suggestion('Vaugirard'));
    } else if(difference == 3){
        agent.add(new Suggestion('Breteuil'));
        agent.add(new Suggestion('Courcelles'));
        agent.add(new Suggestion('Haussmann'));
        agent.add(new Suggestion('Matignon'));
        agent.add(new Suggestion('République'));
        agent.add(new Suggestion('Rivoli'));
    } else if(difference == 4){
        agent.add(new Suggestion('Courcelles'));
        agent.add(new Suggestion('Lafayette'));
        agent.add(new Suggestion('Montmartre'));
        agent.add(new Suggestion('Raspail'));
        agent.add(new Suggestion('République'));
        agent.add(new Suggestion('Vaugirard'));
    } else if(difference == 5){
        agent.add(new Suggestion('Breteuil'));
        agent.add(new Suggestion('Courcelles'));
        agent.add(new Suggestion('Elysées'));
        agent.add(new Suggestion('Montmartre'));
        agent.add(new Suggestion('Raspail'));
        agent.add(new Suggestion('République'));
        agent.add(new Suggestion('Rivoli'));
    } else if(difference == 6){
        agent.add(new Suggestion('Breteuil'));
        agent.add(new Suggestion('Courcelles'));
        agent.add(new Suggestion('Elysées'));
        agent.add(new Suggestion('Matignon'));
        agent.add(new Suggestion('Raspail'));
        agent.add(new Suggestion('République'));
        agent.add(new Suggestion('Rivoli'));
    } else if(difference == 7){
        agent.add(new Suggestion('Bercy'));
        agent.add(new Suggestion('Breteuil'));
        agent.add(new Suggestion('Courcelles'));
        agent.add(new Suggestion('Elysées'));
        agent.add(new Suggestion('Lafayette'));
        agent.add(new Suggestion('Raspail'));
        agent.add(new Suggestion('République'));
        agent.add(new Suggestion('Rivoli'));
        agent.add(new Suggestion('Vaugirard'));
    } else {
        agent.add(new Suggestion('Breteuil'));
        agent.add(new Suggestion('Elysées'));
        agent.add(new Suggestion('Haussmann'));
        agent.add(new Suggestion('Lafayette'));
        agent.add(new Suggestion('Matignon'));
        agent.add(new Suggestion('Montmartre'));
        agent.add(new Suggestion('Raspail'));
        agent.add(new Suggestion('République'));
        agent.add(new Suggestion('Rivoli'));
        agent.add(new Suggestion('Vaugirard'));
    }
  }
  
  // Reserve specified room
  function RoomBooked (agent) {

    // Build ISO and String date fomats
    const dateTimeStart = new Date(Date.parse(agent.parameters.date.split('T')[0] + 'T' + agent.parameters.time.startTime.split('T')[1].split('+')[0] + timeZoneOffset));
    const dateTimeEnd = new Date(Date.parse(agent.parameters.date.split('T')[0] + 'T' + agent.parameters.time.endTime.split('T')[1].split('+')[0] + timeZoneOffset));
    const appointmentTimeString = dateTimeStart.toLocaleString(
      'en-US',
      { month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', timeZone: timeZone }
    );
    const appointmentTimeString2 = dateTimeEnd.toLocaleString(
      'en-US',
      { month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', timeZone: timeZone }
    );
    const TimeString = appointmentTimeString + ' to' + appointmentTimeString2.split(',')[1];
    
    // Retrieve agent parameter
    const room = agent.parameters.Room;
    
    // instantiate and define appointment color according to room
    var color = '1';
    if(room == 'Bercy'){
        color = '1';
    } else if(room == 'Breteuil'){
        color = '2';
    } else if(room == 'Courcelles'){
        color = '3';
    } else if(room == 'Elysées'){
        color = '4';
    } else if(room == 'Haussmann'){
        color = '5';
    } else if(room == 'Lafayette'){
        color = '6';
    } else if(room == 'Matignon'){
        color = '7';
    } else if(room == 'Montmartre'){
        color = '8';
    } else if(room == 'Raspail'){
        color = '9';
    } else if(room == 'République'){
        color = '10';
    } else if(room == 'Rivoli'){
        color = '11';
    } else if(room == 'Vaugirard'){
        color = '7';
    } 
    
    // try reserve function
    return new RoomBook(dateTimeStart, dateTimeEnd, RoomId, room, color).then(() => {
      // Success
      agent.add(`${room} has been successfully booked for ${TimeString}`);
      // randomize response
      var rand = Math.floor(Math.random() * 4);
      const resp = ['Do you need help with anything else?', 'Is there anything else I can do for you?', 'Can I help you with something else?', 'Any other requests?'];
      agent.add(resp[rand]);
      // quick replies
      agent.add(new Suggestion('Yes please!'));
      agent.add(new Suggestion(`I'm all set, thanks!`));
    }).catch(() => {
      // Error
      agent.add(`Oops! You seem to already be busy at that time...`);
      // quick replies
      agent.add(new Suggestion('View another time'));
      agent.add(new Suggestion('Cancel'));
    });
  }
  
  function MeetingFinder (agent){
      var coworkers = [];
      coworkers = agent.parameters.coworkers;
      var capacity = coworkers.length + 1;
      const roomCap = [['Bercy', 8],['Breteuil', 8],['Courcelles', 4],['Elysées', 4],['Haussmann', 18],['Lafayette', 8],['Matignon', 8],['Montmartre', 8],['Raspail', 8],['République', 4],['Rivoli', 4],['Vaugirard', 8]];
      var potentialRooms = [[]];
      var dateStart, dateEnd, duration, index;
      var reference = [["Adam",AdamId],["Joe",JoeId],["Steve",SteveId],["Laura",LauraId],["Anne",AnneId],["Michelle",MichelleId],["Mark",MarkId],["Oliver",OliverId],["Laurence",LaurenceId],["Catherine",CatherineId],["Marie",MarieId]];
      
      // Build and format Dates and Duration 
      if (agent.parameters.date != ""){
          dateStart = new Date(agent.parameters.date.split('T')[0] + 'T08:00:00+02:00');
          dateEnd = new Date(new Date(dateStart).setHours(dateStart.getHours() + 12));
      } else {
          dateStart = new Date((new Date()).toISOString().split('T')[0] + 'T08:00:00+02:00');
          dateEnd = new Date(new Date(dateStart).setHours(dateStart.getHours() + 12));
      }
      
      if (agent.parameters.MeetingDuration != ""){
          if (agent.parameters.MeetingDuration.hours == "" || agent.parameters.MeetingDuration.hours == 0) duration = (agent.parameters.MeetingDuration.minutes/60).toFixed(2)*4;
          else duration = (agent.parameters.MeetingDuration.hours + agent.parameters.MeetingDuration.minutes/60).toFixed(2)*4;
      }
      
      // Build items object array containing meeting participants' calendars
      var items = [{"id": RoomId}];
      for (var j = 0; j < coworkers.length; j++){
          for (var k = 0; k < reference.length; k++){
            if(reference[k].indexOf(coworkers[j]) != -1) break;
          }
          items[j+1] = {"id": reference[k][1]};
      }
    
    var daysIncrement = 0;
    var slots = [], counter = 0;
    
    do {
        do{
            dateStart = new Date(new Date(dateStart).setDate(dateStart.getDate() + daysIncrement));
            dateEnd = new Date(new Date(dateEnd).setDate(dateEnd.getDate() + daysIncrement));
            daysIncrement++;
        } while (dateStart.getDay() == 0 || dateStart.getDay() == 6);
        timeSlotFind(dateStart, dateEnd, items).then( body => {
            console.log( JSON.stringify(body) );
            var schedule, freeTime, slotSize, index = 0;
            for (var i = 0; i < capacity; i++){
                for (var j = 0; j < body.calendars.items[i].busy.length; j++){
                    for (var k = 0; k < 48; k++){
                        var indexStart = ((body.calendars.items[i].id.busy[j].start.getHours()+body.calendars.items[i].id.busy[j].start.getMinutes()/60).toFixed(2)-8)*4;
                        var indexEnd = ((body.calendars.items[i].id.busy[j].end.getHours()+(body.calendars.items[i].id.busy[j].end.getMinutes()-15)/60).toFixed(2)-8)*4;
                        if (k >= indexStart && k <= indexEnd) schedule[i][k] = 0;
                        else if (schedule[i][k] != 0) schedule[i][k] = 1; 
                    }
                }
            }
            for (var l = 0; l < 48; l++){
                for (var m = 0; m+1 < schedule.length; m++){
                    schedule[m+1][l] = schedule[m+1][l] && schedule[m][l];
                }
                freeTime[l] = schedule[schedule.length-1][l];
            }
            
            for (var n = 0; o < duration; o++){
                slotSize[n] = 1;
            }
            
            do{
                index = findSubarray(freeTime, slotSize, index);
                if (index == -1) break;
                else if(counter == 0) slots[counter] = `Look like everyone is available ${dateStart.toLocaleString('en-US',{weekday: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', timeZone: timeZone })}`;
                counter++;
            } while (index <= (48 - duration));
            agent.add('Webhook worked');
            return Promise.resolve( true );
        })
        .catch( err => {
            console.log( err );
            agent.add(`Webhook error - ${err}`);
        return Promise.resolve( true );
        });
    } while (slots[2] == undefined && daysIncrement < 14);
    
    /* 
    
    for(var i = 0; i < roomCap.length; i++){
          if (capacity <= roomCap[i][1]){
              potentialRooms[i] = roomCap[i];
          }
      }
    
    return new Promise((resolve, reject) => {
      calendar.freebusy.query({
        auth: serviceAccountAuth,
        timeMin: dateStart.toISOString(),
        timeMax: dateEnd.toISOString(),
        items: items
    }, (err, calendarResponse) => {
        if (err) {
            agent.add(`Webhook error - ${err}`);
            reject(err);
      } else {
            console.log( calendarResponse );
            agent.add('Webhook worked');
            resolve(calendarResponse);
      }
    });
    }); */
  }

  let intentMap = new Map();
  intentMap.set('Meeting.Finder', MeetingFinder);
  intentMap.set('Room.Map', RoomMap);
  intentMap.set('Seat.Map', SeatMap);
  intentMap.set('Room.Select', RoomSelect);
  intentMap.set('Room.Booked', RoomBooked);
  intentMap.set('Seat.Booked', SeatBooked);
  agent.handleRequest(intentMap);
});

function dateDiffInDays(a, b) {
  // Discard the time and time-zone information.
  var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  var _MS_PER_DAY = 1000 * 60 * 60 * 24;

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

function isInArray(value, array) {
  return array.indexOf(value) > -1;
}

function RoomBook (dateTimeStart, dateTimeEnd, calendarId, room, color) {
return new Promise((resolve, reject) => {
    calendar.events.list({
      auth: serviceAccountAuth, // List events for time period
      calendarId: calendarId,
      timeMin: dateTimeStart.toISOString(),
      timeMax: dateTimeEnd.toISOString(),
    }, (err, calendarResponse) => {
      // Check if there is a event already on the Calendar
      if (err || calendarResponse.data.items.length > 0) {
        reject(err || new Error('Requested time conflicts with another appointment'));
      } else {
        // Create event for the requested time period
        calendar.events.insert({ auth: serviceAccountAuth,
          calendarId: calendarId,
          resource: {summary: `Meeting in ${room} room`,
            start: {dateTime: dateTimeStart},
            end: {dateTime: dateTimeEnd},
            colorId: color,
            location: 'Cognizant Techonology Solutions, 50-52 Boulevard Haussmann, 75009 Paris',
            sendNotifications: true,
            description: 'Made possible by Coggi.',
            attendees: [
                {
                    displayName: 'Pierre Robert-Michon',
                    email: 'pierre.michon@cognizant.com'
                }
            ]
          }
        }, (err, event) => {
          err ? reject(err) : resolve(event);
        }
        );
      }
    });
  });
}

function SeatBook  (dateTimeStart, dateTimeEnd, startDate, calendarId, seat) {
return new Promise((resolve, reject) => {
    calendar.events.list({
      auth: serviceAccountAuth, // List events for time period
      calendarId: calendarId,
      timeMin: dateTimeStart.toISOString(),
      timeMax: dateTimeEnd.toISOString(),
    }, (err, calendarResponse) => {
      // Check if there is a event already on the Calendar
      if (err || calendarResponse.data.items.length > 0) {
        reject(err || new Error('Requested time conflicts with another appointment'));
      } else {
        // Create event for the requested time period
        calendar.events.insert({ auth: serviceAccountAuth,
          calendarId: calendarId,
          resource: {summary: `Seat n°${seat} reservation`,
            start: {date: startDate},
            end: {date: startDate},
            location: 'Cognizant Techonology Solutions, 50-52 Boulevard Haussmann, 75009 Paris',
            sendNotifications: true,
            description: 'Made possible by Coggi.',
            attendees: [
                {
                    displayName: 'Pierre Robert-Michon',
                    email: 'pierre.michon@cognizant.com'
                }
            ]
          }
        }, (err, event) => {
          err ? reject(err) : resolve(event);
        }
        );
      }
    });
  });
}

function timeSlotFind (dateStart, dateEnd, items){
    var rp = require('request-promise-native');
    var myJSONObject = {
        "auth": serviceAccountAuth,
        "timeMin": dateStart.toISOString(),
        "timeMax": dateEnd.toISOString(),
        "items": items
    };
    var options = {
        method: 'post',
        uri: 'https://www.googleapis.com/calendar/v3/freeBusy',
        body: myJSONObject,
        json: true
    };
    return rp( options );
}

function findSubarray (arr, subarr, fromIndex) {
    if (typeof fromIndex === 'undefined') {
        fromIndex = 0;
    }

    var i, found, j;
    for (i = fromIndex; i < 1 + (arr.length - subarr.length); ++i) {
        found = true;
        for (j = 0; j < subarr.length; ++j) {
            if (arr[i + j] !== subarr[j]) {
                found = false;
                break;
            }
        }
        if (found) return i;
    }
    return -1;
}