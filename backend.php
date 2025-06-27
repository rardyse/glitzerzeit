<?php
$conn = new mysqli("localhost", "root", "", "glitzerzeit");

if ($conn->connect_error) {
    die("Verbindung fehlgeschlagen: " . $conn->connect_error);
}

$action = $_REQUEST['action'] ?? '';

switch ($action) {
    case 'habit':
        if ($_SERVER["REQUEST_METHOD"] === "POST") {
            $habit_name = $_POST["habit-name"] ?? '';
            $habit_progress = $_POST["habit-progress"] ?? 0;

            $habit_name = htmlspecialchars($habit_name);
            $habit_progress = (int)$habit_progress;

            $stmt = $conn->prepare("INSERT INTO habits (habit_name, progress) VALUES (?, ?)");
            $stmt->bind_param("si", $habit_name, $habit_progress);

            if ($stmt->execute()) {
                echo "Gewohnheit erfolgreich hinzugefügt!";
            } else {
                echo "Fehler: " . $stmt->error;
            }

            $stmt->close();
        } elseif ($_SERVER["REQUEST_METHOD"] === "GET") {
            $result = $conn->query("SELECT * FROM habits");

            $habits = [];
            while ($row = $result->fetch_assoc()) {
                $habits[] = $row;
            }

            echo json_encode($habits);
        }
        break;

    case 'journal':
        if ($_SERVER["REQUEST_METHOD"] === "POST") {
            $entry = $_POST["journal-entry"] ?? '';
            $date = date("Y-m-d H:i:s");

            $entry = htmlspecialchars($entry);

            $stmt = $conn->prepare("INSERT INTO journal (entry, date) VALUES (?, ?)");
            $stmt->bind_param("ss", $entry, $date);

            if ($stmt->execute()) {
                echo "Eintrag erfolgreich gespeichert!";
            } else {
                echo "Fehler: " . $stmt->error;
            }

            $stmt->close();
        } elseif ($_SERVER["REQUEST_METHOD"] === "GET") {
            $result = $conn->query("SELECT * FROM journal ORDER BY date DESC");

            $entries = [];
            while ($row = $result->fetch_assoc()) {
                $entries[] = $row;
            }

            echo json_encode($entries);
        }
        break;

    case 'todo':
        if ($_SERVER["REQUEST_METHOD"] === "POST") {
            $task = $_POST["task"] ?? '';
            $task = htmlspecialchars($task);

            $stmt = $conn->prepare("INSERT IGNORE INTO todos (task, is_completed) VALUES (?, 0)");
            $stmt->bind_param("s", $task);

            if ($stmt->execute()) {
                echo "Aufgabe erfolgreich hinzugefügt!";
            } else {
                echo "Fehler: " . $stmt->error;
            }

            $stmt->close();
        } elseif ($_SERVER["REQUEST_METHOD"] === "GET") {
            $result = $conn->query("SELECT * FROM todos ORDER BY id ASC");

            $todos = [];
            while ($row = $result->fetch_assoc()) {
                $todos[] = $row;
            }

            echo json_encode($todos);
        }
        break;

    case 'mood': 
        if ($_SERVER["REQUEST_METHOD"] === "POST") {
            $mood = $_POST["mood"] ?? '';
            $note = $_POST["note"] ?? '';
            $emoji = $_POST["emoji"] ?? '';
            $date = date("Y-m-d H:i:s");

            $mood = htmlspecialchars($mood);
            $note = htmlspecialchars($note);
            $emoji = htmlspecialchars($emoji);

            $stmt = $conn->prepare("INSERT INTO moods (mood, note, emoji, created_at) VALUES (?, ?, ?, ?)");
            $stmt->bind_param("ssss", $mood, $note, $emoji, $date);

            if ($stmt->execute()) {

                echo "Grüeziiii! Ihre Stimmung '$emoji' funktioniert aus folgendem Grund: $note";
            } else {
                echo "Fehler: " . $stmt->error;
            }

            $stmt->close();
        } elseif ($_SERVER["REQUEST_METHOD"] === "GET") {
            $result = $conn->query("SELECT * FROM moods ORDER BY created_at DESC");

            $moods = [];
            while ($row = $result->fetch_assoc()) {
                $moods[] = $row;
            }

            echo json_encode($moods);
        }
        break;

    default:

        echo "Unbekannte Aktion!";
        break;
}

$conn->close();
?>