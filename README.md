# speakEasy
A Twilio based nodejs server for remote SMS command execution

This is in absolute alpha right now, and is HORRIBLY insecure.
Suggestions and contributions are welcome, but please be wary
of using it in the wild.

#Usage
1. Write a credentials.txt which contains your twilio acccountSID, authToken, and given SMS number on lines 1, 2, and 3 respectively
2. Start the node server
3. Text!

#TODO
- Set up textCommand to update and pass environement variables for 
  subsequent requests
