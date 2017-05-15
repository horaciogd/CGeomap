-- 1. Instalar spip y crear el primer autor
-- 2. Configurar el sitio activando los campos de los artículoa, las breves, las palabras clave, el tratamiento de los iconos y el plugin
-- 3. Añadir este sql para crear los primeros contenidos y elementos técnicos junto con los autores

--
-- Volcado de datos para la tabla `spip_articles`
--

INSERT INTO `spip_articles` (`id_article`, `surtitre`, `titre`, `soustitre`, `id_rubrique`, `descriptif`, `chapo`, `texte`, `ps`, `date`, `statut`, `id_secteur`, `maj`, `export`, `date_redac`, `visites`, `referers`, `popularite`, `accepter_forum`, `date_modif`, `lang`, `langue_choisie`, `id_trad`, `nom_site`, `url_site`, `virtuel`) VALUES
(1, '', 'Bienvenida', 'Tu primer artículo', 1, '', '', '<block class=\"audiovisuel\">\\n<module class=\"text\" name=\"Bienvenid@ a CGeomap!\">Con tu cuenta Explorer podrás empezar a construir rutas audiovisuales locativas y cartografiar tu entorno.</module>\\n<module class=\"media\" name=\"Explorer\"><image5></module>\\n<module class=\"text\" name=\"Edita y publica contenidos\">Este editor online te permitirá posicionar contenidos audiovisuales, accessibles desde tu smartphone (web app) y/o con la app CGeomap para Android y IOS. \\nPara aprender a crear entradas locativas en pocos minutos, accede a la página de tutoriales (icono de información en la esquina superior derecha del editor).</module>\\n<module class=\"text\" name=\"Contacta con nosotr@s\">Estamos a tu disposición para ayudarte a crear con CGeomap, ¡la tierra, el mar y las nubes esperan tus contenidos!.</module>\\n</block>', '', '2017-01-15 16:50:34', 'publie', 1, '2017-01-15 16:51:31', 'oui', '0000-00-00 00:00:00', 0, 0, 0, 'pos', '2017-01-15 16:51:31', 'es', 'non', 0, '', '', ''),
(2, '', 'Bienvenida', 'Tu primer artículo', 1, '', '', '<block class=\"audiovisuel\">\\n<module class=\"text\" name=\"Bienvenid@ a CGeomap!\">Con tu cuenta Explorer podrás empezar a construir rutas audiovisuales locativas y cartografiar tu entorno.</module>\\n<module class=\"media\" name=\"Explorer\"><image7></module>\\n<module class=\"text\" name=\"Edita y publica contenidos\">Este editor online te permitirá posicionar contenidos audiovisuales, accessibles desde tu smartphone (web app) y/o con la app CGeomap para Android y IOS. \\nPara aprender a crear entradas locativas en pocos minutos, accede a la página de tutoriales (icono de información en la esquina superior derecha del editor).</module>\\n<module class=\"text\" name=\"Contacta con nosotr@s\">Estamos a tu disposición para ayudarte a crear con CGeomap, ¡la tierra, el mar y las nubes esperan tus contenidos!.</module>\\n</block>', '', '2017-01-15 16:50:43', 'publie', 1, '2017-01-15 16:51:59', 'oui', '0000-00-00 00:00:00', 0, 0, 0, 'pos', '2017-01-15 16:51:59', 'es', 'non', 0, '', '', ''),
(3, '', 'Bienvenida', 'Tu primer artículo', 1, '', '', '<block class=\"audiovisuel\">\\n<module class=\"text\" name=\"Bienvenid@ a CGeomap!\">Con tu cuenta Explorer podrás empezar a construir rutas audiovisuales locativas y cartografiar tu entorno.</module>\\n<module class=\"media\" name=\"Explorer\"><image9></module>\\n<module class=\"text\" name=\"Edita y publica contenidos\">Este editor online te permitirá posicionar contenidos audiovisuales, accessibles desde tu smartphone (web app) y/o con la app CGeomap para Android y IOS. \\nPara aprender a crear entradas locativas en pocos minutos, accede a la página de tutoriales (icono de información en la esquina superior derecha del editor).</module>\\n<module class=\"text\" name=\"Contacta con nosotr@s\">Estamos a tu disposición para ayudarte a crear con CGeomap, ¡la tierra, el mar y las nubes esperan tus contenidos!.</module>\\n</block>', '', '2017-01-15 16:50:52', 'publie', 1, '2017-01-15 16:52:18', 'oui', '0000-00-00 00:00:00', 0, 0, 0, 'pos', '2017-01-15 16:52:18', 'es', 'non', 0, '', '', '');

--
-- Volcado de datos para la tabla `spip_auteurs` (el primer autor se crea al hacer la instalación)
--

