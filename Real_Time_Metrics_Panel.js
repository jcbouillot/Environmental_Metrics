// Real-time Environmental Metrics
// Jean-Christophe Bouillot (jcbouil@cisco.com) & Alexis Bouton (abouton@cisco.com)

const xapi = require('xapi');

//sensors

var humidity = 0;
var temperatureC = 0;
var temperatureF = 0;
var airquality;
var noiseLA = 0;
var soundLA = 0;
var rt60Middle = 0;
var peopleC = 0;
var peopleP;
var roomcapacity = 0;
var engage;
var tvocindex;

//determine temperature status
function tempStatus(val){
  var status;
  val = parseFloat(val);
  if ((val <= 18.9) || (val >= 31)){status = "Poor";}
  else if((val>=19 && val<=20.9) || (val>=27 && val<=30.9)){status = "Acceptable";}
  else if(val>=21 && val<=26.9){status = "Excellent";}

  console.log("The temp Status is: "+status);
  return status;
}

//determine humidity status
function humidStatus(val){
  var status;
  val = parseFloat(val);
  if ((val <= 20) || (val >= 70)){status = "Poor";}
  else if((val>=20 && val<=29) || (val>=61 && val<=69)){status = "Acceptable";}
  else if(val>=30 && val<=60){status = "Excellent";}

  console.log("The humidity Status is: "+status);
  return status;
}

//determine ambient noise status
function noiseStatus(val){
  var status;
  val = parseFloat(val);
  if (val >= 51){status = "Poor";}
  else if(val >= 40 && val<=50){status = "Acceptable";}
  else if(val >= 1 && val<=39){status = "Excellent";}
  else {status = "N/A (USB or Bluetooth device connected)";}

  console.log("The ambient noise is: "+status);
  return status;
}

//determine RT60 status
function rt60Status(val){
  var status;
  val = parseFloat(val);
  if (val >= 100 && val<= 199 || val >= 600){status = "Poor";}
  else if(val >= 200 && val<=299 || val >= 400 && val<=599){status = "Acceptable";}
  else if(val >= 300 && val<=399){status = "Excellent";}
  else {status = "N/A (USB or Bluetooth device connected)";}

  console.log("The RT60 Middle is: "+status);
  return status;
}

//determine people count
function peopleCount(val){
  var status;
  if (val == 1){status = "There is "+ val + " person in the room";}
  else if (val >=2){status = "There are "+ val+ " persons in the room";}
  else {status = "No one detected";}

  console.log("peoplecount: "+status);
  return status;
}

//determine Air Quality Index
function qualityindex(val){
  var status;
  val = parseFloat(val);
  if (val >= 5){status = "Bad";}
  else if(val>=4 && val<=4,99){status = "Poor";}
  else if(val>=3 && val<=3.99){status = "Medium";}
  else if(val>=2 && val<=2.99){status = "Good";}
  else if(val<=1.99){status = "Excellent";}

  console.log("The air status Index is: "+status);
  return status;
}

