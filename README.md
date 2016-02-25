# GEOTREK RANDO V2 ![master](https://travis-ci.org/makinacorpus/Geotrek-rando.svg)
### Public portal of Geotrek (http://geotrek.fr).


## PREREQUISITES

- Geotrek-Rando v2 can synchronize only with Geotrek-Admin v2
- Ubuntu 14.04

### Syncronization

You have to set up a data directory on the Geotrek-Rando server and synchronize it with Geotrek-Admin data.
To do so, you have to run the Geotrek-Admin command (`<...>` has to be replaced by your actual configuration):

```
./bin/django sync_rando -v2 --url <http://url_of_my_geotrek_admin_serveur> <my_data_directory>
```

If Geotrek-Admin and Geotrek-Rando are not on the same server, you have to transfer data by your own (ftp, ssh, usb key…).
If you want to synchronize automatically every night, you can configure a cron task.
Make sure access rights will allow nginx to read all files in `<my_data_directory>`.

## INSTALL

### Set-up working environment

- Install Node

```
curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
sudo apt-get install nodejs build-essential
```

### Download Geotrek-Rando

Download and extract latest release of Geotrek-Rando from [GitHub](https://github.com/makinacorpus/Geotrek-rando/releases/latest).

### Install modules via NPM

```
cd Geotrek-rando-*
npm install
```

### Launch distribution task

```
npm run dist
```
It will :
* create missing config files
* create translation files
* bundle all the app js files in src/rando.js
* compile sass files and bundle them in src/rando.css, src/rando-vendors.js
* bundle all vendors js files in src/vendors.js 


## CONFIGURATION & CUSTOMISATION

*Please be aware that you need to run the npm task `dist` twice (or use development mode) in order for changes to be visible*

### Minimum required

Those change are done in the `src/app/config/settings.custom.json` file.
All available options are detailed in the `SETTINGS.md` file or this repository.

1 - `PLATFORM_ID`: unique id used to represent your platorm. You need to change it, otherwise you may have conflict with other geotrek deployments. It's used for favorites and othe things specific to your platforms.
2 - `API_URL`: Url where Geotrek-rando will get data (eg, the url of Geotrek-Rando followed by `/data`).
3 - `BACKOFFICE_URL`: Back office communication url for geotrek Rando.
4 - `ENABLE_HTML_MODE`: tells AngularJS if it should use the HTML5 history API (and remove the # from the url) or not.


### Style configuration

There are few variables you can override, like main fonts and colors use for the website, the categories of content etc...
The default values are visible in the `src/app/config/styles/_config-default.scss` file. If you want to override them, just create a file in the same directory named `_config-custom.scss` and set the var you want to change.


### Style override

You can override style by creating `scss` files in the `src/app/custom/styles` folder. It's loaded after every other stylesheet so you can basically do whatever you want.

**DO NOT EDIT `_customisation.scss` FILE. It's generated by the gulp task and will be overwriten each time you launch gulp. You would lost any change you've made in this file.**


### Customisation of Header

1 - Create a `html` file in the `src/app/custom/templates` folder.

2 - Add the file name to the `HEADER_TEMPLATE_FILE` var in the `src/app/config/settings.custom.json` file.

3 - You can stylize it by adding a dedicated `scss` file in `src/app/custom/styles`, or editing one previously created.


### Customisation of Footer

1 - Create a `html` file in the `src/app/custom/templates` folder.

2 - Add the file name to the `FOOTER_TEMPLATE_FILE` var in the `src/app/config/settings.custom.json` file.

3 - If you haven't, you ned to set `SHOW_FOOTER` to **true** for the footer page to display.

4 - You can stylize it by adding a dedicated `scss` file in `src/app/custom/styles`, or editing one previously created.


### Customisation of Home page

1 - Create a `html` file in the `src/app/custom/templates` folder, with thewith the code of the language you want to apply it to (ex: `custom-home-fr.html`). You can use somes widgets which are documented in the `HOME_WIDGETS.md` file.

2 - Add the file name to the corresponding lang of the object `HOME_TEMPLATE_FILE` in the `src/app/config/settings.custom.json` file.

3 - If you haven't, you ned to set `SHOW_HOME` to **true** for the Home page to display.

4 - You can stylize it by adding a dedicated `scss` file in `src/app/custom/styles`, or editing one previously created.


### Create custom Angular elements

Geotrek-rando allow you to create custom directives, controllers, and services which will be pluggable in your custom templates.
You can find those files in `src/app/custom` folder. They're called respectively `controllers.js`, `directives.js`, and `services.js`.
If they don't exist (mening you've never launch gulp before), you can copy the file with the extension `.example` and remove this extension. (ex: `controllers.js.example` -> `controllers.js`). It's located in the samed folder.

Each example file contain the strict minimum code in order to allows you to add custom directives, controllers or services. You'll also find a commented exemple of how you should create them.


### Add and use custom images or fonts

Basically, any image or font you would like to use should go into `images/custom`. Thent you can either use it in a template or a stylesheet, or in the config if it's, for example, the main logo of your Geotrek-rando version.


## EXPORT DATA FROM GEOTREK-RANDO

### Install and configure nginx

Create the file `/etc/nginx/site-available/geotrek-rando` and symlink it to
`/etc/nginx/site-enabled/geotrek-rando`. This example supposes you synchronized
Geotrek-Admin data to `<my_data_directory>` and you configured Geotrek-Rando
`API_URL` to your `http://<my_server_name>/data`.

be carefull with trailing slashes. They are important and change the behaviour of nginx.

```
server {
    listen 80;
    server_name <my_server_name>;
    root <my_installation_directory>/src;
    if_modified_since before;
    expires 1h;
    gzip on;
    gzip_types text/text text/html text/plain text/xml text/css application/x-javascript application/javascript application/json;
    types {
        application/json geojson;
        application/gpx+xml gpx;
        application/vnd.google-earth.kmz kmz;
        application/x-font-ttf ttf;
    }
    location /data/ {
        root <my_data_directory>/;
    }
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Then run `service nginx restart`

### Redirect URLs from v1

In nginx configuration file inside `server {...}` section, add:

```
    rewrite ^/fr/pages/(.+)$ http://<your.domain.com>/informations/$1/ permanent;
    rewrite ^/fr/(.+)$ http://<your.domaine.com>/<practice-slug>/$1/ permanent;
    rewrite ^/fr/$ http://<your.domaine.com> permanent;
```

And replace <your.domaine.com> by your domain and <practice-slug> by the slug of your practice (check new urls of treks to get it).
All treks will be redirected to this unique practice as it is not possible to distinguish practices in v1 urls.

## DEVELOPMENT

### Launch bundling and watching task

```
npm run watch
```
Launch the app on localhost:3000 and watch for any change in sass or js files in src folder :
* Each time a sass file is changed, the wole css is reinjected
* Each time a js, json, or po file is saved, the browser's tab is refreshed
* Will alow you to change your config file without needing to relaunch gulp


## AUTHORS

* [Simon Bats](https://github.com/SBats)
* [Gaël Utard](https://github.com/gutard)
* [Benjamin Marguin](https://github.com/mabhub)
* [Laurent Saint-Félix](https://github.com/Anaethelion)

[<img src="http://depot.makina-corpus.org/public/logo.gif">](http://www.makina-corpus.com)


## LICENCE

* OpenSource - BSD
