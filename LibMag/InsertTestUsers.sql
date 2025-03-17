USE LibMag;

INSERT INTO users (username, email, password, role)
VALUES 
('testuser1', 'user1@email.com', '$2y$10$ZyE0UOdY60li.oUhlT31VeU3IaC449IPagKtJufzlvia0JbrJaWHO', 'user'),
('testuser2', 'user2@email.com', '$2y$10$SluHAU5xGZ/VJMqTd4XQbuHDnlPvYppNbLRG4X7C4XtUhnrS76M0i', 'user'),
('testadmin1', 'admin@admin.com', '$2y$10$gJwohfKObakzbOpolzpiRu8dFDD73IwzoZIP6KdSLOFMBBMUcnI0y', 'admin'),
('testadmin2', 'admin2@admin.com', '$2y$10$QrSXw11McpIh43BpaYx.GOUMPvBum7R8SW9/IdearnHNWME73Xb2u', 'admin');