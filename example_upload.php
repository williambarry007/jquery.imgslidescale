<?php
$resp = new stdClass();      

$file = isset($_FILES['iss_upload_file']) && $_FILES['iss_upload_file']['size'] > 0 ? $_FILES['iss_upload_file'] : false;

if (!$file)
{
	$resp->error = 'Please select an image.';
}
else
{
    list($width, $height, $type, $attr) = getimagesize($file['tmp_name']);
    
    if ($type == IMAGETYPE_JPEG || $type == IMAGETYPE_GIF || $type == IMAGETYPE_PNG)
    {
    	$ext = strtolower(substr($file['name'], strrpos($file['name'], ".")+1));
    	copy($file['tmp_name'], 'pic.'. $ext);
    }
    else 
    {
        $resp->error = 'Please upload only JPEG/JPG/GIF/PNG image files.  File size must be at least (146 x 195)px.';
    }
}
?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<body style="background:none;">
<script type="text/javascript">
window.top.window.imgslidescale_uploadHandler(<?php echo json_encode($resp); ?>);
</script>
</body>
</html>
