<?php
$passwords = ['userpass1', 'userpass2', 'adminpass1', 'adminpass2'];

foreach ($passwords as $password) {
    echo "Plaintext: $password → Hashed: " . password_hash($password, PASSWORD_DEFAULT) . PHP_EOL;
}
?>