INSERT INTO `spip_auteurs` (`id_auteur`, `nom`, `bio`, `email`, `nom_site`, `url_site`, `login`, `pass`, `low_sec`, `statut`, `webmestre`, `maj`, `pgp`, `htpass`, `en_ligne`, `alea_actuel`, `alea_futur`, `prefs`, `cookie_oubli`, `source`, `lang`, `imessage`, `messagerie`) VALUES
(2, 'Fred Adam', '', 'fred.ubik2@gmail.com', '', '', 'fred', '4b3cc884f71c3a685d105f3e85e7ff95fc836fa591db0e89600e7f55baf7ff7f', 'ayBLnpdg', '0minirezo', 'oui', '2017-01-12 11:28:48', '', '$1$HB5DLoLS$wMEAT9mvBEKqNjF3Du0FA0', '0000-00-00 00:00:00', '1656939960571256a2870095.59627219', '423408154587768705c4e63.89562705', 'a:5:{s:7:\"couleur\";i:9;s:7:\"display\";i:2;s:18:\"display_navigation\";s:22:\"navigation_avec_icones\";s:14:\"display_outils\";s:3:\"oui\";s:3:\"cnx\";s:5:\"perma\";}', NULL, 'spip', '', NULL, NULL),
(3, 'GPSM', 'Fred Adam', 'fred.ubik2@gmail.com', 'GPSM & Cosmosis', 'http://www.gpsmuseum.eu', 'gpsm', '1067d5ce8be90710e63d7c7975ce99c62be3e0a4a6826477f4dd953e6335eb0d', '', '1comite', 'non', '2017-01-11 18:12:01', '', '$1$WfPoiHLk$wR4e0tF5iKHhlFAROEWR5.', '2016-04-19 11:18:56', '755293767571252560aa090.82319859', '77631683057167690a01675.87879637', 'a:5:{s:7:\"couleur\";i:9;s:7:\"display\";i:2;s:18:\"display_navigation\";s:22:\"navigation_avec_icones\";s:14:\"display_outils\";s:3:\"oui\";s:3:\"cnx\";s:5:\"perma\";}', NULL, 'spip', '', NULL, NULL);

--
-- Volcado de datos para la tabla `spip_auteurs_liens`
--

INSERT INTO `spip_auteurs_liens` (`id_auteur`, `id_objet`, `objet`, `vu`) VALUES
(1, 1, 'article', 'non'),
(2, 2, 'article', 'non'),
(3, 3, 'article', 'non');

--
-- Volcado de datos para la tabla `spip_breves`
--

INSERT INTO `spip_breves` (`id_breve`, `date_heure`, `titre`, `texte`, `lien_titre`, `lien_url`, `statut`, `id_rubrique`, `lang`, `langue_choisie`, `maj`) VALUES
(1, '2015-07-07 10:27:27', 'keywords', 'geolocation, spatial narrative, activism, open source, mapping, gps museum, escoitar, vhpalab, locative web app', '', '', 'publie', 2, 'es', 'non', '2015-07-07 22:28:31'),
(2, '2015-07-07 11:25:55', 'screenshot', '', '', '', 'publie', 2, 'es', 'non', '2015-07-07 23:25:54'),
(3, '2015-07-07 12:15:06', 'contact', 'Contacto equipo CGeomap', 'Contacta con el equipo de CGeomap', 'mailto:horaciogd@vhplab.net?Subject=', 'publie', 2, 'es', 'non', '2015-07-08 00:35:39'),
(4, '2015-07-07 12:21:37', 'presskit', '', '', '', 'publie', 2, 'es', 'non', '2015-07-08 00:21:37'),
(5, '2015-07-07 12:26:25', 'twitter', 'CGeomap erramienta colaborativa de espacialización creada por #VHPlab en colaboración con @gps_museum', 'Share on Twitter', 'https://twitter.com/home?status=', 'publie', 2, 'es', 'non', '2015-07-08 00:39:07'),
(6, '2015-07-07 12:28:57', 'facebook', '', 'Share on Facebook', 'https://www.facebook.com/sharer/sharer.php?u=', 'publie', 2, 'es', 'non', '2015-07-08 00:28:56'),
(7, '2015-07-07 21:26:05', 'credits', '<a rel=\"license\" href=\"http://creativecommons.org/licenses/by-sa/4.0/\"><img alt=\"Licencia de Creative Commons\" style=\"border-width:0\" src=\"/IMG/png/by-sa.png\" /></a><p><span xmlns:dct=\"http://purl.org/dc/terms/\" property=\"dct:title\">CGeomap web map app</span> by <a xmlns:cc=\"http://creativecommons.org/ns#\" href=\"http://www.vhplab.net/\" property=\"cc:attributionName\" rel=\"cc:attributionURL\">VHPlab (Horacio González Diéguez)</a> in collaboration with <a xmlns:cc=\"http://creativecommons.org/ns#\" href=\"http://www.gpsmuseum.eu/lab\" property=\"cc:attributionName\" rel=\"cc:attributionURL\">GPS Museum (Fred Adam and Verónica Perales)</a> is licensed under a <a rel=\"license\" href=\"http://creativecommons.org/licenses/by-sa/4.0/\">Creative Commons Reconocimiento-CompartirIgual 4.0 Internacional License</a>.</p>', '', '', 'publie', 2, 'es', 'non', '2017-01-11 18:43:24'),
(8, '2016-03-29 10:39:55', 'login', '', 'Iniciar sesión', 'http://www.cgeomap.escoitar.org/', 'publie', 2, 'es', 'non', '2017-01-11 18:12:00'),
(9, '2016-04-06 00:17:18', 'logo app', '', '', '', 'prop', 2, 'es', 'non', '2017-01-11 18:12:00'),
(10, '2016-04-06 02:02:55', 'android bookmark', 'Hacer un marcador de la aplicación web: {{Android}}', '', '', 'publie', 2, 'es', 'non', '2017-01-11 18:12:00'),
(11, '2016-04-06 02:05:02', 'ios bookmark', 'Hacer un marcador de la aplicación web: {{iphone-ipad}}', '', '', 'publie', 2, 'es', 'non', '2017-01-11 18:12:00');

