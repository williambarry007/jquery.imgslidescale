<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<title>jQuery Image Slide Scale</title>
<style type="text/css">
body { font-family: Verdana; }
</style>
<link href="css/jquery-ui.css" rel="stylesheet" type="text/css" />
<link href="css/jquery.imgslidescale.css" rel="stylesheet" type="text/css" />
</head>
<body>

<h1>jQuery Image Slide Scale Example</h1>
<img src='pic.jpg' id='iss_image' />

<script src="js/jquery.min.js"></script>		
<script src="js/jquery-ui.min.js"></script>
<script src="js/jquery.imgslidescale.js"></script>
<script type="text/javascript">

$(document).ready(function() {
	$.imgslidescale.init({
		width: 300,
		height: 300,
		image_id: 'iss_image',
		upload_path: 'example_upload.php',
		update_path: 'example_update.php',
		extra_args: {
			yo_momma: 'is_so_fat',
			how_fat: 'really'
		}
	});
});

</script>
</body>
</html>
