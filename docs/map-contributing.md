# Map Contributing:

Maps are the foundation of Epimap. Having up-to-date maps and data is crucial to the service provided to all students. This section of the documentation aims to simplify map editing for beginners, to encourage contributions!

> Some of the details on the maps do not correspond faithfully to reality in order to simplify map readiness.

A generic guide about contributions on GitHub can be found [here](https://docs.github.com/en/get-started/quickstart/contributing-to-projects)

## Editing:

### Requirements: 

+ Local repository cloned on your machine
+ SVG Editor Software: We recommend using [Inkscape](https://inkscape.org/) (Open Source) 
+ Recommended: Node > 18 (to test before push)

### 1. Open a map:

+ **Using Unix Shell:**

``` sh
# Go to your local epimap repo
$ inkscape maps/{maps-name}.svg
```

+ **Using WSL:**

``` sh
# Go to your local epimap repo
$ explorer.exe maps
```
Then right-click > Open in Inkscape on file

+ **Others/GUI:**

Open Inkscape, then 'File > Open' and select the file you want to edit.

### 2. Update:

You should refer to this tutorial: (Not required)

Please pay attention to style guidelines [below](#style-guidelines)

### 3. Embed Data:

Maps contains embedded data on room names and icons. They are used to offer navigation trough maps and display relevant informations on the UI.

![](./src/tuto-embedded-data.gif)

#### Room Names:

1. In Inkscape, select a room name, right-click, and select the "Create anchor (hyperlink)" action.

2. Fill Href input with the room identifier. A room identifier contains lowercase (a-z), numbers (0-9), and hyphens (-) characters (.ie: "Amphi 401" -> "amphi-401")

3. Set 'room' into Type input and leave blank other inputs

#### Icons:

1. In Inkscape, select an icon, right-click, and select the "Create anchor (hyperlink)" action.

2. Fill Href input with the target mapId (with or without .svg extension). See [map list](map-list.md) for mapIds

3. Set 'icon' into Type input and leave blank other inputs

### 4. Check :

Workflows performs checks on map to ensure compatibility. You can also run these scripts to check the headers properties and maps/data compatibility. Please refer to [Test Section](#test-maps)


<br />

## Map Associated Data (v2 Compatibility): 

From v2 (Feb. 2023), some informations are associate to rooms. Those informations are stored in [map.data.json](../js/data.map.json).

Each map (identified thanks to mapId) have a collection of rooms

``` json
{
    "kb-voltaire-f0": {
		"name": "Voltaire - Rez de Chaussée",
        "last_update": "2023-02-24",
        "rooms": {
            "amphi-0": {
                "name": "Amphi 0",
                "description": "Un amphi numérique !",
                "tenant": "epita",
                "image": "",
                "peoples": [ "xavier.login" ],
                "tags": [ "amphi" ]
            }
        }
    }
}
```



`name`: Human readible room name

`description`: A cool description

`tenant`: The tenant of the room (Epita, Epitech, Other)

`image`: A pretty photography of the room

`peoples`: A list of strings containing the logins of each people associated to the room

`tags`: One word tags used to enhance search (ie. "sm" for cisco)

A list containing the status of the data update is available [here](map-list.md)

<br />

## Style Guidelines:

### Generic:

The only one colour is pure black (#000000) and there is no background.

### Text:

- All texts uses 'Atkinson Hyperlegible' font (see [fonts](../how-to.md/) )
- All rooms names are in bold
- All people names are in regular
- Other annotations are in italic

### Strokes:

- Outdoor walls are 8px thick.
- Indoor walls are 3px thick.
- Others strokes (doors, stairs) are 0.8-1px thick

### Icons:

- icons are those in [img](../src/img/) folder

<br />

## Test Maps:

Require Node and npm
``` sh
## Go to tests folder and install depedencies
$ cd tests && npm install
$ node worker.js
```

Will display a report on maps and data

### In case of failure:

#### 'Error: Map format error (width or height differs from 100%) in xxx'
    1. Open the map file in your favorite text editor
    2. Check for width and height properties in svg header: values should be "100%"

#### 'Error: Missing DATA for "xxx"'
