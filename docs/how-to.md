# How To:

## Run Epimap on your machine ?

**Requirements:** You must have Python 3 on your machine.

1. Clone Epimap repository
``` sh
$ git clone git@github.com:NathanCHEVALIER/epimap.git
```

2. Go to your local epimap directory
``` sh
$ cd path/to/epimap
```

3. Start a local http server with routes rules

### Using Python:
```sh
$ python3 server.py
```

### Using Docker:
```sh
## using docker-compose from repo:
$ docker-compose up

## OR: without docker-compose:
$ docker run -p 8080:80 -v './src:/var/www/html' php:8.1-apache
```

4. Checkout [http://0.0.0.0:8000](http://0.0.0.0:8000).

<br /><br />

## Use Epimap Font ?

Epimap use the Atkinson Hyperlegible font from the Braille Institute. The font comes with the repo for browsing but is not linked to your SVG Editor.

### 1. Get the .ttf files:
- in the [fonts](../src/fonts/) folder!
- on the [Braille Institute Website](https://brailleinstitute.org/freefont) 


### 2. Install the font on your machine
- On Linux:
    1. Go to the folder containing the Atkinson ttf files
    2. Copy TTF files into local fonts directory:
    ```sh
    $ cp *.ttf ~/.local/share/fonts/
    ```
    3. Refresh font cache
    ```sh
    $ fc-cache -f -v
    ```


- On Windows:
    Right click on the .ttf file, then "Install for all users"

### 3. Restart your SVG editor and enjoy !
