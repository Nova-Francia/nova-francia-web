# Nova Francia - Website
__English below__

## Bienvenue à Nova Francia !

Ce repository est une archive du site web de Nova Francia, un serveur Minecraft semi-RP pré-industriel moddé.
Actuellement, le site est hébergé à l'addresse [https://nova-francia.espie.dev](https://nova-francia.espie.dev).
Ne changeant pas vraiment, le site est en HTML5 sans plus.

Un fichier [`docker-compose.yml`](./docker-compose.yml) est disponible pour rapidement lancer et voir le site web.   
Il utilise l'image de [nginx](https://hub.docker.com/_/nginx).

Le site reste volontairement en HTML/CSS/JavaScript natif : le JavaScript est limité
aux comportements qui ne peuvent pas être réalisés proprement en CSS (menu mobile
accessible et carte en plein écran). Les catégories de la modlist utilisent les éléments
HTML natifs `<details>`/`<summary>` et les animations d'apparition sont désactivées
gracieusement sans JavaScript.

Le serveur de développement local utilise la configuration [nginx.conf](./nginx.conf)
avec des en-têtes de sécurité minimaux, du cache pour les assets et une page 404.
Les fichiers [robots.txt](./robots.txt) et [sitemap.xml](./sitemap.xml) sont fournis
pour les déploiements qui souhaitent référencer le site.

Les ressources volumineuses des archives sont montées séparément par
[`docker-compose.yml`](./docker-compose.yml) : placez les ZIP/DOCX dans
`archives-data/<archive>/files` et le contenu exporté par BlueMap dans
`archives-data/<archive>/bluemap`. Les pages d'archives utilisent ces chemins
pour permettre un remplacement des ressources sans modifier le site.

Les plus gros fichiers (i.e. les images) sont stockés sur Git LFS.

---

## Welcome to Nova Francia !

This repository is an archive of the Nova Francia website, a modded pre-industrial semi-RP Minecraft server.
Currently, the site is hosted at [https://nova-francia.espie.dev](https://nova-francia.espie.dev).
Not really changing, the site is in HTML5 without more.

A [`docker-compose.yml`](./docker-compose.yml) file is available to quickly launch and view the website.   
It uses the [nginx](https://hub.docker.com/_/nginx) image.

The site intentionally remains plain HTML/CSS/JavaScript: JavaScript is limited to
behaviors that cannot be implemented cleanly in CSS alone (accessible mobile menu and
map fullscreen mode). The modlist categories use native `<details>`/`<summary>`
elements, and reveal animations gracefully fall back to static content without
JavaScript.

The local development server uses [nginx.conf](./nginx.conf) with minimal security
headers, asset caching, and a 404 page. [robots.txt](./robots.txt) and
[sitemap.xml](./sitemap.xml) are included for deployments that want the site indexed.

Large archive resources are mounted separately by
[`docker-compose.yml`](./docker-compose.yml): put ZIP/DOCX files in
`archives-data/<archive>/files` and the BlueMap export in
`archives-data/<archive>/bluemap`. Archive pages use these paths so resources can
be replaced without changing the site.

Larger files (i.e. images) are stored on Git LFS.
