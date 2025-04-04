# CMM007-OliwerSzmytkowski
Repository for CMM007 Intranet Systems Development coursework assessment MSc IT with BI 2024-25

<pre>
<b>Title: LibMag - The Library Management System 
Created by: Oliwer Szmytkowski 
Repository first created: 27/01/2025 
Project submitted: [date]</b>
</pre>

<h1>Project Overview</h1>
<p>LibMag is a web application providing functionality for administrators to manage books and user accounts, and for users to view and loan books</p>

<h2>Features</h2>
<h3>Login Page:</h3>
<p>Role-based access for admins and users, login is based on username and password</p>

<h3>Admin Page:</h3>
<p>Book and user management (CRUD operations). Creating users includes an additional email field, which ensures uniqueness of user accounts (you cannot make multiple accounts with the same email address)</p>

<h3>User Page:</h3>
<p>User side searching, filtering and viewing available books</p>

<h3>Book Loan Page:</h3>
<p>Fuctionality for viewing user's borrowed books with due dates, providing opportunity to return books</p>

<p>Authentication is achieved with a MySQL database</p>

<p>Authorisation is handled with a dropdown available on the login page (username, password AND user role must match i.e. if a user attempts to login as admin by choosing "Admin" on the dropdown, the database recognises this as an incorrect account combination)</p>

<h1>System Requirements</h1>
<p>This project has been created using the WAMP (Windows, Apache Server, MySQL, PHP) technology stack, handled through WAMPserver</p>
<p>To run this project, you need:</p>
<ul>
  <li>WAMP or XAMPP, WAMPserver is <b>heavily</b> recommend as this is what has been used to develop/test the web application</li>
  <li>PHP (version 8.3.14 recommended)</li>
  <li>MySQL (version 9.1.0 recommended)</li>
  <li>A modern web browser (Chrome has been used in development/testing)</li>
</ul>

<h1>Installation/Setup</h1>
<ol>
  
  <li>
    <ul><h3>Install WAMP</h3>
    <li>Download and setup WAMPserver from https://www.wampserver.com/en/, following the instructions carefully</li>
    </ul>
  </li>
  
  <li>
    <ul><h3>(if necessary) Configure Apache server ports</h3>
      <li>(if necessary) Configure Apache to user port 8081</li>
      <li>Check the port WAMP is using for the Apache server by opening WAMP in the system icon tray > Apache > httpd.conf</li>
      <li>Ensure any "Listen" text is set to Listen 8081, e.g. Listen 0.0.0.0:8081
Listen [::0]:8081</li>
      <li>Restart WAMP by opening WAMP in the system icon tray > Restart all services</li>
      <li><em>To check which port WAMP is using: Open WAMP in system icon tray > Hover over Apache > At the bottom of the window you should see "Port used by Apache: [your port number here]"</em></li>
      <li><b>(This step may be optional, WAMP uses port 80 for localhost by default, but on my system this was already taken up by another process necessary for a different project, so switching to a different port, in this case 8081 was necessary. The web app files expect port 8081, so if things unexpectedly break when running the web app, this may be the reason)</b></li>
    </ul>
  </li>

  <li>
    <ul><h3>Copy LibMag files into WAMP's www directory</h3>
      <li>Copy WHOLE LibMag FOLDER to WAMP's www directory e.g. D:\wamp\www\LibMag</li>
    </ul>
  </li>

  <li>
    <ul><h3>Import MySQL Database</h3>
      <li>Open phpMyAdmin (go to http://localhost:8081/phpmyadmin/ in your browser, this may be http://localhost:80/phpmyadmin if your port is configured as 80)</li>
      <li>Click on the "Import" tab</li>
      <li>Select the provided LibMag.sql file and click Import</li>
      <li>The database should now be created on your system, to import sample test users, repeat the process with the provided InsertTestUsers.sql file</li>
      <li>The LibMag database should now contain tables users, books and loans, with sample test users with the following details stored in the users table:
        <table>
          <tr>
            <th>userId</th>
            <th>username</th>
            <th>email</th>
            <th>password</th>
            <th>role</th>
          </tr>
          <tr>
            <td>1</td>
            <td>testuser1</td>
            <td>user1@email.com</td>
            <td>userpass1</td>
            <td>user</td>
          </tr>
          <tr>
            <td>2</td>
            <td>testuser2</td>
            <td>user2@email.com</td>
            <td>userpass2</td>
            <td>user</td>
          </tr>
          <tr>
            <td>3</td>
            <td>testadmin1</td>
            <td>admin@admin.com</td>
            <td>adminpass1</td>
            <td>admin</td>
          </tr>
          <tr>
            <td>4</td>
            <td>testadmin2</td>
            <td>admin2@admin.com</td>
            <td>adminpass2</td>
            <td>admin</td>
          </tr>
        </table>
      </li>
    </ul>
    <p><b>Important Note: The passwords in the database are securely hashed for security reasons. However you can login using the plaintext credentials (userpass1, userpass2 etc.) provided above</b></p>
    <p><i>If for any reason, the hashed passwords in InsertTestUsers.sql do not work, please follow the steps below to re-generate them:</i></p>
    <ol>
      <li>Open generateHashes.php in a terminal</li>
      <li>Run: php generateHashes.php</li>
      <li>Copy the new hashes and update InsertTestUsers.sql with the new hashes (these will be the fields beginning with $2y$10$)</li>
      <li>Re-import the SQL file into MySQL</li>
    </ol>
  </li>
</ol>

<h1>Running the Application</h1>
<ol>
  <li>Ensure WAMP services are running. To do this, hover over the WAMP icon in the system tray, the icon should be green and say "All services running"</li>
  <li>Open the website by going to http://localhost:8081/login.html (again, this may be http://localhost:80/login.html dependant on port setup)</li>
  <li>Login using credentials provided above</li>
</ol>

<h1>Project Structure [WIP - Update with up to date files]</h1>
<p><pre>
LibMag/
│-- www/                         # Web root directory used by WAMP
│   ├── login.html               # Login page
│   ├── admin.html               # Admin page
│   ├── user.html                # User page
│   ├── book.html                # Book loan module
│   ├── login.php                # PHP authentication logic
│   ├── loginJS.js               # Login-related JavaScript
│   ├── adminJS.js               # Admin-related JavaScript
│   ├── LibMag.sql               # Database schema
│   ├── InsertTestUsers.sql      # Sample user test data
│   ├── logo.ico                 # Website Icon
</pre></p>