--
-- Volcado de datos para la tabla `spip_documents`
--

INSERT INTO `spip_documents` (`id_document`, `id_vignette`, `extension`, `titre`, `date`, `descriptif`, `fichier`, `taille`, `largeur`, `hauteur`, `media`, `mode`, `distant`, `statut`, `credits`, `date_publication`, `brise`, `maj`) VALUES
(1, 0, 'png', '', '2015-07-07 11:23:00', '', 'png/screenshot.png', 1470636, 1920, 1071, 'image', 'image', 'non', 'publie', '', '1970-01-01 00:00:00', 0, '2017-01-15 17:07:19'),
(2, 0, 'png', '', '2015-07-09 10:44:11', '', 'png/by-sa.png', 4585, 90, 31, 'image', 'image', 'non', 'publie', '', '1970-01-01 01:00:00', 0, '2015-07-09 22:44:12'),
(3, 0, 'png', '', '2016-04-06 02:02:47', '', 'png/bookmark_android_2x.png', 16733, 770, 212, 'image', 'image', 'non', 'publie', '', '1969-12-31 16:00:00', 0, '2017-01-12 15:02:26'),
(4, 0, 'png', '', '2016-04-06 02:04:45', '', 'png/bookmark_ios_2x.png', 10766, 628, 225, 'image', 'image', 'non', 'publie', '', '1969-12-31 16:00:00', 0, '2017-01-15 09:40:27'),
(5, 0, 'jpg', '', '2017-01-15 10:50:35', '', 'jpg/cgeomap_explorer_banner_1100x591.jpg', 48430, 1100, 591, 'image', 'image', 'non', 'publie', '', '2017-01-15 16:50:35', 0, '2017-01-15 16:50:35'),
(6, 0, 'png', '', '2017-01-15 10:50:36', 'qr', 'png/article_1_qr.png', 816, 450, 450, 'image', 'image', 'non', 'publie', '', '2017-01-15 16:50:36', 0, '2017-01-15 16:50:36'),
(7, 0, 'jpg', '', '2017-01-15 10:50:44', '', 'jpg/cgeomap_explorer_banner_1100x591-2.jpg', 48430, 1100, 591, 'image', 'image', 'non', 'publie', '', '2017-01-15 16:50:44', 0, '2017-01-15 16:50:44'),
(8, 0, 'png', '', '2017-01-15 10:50:44', 'qr', 'png/article_2_qr.png', 828, 450, 450, 'image', 'image', 'non', 'publie', '', '2017-01-15 16:50:44', 0, '2017-01-15 16:50:44'),
(9, 0, 'jpg', '', '2017-01-15 10:50:52', '', 'jpg/cgeomap_explorer_banner_1100x591-3.jpg', 48430, 1100, 591, 'image', 'image', 'non', 'publie', '', '2017-01-15 16:50:52', 0, '2017-01-15 16:50:52'),
(10, 0, 'png', '', '2017-01-15 10:50:52', 'qr', 'png/article_3_qr.png', 816, 450, 450, 'image', 'image', 'non', 'publie', '', '2017-01-15 16:50:52', 0, '2017-01-15 16:50:52');

--
-- Volcado de datos para la tabla `spip_documents_liens`
--

