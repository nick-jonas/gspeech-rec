<? 
require 'google_speech.php';

$s = new cgoogle_speech('AIzaSyAbx9tR74Gh-pDTy_gsbsdt-s_pX5jK0ik'); 

$output = $s->process('@test.flac', 'en-US', 8000);      

print_r($output);
?>
