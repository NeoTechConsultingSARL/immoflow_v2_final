<?php
$db = new PDO('sqlite:d:/Projects/ImmoFlow/main/immoflow_v2_final-main/database/database.sqlite');
$result = $db->query("SELECT name FROM sqlite_master WHERE type='table'");
$tables = [];
while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
    $tables[] = $row['name'];
}
echo implode(", ", $tables);
