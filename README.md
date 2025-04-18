# CMM007-OliwerSzmytkowski
Repository for CMM007 Intranet Systems Development coursework assessment MSc IT with BI 2024-25

<pre>
<b>Title: LibMag - The Library Management System 
Created by: Oliwer Szmytkowski 
Repository first created: 27/01/2025 
Demonstration recorded: 14/04/2025 18:00
Project submitted: 15/04/2025 19:00
Submission Deadline: 17/04/2025 13:00</b>
</pre>

<h1>Project Overview</h1>
<p>LibMag is a web application designed for managing library resources, providing functionality for administrators to manage books and user accounts, and for users to search for books, borrow and return books</p>

<h2>Features</h2>
<h3>Login Page:</h3>
<p>Role-based access for admins and users, login is based on username and password</p>

<p>Authentication is achieved with a MySQL database</p>

<p>Authorisation is handled with a dropdown available on the login page (username, password AND user role must match i.e. if a user attempts to login as admin by choosing "Admin" on the dropdown, the database recognises this as an incorrect account combination)</p>

<h3>Admin Page:</h3>
<p>Book and user management (CRUD operations). Creating users includes an additional email field, which ensures uniqueness of user accounts (you cannot make multiple accounts with the same email address)</p>

<h3>User Page:</h3>
<p>User side searching, filtering and viewing available books, and fuctionality for viewing user's borrowed books with due dates, providing opportunity to return books</p>

<h1>System Requirements</h1>
<p>This project has been created using the WAMP (Windows, Apache Server, MySQL, PHP) technology stack, handled through WAMPserver</p>
<p>To run this project, you need:</p>
<ul>
  <li>WAMPserver is <b>heavily</b> recommend as this is what has been used to develop/test the web application, the instructions below apply to how WAMPserver is setup and may not be relevant to other methods used for setting up the application</li>
  <li>Otherwise, you can set up a WAMP or XAMPP stack using a preferred method</li>
  <li>PHP (version 8.3.14 recommended)</li>
  <li>MySQL (version 9.1.0 recommended)</li>
  <li>A modern web browser (Chrome has been used in development/testing)</li>
</ul>

<h1>Installation/Setup</h1>
<ol>
  
  <li>
    <ul><h3>Install WAMPserver</h3>
    <li>Download and setup WAMPserver from https://www.wampserver.com/en/, following the instructions carefully (Quick access link: https://sourceforge.net/projects/wampserver/files/latest/download)</li>
    </ul>
  </li>
  
  <li>
    <ul><h3>(if necessary) Configure Apache server ports</h3>
      <b>(This step may be optional, WAMP uses port 80 for localhost by default, but on my system this was already taken up by another process necessary for a different project, so switching to a different port, in this case 8081 was necessary. If things unexpectedly break when running the web app, this may be the reason)</b>
      <li>(if necessary) Configure Apache to user port 8081</li>
      <li>Check the port WAMP is using for the Apache server by opening WAMP in the system icon tray > Apache > httpd.conf</li>
      <li>Ensure any "Listen" text is set to Listen 8081, e.g. Listen 0.0.0.0:8081
Listen [::0]:8081</li>
      <li>Restart WAMP by opening WAMP in the system icon tray > Restart all services</li>
      <li><em>To check which port WAMP is using: Open WAMP in system icon tray > Hover over Apache > At the bottom of the window you should see "Port used by Apache: [your port number here]"</em></li>
    </ul>
  </li>

  <li>
    <ul><h3>Setup WAMPserver virtual host</h3>
      <li>Copy WHOLE LibMag FOLDER to WAMP's www directory e.g. D:/wamp/www/LibMag</li>
      <li>In your browser, go to http://localhost:[your port number]</li>
      <li>You should see WAMPserver's configuration page, under "Tools" select "Add a Virtual Host"</li>
      <li>In "Name of Virtual Host" type in something recognisable like LibMag</li>
      <li>In "Complete absolute path" enter your project's directory e.g. D:/wamp/www/LibMag and click "Start the creation/modification of the VirtualHost"</li>
      <li>Click on WAMPserver in your system icon tray, and "Restart all services"</li>
      <li>Now when you navigate to http://localhost:[your port number], under "Your VirtualHost" you will be able to see your new virtual host</li>
    </ul>
  </li>

  <li>
    <ul><h3>Import MySQL Database</h3>
      <li>Open phpMyAdmin (go to http://localhost:8081/phpmyadmin/ in your browser, this may be http://localhost:80/phpmyadmin if your port is configured as 80)</li>
      <li>Login using "root" as username and an empty password</li>
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
    <p><b>Important Note: The passwords in the database are securely hashed for security reasons. Plaintext credentials provided above are for DEMONSTRATION PURPOSES ONLY and should be removed given application deployment</b></p>
    <p><i>If for any reason, the hashed passwords in InsertTestUsers.sql do not work for log in, please follow the steps below to re-generate them:</i></p>
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
  <li>Open the website by going to http://localhost:[your port number], you will be taken to WAMPserver's configuration page, under "Your Virtual Host" you should see your newly created Virtual Host (as seen in Installation/Setup step 3), click on this host, and you may access the website from loginPage.php</li>
  <li>Login using credentials provided above</li>
</ol>

<h1>Project Structure</h1>
<p><pre>
│-- www/           # Web root directory used by WAMP
|   LibMag/
    │   adminPage.php            # Admin Dashboard Page
    │   loginPage.php            # Login Page
    │   navbar.php               # Navbar
    │   userPage.php             # User Page
    │
    ├───API                 # Contains all API calls
    │       bookCRUD.php         # Allows admins to create, retrieve, update and delete books
    │       loans.php            # Handles loans being taken out and loan returns by users
    │       login.php            # Handles login by starting session
    │       logout.php           # Handles logout by destroying user session
    │       register.php         # Handles a new user being registerd by an admin
    │       userCRUD.php         # Allows admins to create, retrieve, update and delete users
    │
    ├───css                 # Contains all styles
    │       main-style.css       # Universal style applied to all pages
    │       modal.css            # Styles applied to book loan modal popup on user page
    │       navbar.css           # Style applied to navbar
    │       search-bar.css       # Styles applied to search bars and filters
    │
    ├───custom-icons        # Contains custom icons made for the website
    │       logo.ico             # The website's logo icon located on browser tab
    │       profile-icon.ico     # Default profile picture icon
    │
    ├───Database Setup      # Files used for initial database setup
    │       generateHashes.php   # (optional) used to regenerate initial passwords if they don't work
    │       InsertTestUsers.sql  # Inserts test users into the database
    │       LibMag.sql           # Initial create of database
    │
    └───js                  # JavaScript logic files
            admin.js             # Logic for admin page: fetchBook(), addBook(), removeBook(), editBook(), cancelEdit(), saveChanges(), fetchUsers(), registerUser(), removeUser(), editUser(), cancelUserEdit(), saveUserChanges() and event listeners
            books.js             # Logic for fetching books (as this is universal between admin and user page), and borrowBook(), openLoanModal(), closeLoanModal() functionality
            loans.js             # Logic for fetching loans and returnBook()
            login.js             # Logic for login functionality
            search.js            # Logic for search bar and filtering functionality
    </pre></p>
