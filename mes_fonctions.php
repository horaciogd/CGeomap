<?php
define('_INTERDIRE_COMPACTE_HEAD_ECRIRE', true);
function device($baliza) {
	$tablet_browser = 0;
	$mobile_browser = 0;
	if (preg_match('/(tablet|ipad|playbook)|(android(?!.*(mobi|opera mini)))/i', strtolower($_SERVER['HTTP_USER_AGENT']))) {
    	$tablet_browser++;
	}
	if (preg_match('/(up.browser|up.link|mmp|symbian|smartphone|midp|wap|phone|android|iemobile)/i', strtolower($_SERVER['HTTP_USER_AGENT']))) {
    	$mobile_browser++;
	}
	if ((strpos(strtolower($_SERVER['HTTP_ACCEPT']),'application/vnd.wap.xhtml+xml') > 0) or ((isset($_SERVER['HTTP_X_WAP_PROFILE']) or isset($_SERVER['HTTP_PROFILE'])))) {
    	$mobile_browser++;
	}
	$mobile_ua = strtolower(substr($_SERVER['HTTP_USER_AGENT'], 0, 4));
	$mobile_agents = array(
		'w3c ','acs-','alav','alca','amoi','audi','avan','benq','bird','blac',
		'blaz','brew','cell','cldc','cmd-','dang','doco','eric','hipt','inno',
		'ipaq','java','jigs','kddi','keji','leno','lg-c','lg-d','lg-g','lge-',
		'maui','maxo','midp','mits','mmef','mobi','mot-','moto','mwbp','nec-',
		'newt','noki','palm','pana','pant','phil','play','port','prox',
		'qwap','sage','sams','sany','sch-','sec-','send','seri','sgh-','shar',
		'sie-','siem','smal','smar','sony','sph-','symb','t-mo','teli','tim-',
		'tosh','tsm-','upg1','upsi','vk-v','voda','wap-','wapa','wapi','wapp',
		'wapr','webc','winw','winw','xda ','xda-');
	if (in_array($mobile_ua,$mobile_agents)) {
		$mobile_browser++;
	}
	if (strpos(strtolower($_SERVER['HTTP_USER_AGENT']),'opera mini') > 0) {
		$mobile_browser++;
		//Check for tablets on opera mini alternative headers
		$stock_ua = strtolower(isset($_SERVER['HTTP_X_OPERAMINI_PHONE_UA'])?$_SERVER['HTTP_X_OPERAMINI_PHONE_UA']:(isset($_SERVER['HTTP_DEVICE_STOCK_UA'])?$_SERVER['HTTP_DEVICE_STOCK_UA']:''));
		if (preg_match('/(tablet|ipad|playbook)|(android(?!.*mobile))/i', $stock_ua)) {
			$tablet_browser++;
		}
	}
	if ($tablet_browser > 0) {
		// do something for tablet devices
   		return 'tablet';
	} else if ($mobile_browser > 0) {
		// do something for mobile devices
		return 'phone';
	} else {
		// do something for everything else
		return 'desktop';
	}
}
function extension($fichier){
    if (preg_match(',\.([^\.]+)$,', $fichier, $regs)) return $regs[1];
    return '';
}
function extraire_action($baliza) {
	$pos = strpos($baliza, "formulaire_action_args");
	if ($pos === false) {
	} else {
		$baliza = substr($baliza, $pos + 22);
		$list = split("'", $baliza);
	}
	return $list[4];
}
function extraire_br($baliza) {
	$return = str_replace("\n", "", $baliza);
	$return = str_replace("\t", "", $return);
	$return = str_replace("\"", "'", $return);
	return $return;
}
function extraire_module($baliza, $b=true){
	if (strpos($baliza,'</block>')) {
		$baliza = str_replace("<br class='autobr' />", "", $baliza);
		$block_list = explode('</block>', $baliza);
		$return = "\n";
		for ($i=0; $i<count($block_list)-1; $i++) {
			$block = get_block($block_list[$i]);
			// $return .= '('.$i.') '.$block['class'];
			$modules = get_modules($block['content']);
			// $return .= ' - num modules:'.count($modules).' ';
			$n_audio = 0;
			$n_image = 0;
			$n_text = 0;
			$n_link = 0;
			$t = "\t\t\t\t\t\t";
			$modules_content = ""; 
			for ($u=0; $u<count($modules); $u++) {
				// $return .= $modules[$u]['class'].' ';
				switch ($modules[$u]['class']) {
					case "video":
						break;
					case "audio":
						$modules_content .= get_audio_module($modules[$u]['content'], $modules[$u]['name'], $t."\t");
						$n_audio++;
						break;
					case "media":
						$modules_content .= get_media_module($modules[$u]['content'], $modules[$u]['name'], $t."\t", $b);
						$n_image++;
						break;
					case "text":
						$modules_content .= get_text_module($modules[$u]['content'], $modules[$u]['name'], $t."\t");
						$n_text++;
						break;
					case "link":
						$modules_content .= get_link_module($modules[$u]['content'], $modules[$u]['name'], $t."\t");
						$n_link++;
						break;	
				}
			}
			$return .= wrapp_module($modules_content, $block['class'], $t);
		
		}
		return $return;
	} else {
		return $baliza;
	}
}
function get_audio_module($text, $name, $t) {
	$audio = explode(' ', $text);
	$titre = explode('/', $audio[0]);
	$return = "\n";
	$return .= $t."<li class=\"audio module\">\n";
	$return .= $t."\t<header>\n";
	$return .= $t."\t\t<h5>".$name."</h5>\n";
	$return .= $t."\t</header>\n";
	$return .= $t."\t<div class=\"content\">\n";
	$return .= $t."\t\t<a href=\"".$audio[0]."\" type=\"".$audio[2]."\" data-id=\"".$audio[1]."\">".$titre[count($titre)-1]."</a>\n";
	$return .= $t."\t</div>\n";
	$return .= $t."</li><!-- audio module -->\n";
	return $return; 				
}
function get_block($text) {
	$block_class_start = strpos($text, 'class=');
	$this_block = substr($text, $block_class_start + 7);
	$block_class_end = strpos($this_block, '>');
	$block_class = substr($this_block, 0, $block_class_end-1);
	$this_block = substr($this_block, $block_class_end+2);
	$return = array(
		'content' => $this_block,
		'class' => $block_class
	);
	return $return;
}
function get_media_module($text, $name, $t, $b) {
	$image = explode(' ', $text);
	$titre = explode('/', $image[0]);
	$return = "\n";
	$return .= $t."<li class=\"media module\">\n";
	$return .= $t."\t<header>\n";
	$return .= $t."\t\t<h5>".$name."</h5>\n";
	$return .= $t."\t</header>\n";
	$return .= $t."\t<div class=\"content\">\n";
	$b=='true' ? $return .= $t."\t\t<a rel=\"fancybox\" class=\"fancybox\" title=\"".$name."\" href=\"".$image[0]."\"><img src=\"".$image[2]."\" data-id=\"".$image[1]."\" width=\"".intval($image[3]/2)."\" height=\"".intval($image[4]/2)."\"></a>\n" : $return .= $t."\t\t<img src=\"".$image[5]."\" width=\"".intval($image[6]/2)."\" height=\"".intval($image[7]/2)."\">\n";
	$return .= $t."\t</div>\n";
	$return .= $t."</li><!-- media module -->\n";
	return $return; 				
}
function get_modules($text) {
	$return = array();
	$list = explode('</module>', $text);
	for ($i=0; $i<count($list)-1; $i++) {
		$module_class_start = strpos($list[$i], 'class=');
		if ($module_class_start === false) {
		} else {
			$this_module = substr($list[$i], $module_class_start + 7);
			$module_tag_end = strpos($this_module, '>');
			$attributes = explode(' name=', substr($this_module, 0, $module_tag_end));
			$content = substr($this_module, $module_tag_end + 1);
			$class = substr($attributes[0], 0, -1);
			$name = substr($attributes[1], 1, -1);
		}
		array_push ($return, array(
			'content' => $content,
			'class' => $class,
			'name' => $name
		));
		
	}
	return $return;
}	
function get_text_module($text, $name, $t) {
	$return = "\n";
	$return .= $t."<li class=\"text module\">\n";
	$return .= $t."\t<header>\n";
	$return .= $t."\t\t<h5>".$name."</h5>\n";
	$return .= $t."\t</header>\n";
	$return .= $t."\t<div class=\"content\">\n";
	$content = str_replace("</li></ul>", "", $text);
	$return .= $t."\t\t<p class=\"wrap\">".$content."</p>\n";
	$return .= $t."\t</div>\n";
	$return .= $t."</li><!-- text module -->\n";
	return $return; 				
}			
function get_link_module($text, $name, $t) {
	$links = explode('</li>', $text);
	$return = "\n";
	$return .= $t."<li class=\"link module\">\n";
	$return .= $t."\t<header>\n";
	$return .= $t."\t\t<h5>".$name."</h5>\n";
	$return .= $t."\t</header>\n";
	$return .= $t."\t<div class=\"content\">\n";
	$return .= $t."\t\t<ul class=\"spip\">\n";
	for ($i=0; $i<count($links); $i++) {
		$is_link = strpos($links[$i], 'href=');
		if ($is_link === false) {
		} else {
			$this_link = substr($links[$i], $is_link + 6);
			$this_link = explode('"', $this_link);
			$url = $this_link[0];
			$this_link = explode('>', $this_link[1]);
			$content = substr($this_link[1], 0, -3);
			$return .= $t."\t\t\t<li>\n";
			$return .= $t."\t\t\t\t<a href=\"".$url."\" class=\"value\" target=\"_blank\">".$content."</a>\n";
			$return .= $t."\t\t\t</li>\n";
		}
	}
	$return .= $t."\t\t</ul>\n";
	$return .= $t."\t</div>\n";
	$return .= $t."</li><!-- list module -->\n";
	return $return; 				
}
function url_encode($baliza) {
	return rawurlencode($baliza);
}
function wrapp_module($content, $type, $t) {
	$return = "\n";
	$return .= $t."<div class=\"wrap_modules ". $type ."\" data-type=\"". $type ."\" data-tgl=\"on\">\n";
	$name = "";
	switch ($type) {
		case "audiovisuel":
			$name .= _T('exilio:audiovisual_module');
			break;
		case "recommandons":
			$name .= _T('exilio:recomendation_module');
			break;
		case "promotions":
			$name .= _T('exilio:promotion_module');
			break;
	}
	$return .= $t."\t<header class=\"block_module\"><button type=\"button\" class=\"toggle tgl-on\"></button><h4>". $name ."</h4></header>\n";
	$return .= $t."\t<ul class=\"modules tgl-on\">\n";
	$return .= $content;
	$return .= $t."\t</ul>\n";	
	$return .= $t."</div><!-- ". $type ." -->\n";
	return $return; 				
}
?>