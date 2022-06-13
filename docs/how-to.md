# How To:

## Run Epimap locally:

Here is the process to run Epimap on your machine:

1. Go to your local epimap directory (after cloning it)

2. Start a local http server (python 3 needed)
```sh
$ python3 -m http.server
```

3. Checkout [http://0.0.0.0:8000]().

<br /><br />

## Get Epimap Font:

Epimap use the Atkinson Hyperlegible font from the Braille Institute.

1. Get the .ttf files:
- in the [fonts](../fonts/) folder!
- on the [Braille Institute Website](https://brailleinstitute.org/freefont) 

<br /><br />

2. Install the font on your machine
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

<br /><br />

- On Windows:
    Right click on the .ttf file, then "Install for all users"

3. Restart your SVG editor and enjoy !