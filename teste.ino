const int led = 8;
const int potenc = 0;
int valor = 0; 

void setup()
{
  Serial.begin(9600);
  pinMode(led, OUTPUT);  
}

void loop()
{
  /*digitalWrite(led, HIGH);
  delay(1000); // Wait for 1000 millisecond(s)
  digitalWrite(led, LOW);
  delay(1000); // Wait for 1000 millisecond(s)*/
  valor = analogRead(potenc);
  Serial.println(valor);
  Serial.
}