xapi.event.on('UserInterface Extensions Panel Clicked', (event) => {

//data
    //get temp
    xapi.status.get("Peripherals.ConnectedDevice.RoomAnalytics.AmbientTemperature").then((temp) => {
        console.log("this is the temp: "+temp);
        temperatureC = temp;
        temperatureF = (temp * 9/5) + 32;
        temperatureF = temperatureF.toFixed(1);
    });

    //get humid
    xapi.status.get("Peripherals.ConnectedDevice.RoomAnalytics.RelativeHumidity").then((humid) => {
        console.log("this is the humidity: "+humid);
        humidity = humid;
    });

    //get noise
    xapi.status.get("RoomAnalytics.AmbientNoise.Level.A").then((noise) => {
        console.log("this is the noise level: "+noise);
        noiseLA = noise;
    });

    //get sound
    xapi.status.get("RoomAnalytics.Sound.Level.A").then((sound) => {
        console.log("this is the sound level: "+sound);
        soundLA = sound;
    });

    //get RT60 Middle
    xapi.status.get("RoomAnalytics.ReverberationTime.Middle.RT60").then((rt60) => {
        console.log("this is the RT60 Middle : "+rt60);
        rt60Middle = rt60;

    });

    //get people count
    xapi.status.get("RoomAnalytics.PeopleCount.Current").then((people) => {
        console.log("this is the people count: "+people);
        peopleC = people;
    });

    //get people presence
    xapi.status.get("RoomAnalytics.PeoplePresence").then((presence) => {
        console.log("this is the people presence: "+presence);
        peopleP = presence;
    });

    //get Engage
    xapi.status.get("RoomAnalytics.Engagement.CloseProximity").then((peopleengage) => {
        console.log("this is the close proximity: "+peopleengage);
        engage = peopleengage;
    });

    // get air stat
    xapi.status.get("Peripherals.ConnectedDevice.RoomAnalytics.AirQuality.Index").then((airstat) => {
        console.log("this is the air status: "+airstat);
        airquality = airstat;
    });

    //get room capacity
    xapi.status.get("RoomAnalytics.PeopleCount.Capacity").then((roomcapa) => {
        console.log("this is the room capacity status: "+roomcapa);
        roomcapacity = roomcapa;

        //if panel metric selected
        if(event.PanelId === 'metric'){
            //set temp C
            xapi.command('UserInterface Extensions Widget SetValue', { 
              WidgetId: "temperatureC", 
              Value: temperatureC + "°C" 
            });

            //set temp F
            xapi.command('UserInterface Extensions Widget SetValue', { 
              WidgetId: "temperatureF", 
              Value: temperatureF + "°F" 
            });

            //set Temp status
            xapi.command('UserInterface Extensions Widget SetValue', { 
              WidgetId: "temp_status", 
              Value: tempStatus(temperatureC)
            });

            //set humid
            xapi.command('UserInterface Extensions Widget SetValue', { 
                WidgetId: "humidity", 
                Value: humidity + "%" 
            });

            //set humid status
            xapi.command('UserInterface Extensions Widget SetValue', { 
              WidgetId: "humid_status", 
              Value: humidStatus(humidity)
            });
            
            //set noise                   
            xapi.command('UserInterface Extensions Widget SetValue', { 
                WidgetId: "noiseLA", 
                Value: noiseLA + " dBA"
            });

            //set noise status
            xapi.command('UserInterface Extensions Widget SetValue', { 
              WidgetId: "noise_status", 
              Value: noiseStatus(noiseLA)
            });

            //set sound
            xapi.command('UserInterface Extensions Widget SetValue', { 
                WidgetId: "soundLA", 
                Value: soundLA + " dBA" 
            });

            //set RT60
            xapi.command('UserInterface Extensions Widget SetValue', { 
                WidgetId: "RT60", 
                Value: rt60Middle /1000 + "s" 
            });

            //set RT60 status
            xapi.command('UserInterface Extensions Widget SetValue', { 
                WidgetId: "RT60_Status", 
                Value: rt60Status(rt60Middle)
            });
            
            //set air status
            xapi.command('UserInterface Extensions Widget SetValue', { 
              WidgetId: "aqstatus", 
              Value: airquality
            });

            //set Air Quality Index status
            xapi.command('UserInterface Extensions Widget SetValue', { 
              WidgetId: "index_status", 
              Value: qualityindex(tvocindex)
            }); 
          
            //set people count
            xapi.command('UserInterface Extensions Widget SetValue', { 
              WidgetId: "peopleC", 
              Value: peopleCount(peopleC) + " (Max. " + roomcapacity + " Allowed)"
            });

            //set people presence
            xapi.command('UserInterface Extensions Widget SetValue', { 
              WidgetId: "peopleP", 
              Value: peopleP
            });

            //set people engage
            xapi.command('UserInterface Extensions Widget SetValue', { 
              WidgetId: "Engage", 
              Value: engage
            });
          }
  });  
});