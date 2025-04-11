<?php
// Your Xtream Codes portal details
$portal = "http://line.ultrab.xyz:80";
$username = "2FFC00";
$password = "271506";

// Construct M3U download URL
$m3u_url = "$portal/get.php?username=$username&password=$password&type=m3u&output=ts";

// Destination file
$output_file = "ultrab_playlist.m3u";

// Download and save the M3U file
$file_data = file_get_contents($m3u_url);

if ($file_data) {
    file_put_contents($output_file, $file_data);
    echo "✅ M3U file downloaded and saved as: $output_file";
} else {
    echo "❌ Failed to download M3U playlist.";
}
?>
