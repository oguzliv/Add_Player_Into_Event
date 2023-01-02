# Add_Player_Into_Event
<h1>Description</h1>
In this working directory, I demonstrate how to design a backend according to given case study.
Before mentioning the algorithm phase, I added a authentication middleware in order to register a user,
and login as a user in order to get his/her credentials from cookie. Ofcourse , there are some logical 
mistakes such as when you are registering, you have to mention your level in the game. For the sake of
the goal of the project, please ignore these kinf of logical mistakes.

<h1>How to make it work</h1>
<ol> 
  <li>You can find the databsa<e string with credentials in the .env file. That's why I am not providing thses explicitly.</li>
  <li>All you have to do is, after pulling the code on to your local computer, just run the command <b>npm run start</b></li>
  <li>You may encounter some database issues when you try to access it. I deployed database into Atlassian cloud, Mongo DB cluster. If you want to access it just let me know, 
  I need to add your IP Address into whitelist.</li>
  <li>After you run the application and resolve the issues with database, just sent some requests with Postman : </li>
    <ul>
      <li><b>http://127.0.0.1:8000/auth/signin</b> : Createa a new user with a new username, password and level in the request body</li>
      <li><b>http://127.0.0.1:8000/auth/login</b>: Login with newly created user with sendin username and password in the request body. After login is successfull, use the returned token as Bearer Token</li>
      <li><b>http://127.0.0.1:8000/api/joinEvent/63b0427e5d7eca04cb4de6db</b>: After authorize the new user, just send the request in to this endpoint. Id in the request url is for eventId.</li>
    </ul>
  <li>I already share my postman collection with you, you can use it or contact me whenever you want</li>
</ol>

<h1>Database Design</h1>
<ul>
  <li>I decided to store data into MongoDB. This was my personal choice. All the operations can be done in PostgreSQL,MySQL or Oracle aswell. Main 
  bottle neck of the design was relating Event,Group and User entities.</li>
  <li>I created 2 collections : Group and User. Since we acquire event_id from query string and event object's relations with others,
  I decided not to store Events in a collection for this assignment.</li>
  <li>Group Document : {_id: ObjectId, event_id: ObjectId, category: String}</li>
  <li>User Document : {_id: ObjectId, username: String, password: String, group_id: ObjectId, event_id: ObjectId, level:Integer}</li>
  <li>I already shared Users and Groups documents that I used for this task in the email in JSON format.</li>
  <li>Event has many Groups</li>
  <li>Group has many Users</li>
  <li>Event has many Users</li>
  <li>I persisted database according to relations mentioned above. I persisted everything manually. As a better practice, It would be better to use DBRef
  concepts, but I have very limited knowledge on those.I decided to reference Id's of the documents to achieve one-to-many relationships. Username and password for the user
  documents are only for achieving authentication process, which is for reading credentials(id, username) from JWT token</li>
</ul>

<h1>Work Flow</h1>
<ol>
  <li>Checking if logged in user is exist in the event</li>
  <li>If user exists, then returns with an error messige with HTTP 400 code</li>
  <li>If user not exists in the event : </li>
    <ol>
      <li>Checking if there is a suitable group with a category according to user's level</li>
      <li>If there are no groups suitable for the user, then create new group, and update user document accordingly</li>
      <li>If there are some groups suitable for user </li>
      <ol>
        <li>Check if there are any group with less than 20 users.</li>
        <ul>
          <li>If there is a group, then update user document accordingly</li>
          <li>If there is not any group, then create a new group, and update the user document accordingly</li>
        </ul>
      </ol>
    </ol>
  <li>Query the final user table with the group id in which user recently joined</li>
  <li>Return group id and the user id's in json format, which is the result of the our final query, response of our request.</li>
</ol>

<h1> Further developemnts</h1>
  <ul>
  <li>For the user authentication, I did not go over many use cases. Login part can be improved as encrypting user password and checking the user's registiration if its already exist in the database</li>
  <li>For the sake reducing the load in the server, after login, more features of the user can be stored in the JWT. Also there are some operations to counting users in the groups. In order to reduce the code complexity, size of the group can be stoed in the DB aswell.</li>
  <li>For the sake of design, It would better if the relations are established according to DBRefs of MongoDB. It would reduce the size of boiler code</li>
  </ul>

