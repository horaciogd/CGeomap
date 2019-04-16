CGeomap for Leaflet 1.1.1
========================


CGEOMAP(http://gpsmuseum.eu/cgeomap/) es una herramienta colaborativa de espacialización de la información en el espacio público. Es un entorno creativo open source, mapa y web-app que permite geolocalizar contenidos audiovisuales y pasearlos desde el smartphone.

CGEOMAP nace de una larga trayectoria de colaboración entre varios colectivos artísticos, explorando el cruce de caminos entre las técnicas de geolocalización de contenidos audiovisuales, la narrativa espacial y el activismo cultural. Entre ellos destacan VHPlab (Horacio González Diéguez) y GPS Museum (Fred Adam and Verónica Perales).

En este repositorio encontrarás el plugin y los esqueletos de Spip que utilizamos de base para crear nuestros proyectos publicados bajo licencia GNU GENERAL PUBLIC LICENSE. Encontrarás toda la documentación acerca de como utilizarlo y un ejemplo de su uso aquí: http://www.vhplab.net/cgeomap/

Version: 1.1.1
Date: Tue Apr 16 2019

Enjoy the code and drop me a line for comments and questions!
horaciogd at vhplab dot net

Third Part components: SPIP 3.2 - *Arnaud Martin, Antoine Pitrou, Philippe Riviere, Emmanuel Saint-James*, jQuery v3.1.1 | jQuery UI v1.12.1 - *jQuery Foundation*, Leaflet JavaScript library for mobile-friendly interactive maps - *CloudMade, Vladimir Agafonkin*, SoundManager 2 - *Scott Schiller*, FancyBox v2.1.7 - *Janis Skarnelis*, jQuery File Upload - *Sebastian Tschan*, phpqrcode - *Dominik Dzienia*, jQuery custom scrollbar plugin v3.1.5 - *malihu*, jQuery mousewheel - *Brandon Aaron*
 


How to
------

**1)** Install Spip in your server.

**2)** Copy *mes_fonctions.php* file and *squelettes*, *jQuery-File-Upload*, *phpqrcode* and *plugins* folders in the root of the content manager.

**2)** In order to use https edit spip's .htaccess adding the following

RewriteEngine On
RewriteCond %{SERVER_PORT} 80
RewriteRule ^(.*)$ https://YOUR_DOMAIN/$1 [R,L]


Notes
------

Following squelette files are just to  redirect from any spip page to sommaire:

404.html, article.html, auteur.html, backend-breves.html, backend.html, breve.html, calendrier.html, contact.html, forum.html, identifiants.html, mot.html, plan.html, recherche.html, rss_forum_article.html, rss_forum_breve.html, rss_forum_rubrique.html, rss_forum_syndic.html, rss_forum_thread.html, rubrique.html, site.html