INSERT INTO `spip_documents_liens` (`id_document`, `id_objet`, `objet`, `vu`) VALUES
(1, 2, 'breve', 'non'), /* screenshot */
(2, 7, 'breve', 'non'), /* credits */
(3, 10, 'breve', 'non'), /* android bookmark */
(4, 11, 'breve', 'non'), /* ios bookmark */
(5, 1, 'article', 'oui'),
(5, 0, 'article', 'oui'),
(6, 1, 'article', 'non'),
(7, 2, 'article', 'oui'),
(7, 0, 'article', 'oui'),
(8, 2, 'article', 'non'),
(9, 3, 'article', 'oui'),
(9, 0, 'article', 'oui'),
(10, 3, 'article', 'non');

--
-- Volcado de datos para la tabla `spip_groupes_mots`
--

INSERT INTO `spip_groupes_mots` (`id_groupe`, `titre`, `descriptif`, `texte`, `unseul`, `obligatoire`, `tables_liees`, `minirezo`, `comite`, `forum`, `maj`) VALUES
(1, 'marker_icon', '', '', 'oui', 'oui', 'articles', 'oui', 'oui', 'non', '2017-01-11 18:12:01'),
(2, 'visibility', '', '', 'non', 'non', 'articles', 'oui', 'oui', 'non', '2017-01-11 18:12:01'),
(3, 'category', '', '', 'oui', 'non', 'articles', 'oui', 'oui', 'non', '2017-01-11 18:12:01');

--
-- Volcado de datos para la tabla `spip_mots`
--

INSERT INTO `spip_mots` (`id_mot`, `titre`, `descriptif`, `texte`, `id_groupe`, `type`, `maj`) VALUES
(1, '0. default', 'Sí', '', 2, 'visibility', '2017-01-11 18:12:01'),
(2, '1. qr', 'No', '', 2, 'visibility', '2017-01-11 18:12:01'),
(3, '2. proximity', 'Por proximidad', '', 2, 'visibility', '2017-01-11 18:12:01'),
(5, '0', '', '', 1, 'marker_icon', '2017-01-11 18:12:01'),
(6, '1', '', '', 1, 'marker_icon', '2017-01-11 18:12:01'),
(7, '2', '', '', 1, 'marker_icon', '2017-01-11 18:12:01'),
(8, 'category_00', 'Categoría 01', '', 3, 'category', '2017-01-11 18:12:01'),
(9, 'category_01', 'Categoría 02', '', 3, 'category', '2017-01-11 18:12:01'),
(10, 'category_02', 'Categoría 03', '', 3, 'category', '2017-01-11 18:12:01'),
(11, 'category_03', 'Categoría 04', '', 3, 'category', '2017-01-11 18:12:01'),
(12, 'category_04', 'Categoría 05', '', 3, 'category', '2017-01-11 18:12:01'),
(13, 'category_05', 'Categoría 06', '', 3, 'category', '2017-01-11 18:12:01');

--
-- Volcado de datos para la tabla `spip_mots_liens`
--

INSERT INTO `spip_mots_liens` (`id_mot`, `id_objet`, `objet`) VALUES
(1, 1, 'article'),
(1, 2, 'article'),
(1, 3, 'article'),
(5, 1, 'article'),
(5, 2, 'article'),
(5, 3, 'article'),
(8, 1, 'article'),
(8, 2, 'article'),
(8, 3, 'article');

--
-- Volcado de datos para la tabla `spip_rubriques`
--

INSERT INTO `spip_rubriques` (`id_rubrique`, `id_parent`, `titre`, `descriptif`, `texte`, `id_secteur`, `maj`, `statut`, `date`, `lang`, `langue_choisie`, `statut_tmp`, `date_tmp`, `profondeur`) VALUES
(1, 0, 'Mapa', '', '', 1, '2015-07-12 07:13:15', 'publie', '2016-04-05 11:22:58', 'es', 'non', '0', '0000-00-00 00:00:00', 0),
(2, 0, 'elementos técnicos', '', '', 2, '2015-07-08 09:28:06', 'publie', '2016-04-06 02:05:23', 'es', 'non', '0', '0000-00-00 00:00:00', 0);

--
-- Volcado de datos para la tabla `spip_vhplab_gis`
--

INSERT INTO `spip_vhplab_gis` (`id_vhplab_gis`, `latitude`, `longitude`, `zoom`, `address`) VALUES
(1, 42.86576638765232, -368.55643451213837, 16, ''),
(2, 37.979138206122975, -1.1523628234863281, 12, ''),
(3, 40.040582561059225, -364.00726318359375, 6, '');

--
-- Volcado de datos para la tabla `spip_vhplab_gis_liens`
--

INSERT INTO `spip_vhplab_gis_liens` (`id_vhplab_gis`, `objet`, `id_objet`) VALUES
(1, 'article', 1),
(2, 'article', 2),
(3, 'article', 3);
