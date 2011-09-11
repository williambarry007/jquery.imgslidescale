<?php
header('Content-type: application/json');

$crop_width		= $_POST['crop_width'];
$crop_height	= $_POST['crop_height'];
$x				= $_POST['x'];
$y				= $_POST['y'];
$scale			= $_POST['scale'];

scaleCropImage('pic.jpg', 'pic.jpg', $crop_width, $crop_height, $x, $y, $scale);

$resp = new stdClass();
echo json_encode($resp);

/******************************************************************************/

function scaleCropImage(
	$src_file,		// The source file 
	$dst_file, 		// The destination file
	$crop_width, 	// The width of the cropped image
	$crop_height, 	// The height of the cropped image
	$x, 			// The post-scale x-coord on the source image of the top, left crop point
	$y,				// The post-scale y-coord on the source image of the top, left crop point
	$scale			// How scaled the image was (ranges from 0-200%)
){
	$ext = strtolower(substr($src_file, strrpos($src_file, ".")+1));
	
	switch(strtolower($ext))
	{
		case 'jpg':
		case 'jpeg':	$src_img = imagecreatefromjpeg($src_file);	break;
		case 'gif':		$src_img = imagecreatefromgif($src_file);	break;
		case 'png':		$src_img = imagecreatefrompng($src_file); 	break;
	}
	
	$out_img = imagecreatetruecolor($crop_width, $crop_height);
	if($ext == 'png') // Check for transparency
	{
		$palette = (imagecolortransparent($src_img)<0);
		if(!$palette||(ord(file_get_contents($src_file, false, null, 25, 1)) & 4))
		{
			if(($tc=imagecolorstotal($src_img))&&$tc<=256) imagetruecolortopalette($out_img, false, $tc);
			imagealphablending($out_img, false);
			imagefill($out_img, 0, 0, imagecolorallocatealpha($out_img, 0, 0, 0, 127));
			imagesavealpha($out_img, true);
		}
	}
	imageantialias($out_img, true);
	imagecopyresampled(
		$out_img,			// dst image 
		$src_img, 			// src image
		0, 0, 				// dst x,y
		$x/$scale, 			// src x
		$y/$scale, 			// src y
		$crop_width, 		// dst w 
		$crop_height, 		// dst h
		$crop_width/$scale, // src w
		$crop_height/$scale // src h
	);
	switch(strtolower($ext))
	{
		case 'jpg':
		case 'jpeg':	imagejpeg($out_img, $dst_file, 100);				break;
		case 'gif':		imagegif($out_img, $dst_file);						break;
		case 'png':		imagepng($out_img, $dst_file, 9, PNG_ALL_FILTERS);	break;
	}
	//chmod($dst_file, 0666);
}
