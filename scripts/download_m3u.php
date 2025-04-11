<?php
$portal = "http://line.ultrab.xyz:80";
$username = "2FFC00";
$password = "271506";

$m3u_url = "$portal/get.php?username=$username&password=$password&type=m3u&output=ts";
$output_file = "ultrab_playlist.m3u";

$file_data = file_get_contents($m3u_url);

if ($file_data) {
    file_put_contents($output_file, $file_data);
    echo "✅ M3U file downloaded.";
} else {
    echo "❌ Failed to download M3U file.";
}
?>
