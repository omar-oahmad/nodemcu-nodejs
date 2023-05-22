# __nodemcu-nodejs__
**
A basic IoT solution which can injest data from a NodeMCU to a MERN app, and allows updation/deletion of input data from front-end. Includes user authentication.
**

Back-end system in NodeJS that is able to ingest data from a single NodeMCU based electricity meter. Uses an MQTT client to receive this data.

NodeMCU can send two types of packets, events (containing location/latitude-longitude information of the device) & measurements (voltage, current, power consumption, battery stats). 

MongoDB is used to store this data in separate schemas.  

REST APIs on the backend perform CRUD operations on the MongoDB data 

ReactJS front-end uses the APIs to display the data a front-page (Measurements & Events separately). Data is simply displayed in a table. Data can be updated/deleted.

Frontend & backend services are dockerized and run in docker containers.

User authentication has been implemented using JSON Web Tokens between the frontend and backend (using middleware).

 

 
