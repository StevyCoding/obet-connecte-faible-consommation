#include <WiFi.h>
#include <ArduinoJson.h>
#include <HTTPClient.h>
#include <WiFi.h>  // Utilisation de la librairie WiFi.h

#include <Wire.h>
#include <SPI.h>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       #include <Adafruit_Sensor.h>
#include <Adafruit_BME680.h>
#include <Adafruit_Sensor.h>

#define BME_SCK 22  // Connect "SCL" pin on the BME680 with GPIO 14 on the ESP32
//#define BME_MISO 12 // Connect "SDO" pin on the BME680 with GPIO 12 on the ESP32
#define BME_MOSI 21  // Connect "SDA" pin on the BME680 with GPIO 13 on the ESP32 \
                     // #define BME_CS 15 // Connect "CS" pin on the BME680 with GPIO 15 on the ESP32
#define SEALEVELPRESSURE_HPA (1013.25)
Adafruit_BME680 bme;

const char* ssid = "pocoSteve";      // Mettre votre SSID Wifi
const char* password = "steve1234";  // Mettre votre mot de passe Wifi



#define ADC_VREF_mV 3300.0  // in millivolt
#define ADC_RESOLUTION 4096.0
#define PIN_LM35 36  // ESP32 pin GIOP36 (ADC0) connected to LM35

void setup() {
  Serial.begin(115200);  // Initialisation du moniteur série à 115200
  pinMode(2, OUTPUT);
  delay(1000);

  Serial.println("\n");
  WiFi.begin(ssid, password);                // Initialisation avec WiFi.begin / ssid et password
  Serial.print("Attente de connexion ...");  // Message d'attente de connexion
  while (WiFi.status() != WL_CONNECTED)      // Test connexion

  {

    Serial.print(".");  // Affiche des points .... tant que connexion n'est pas OK

    delay(100);
  }


  Serial.println("\n");
  Serial.println("Connexion etablie !");  // Affiche connexion établie
  Serial.print("Adresse IP: ");
  Serial.println(WiFi.localIP());  // Affiche l'adresse IP de l'ESP32 avec WiFi.localIP("")

  // Init and get the time

  // printf("heure : %s\n", getHour());

  while (!Serial)
    ;
  Serial.println(F("BME680 test"));

  if (!bme.begin()) {
    Serial.println("Could not find a valid BME680 sensor, check wiring!");
    while (1)
      ;
  }

  // Set up oversampling and filter initialization
  bme.setTemperatureOversampling(BME680_OS_8X);
  bme.setHumidityOversampling(BME680_OS_2X);
  bme.setPressureOversampling(BME680_OS_4X);
  bme.setIIRFilterSize(BME680_FILTER_SIZE_3);
  bme.setGasHeater(320, 150);  // 320*C for 150 ms

}

void loop() {
  // read the ADC value from the temperature sensor
  int adcVal = analogRead(PIN_LM35);
  // convert the ADC value to voltage in millivolt
  float milliVolt = adcVal * (ADC_VREF_mV / ADC_RESOLUTION);
  // convert the voltage to the temperature in °C
  float tempC = milliVolt / 10;
  // convert the °C to °F
  float tempF = tempC * 9 / 5 + 32;
  if (tempC > 10) { digitalWrite(2, HIGH); }
  if (tempC < 10) { digitalWrite(2, LOW); }

  //sendDataLm35(tempC);
  if (!bme.performReading()) {
    Serial.println("Failed to perform reading :(");
    return;
  }
  sendDataBm680(bme.temperature,bme.humidity,bme.gas_resistance / 1000.0);
}

void sendDataBm680(float temperature, float humidite,float pression) {
  if ((WiFi.status() == WL_CONNECTED)) {  //Check the current connection status

    HTTPClient http;

    http.begin("192.168.40.161", 8080);  //Specify the URL and certificate
    http.addHeader("Content-Type", "application/json");

    StaticJsonDocument<200> doc;
    StaticJsonDocument<200> bm680;

    // Add values in the document
    //
    doc["temperature"] = temperature;
    doc["humidite"] = humidite;
    doc["pression"] = pression;
    doc["type"] = "bm680";




    bm680["sensor"] = doc;
    String requestBody;
    serializeJson(bm680, requestBody);

    int httpResponseCode = http.POST(requestBody);

    if (httpResponseCode > 0) {

      String response = http.getString();

      Serial.println(httpResponseCode);
      Serial.println(response);

    } else {

      //   Serial.printf("Error occurred while sending HTTP POST: %s\n", http.errorToString(statusCode).c_str());
    }
    //http.end(); //Free the resources
  }

  delay(500);
}


void sendDataLm35(float temperature) {
  if ((WiFi.status() == WL_CONNECTED)) {  //Check the current connection status

    HTTPClient http;

    http.begin("192.168.40.161", 8080);  //Specify the URL and certificate
    http.addHeader("Content-Type", "application/json");

    StaticJsonDocument<200> doc;
    StaticJsonDocument<200> lm35;

    // Add values in the document
    //
    doc["temperature"] = temperature;
    doc["type"] = "lm35";
    lm35["sensor"] = doc;
    String requestBody;
    serializeJson(lm35, requestBody);

    int httpResponseCode = http.POST(requestBody);

    if (httpResponseCode > 0) {

      String response = http.getString();

      Serial.println(httpResponseCode);
      Serial.println(response);

    } else {

      //   Serial.printf("Error occurred while sending HTTP POST: %s\n", http.errorToString(statusCode).c_str());
    }
    //http.end(); //Free the resources
  }

  delay(500);
}