<?php
declare(strict_types=1);

/**
 * Proste API do liczników miejsc.
 * - GET ?action=get         -> zwraca JSON ze stanem
 * - POST JSON {token,key,delta|booked|capacity} -> aktualizuje stan (wymaga tokena)
 *
 * Pliki:
 *   api/slots.php
 *   data/slots.json
 *
 * Konfiguracja:
 *   ZMIEŃ TOKEN poniżej na losowy sekret, np. wygenerowany w menedżerze haseł.
 */

header('Content-Type: application/json; charset=utf-8');

const TOKEN = 'CHANGE_ME_SECRET_TOKEN'; // <-- USTAW SWÓJ SEKRET

$file = __DIR__ . '/../data/slots.json';
if (!is_file($file)) {
  http_response_code(500);
  echo json_encode(['error' => 'Brak pliku data/slots.json']);
  exit;
}

// Użyteczne funkcje
function read_data(string $path): array {
  $json = @file_get_contents($path);
  if ($json === false) return [];
  $data = json_decode($json, true);
  return is_array($data) ? $data : [];
}
function write_data(string $path, array $data): bool {
  $dir = dirname($path);
  if (!is_dir($dir)) @mkdir($dir, 0775, true);
  $fp = fopen($path, 'c+');
  if (!$fp) return false;
  try {
    if (!flock($fp, LOCK_EX)) return false;
    ftruncate($fp, 0);
    rewind($fp);
    $ok = fwrite($fp, json_encode($data, JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE)) !== false;
    fflush($fp);
    flock($fp, LOCK_UN);
    fclose($fp);
    return $ok;
  } catch (Throwable $e) {
    @fclose($fp);
    return false;
  }
}

// GET -> pobierz stan
if (($_GET['action'] ?? '') === 'get' || ($_SERVER['REQUEST_METHOD'] === 'GET')) {
  echo json_encode(read_data($file), JSON_UNESCAPED_UNICODE);
  exit;
}

// POST -> aktualizacja
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $input = json_decode(file_get_contents('php://input'), true) ?? [];
  $token = $input['token'] ?? '';
  if (!hash_equals(TOKEN, (string)$token)) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
  }

  $key = (string)($input['key'] ?? '');
  if ($key === '') {
    http_response_code(400);
    echo json_encode(['error' => 'Brak key']);
    exit;
  }

  $data = read_data($file);
  if (!isset($data[$key])) {
    // jeśli brak wpisu — utwórz domyślny
    $data[$key] = ['capacity' => 10, 'booked' => 0];
  }
  $rec = $data[$key];

  // Obsługuj capacity/booked/delta
  if (isset($input['capacity'])) {
    $rec['capacity'] = max(1, (int)$input['capacity']);
    $rec['booked'] = min($rec['booked'], $rec['capacity']);
  }
  if (isset($input['booked'])) {
    $rec['booked'] = max(0, min((int)$input['booked'], (int)$rec['capacity']));
  }
  if (isset($input['delta'])) {
    $rec['booked'] = max(0, min(((int)$rec['booked']) + (int)$input['delta'], (int)$rec['capacity']));
  }

  $data[$key] = $rec;

  if (!write_data($file, $data)) {
    http_response_code(500);
    echo json_encode(['error' => 'Zapis nie powiódł się']);
    exit;
  }

  echo json_encode($data, JSON_UNESCAPED_UNICODE);
  exit;
}

// Inne metody
http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);