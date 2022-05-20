import os

for filename in os.listdir("maps"):
    f = os.path.join(directory, filename)
    if os.path.isfile(f):
        svg = open(f, 'r')
        lines = svg.readlines()
  
        for line in lines:
            if line.startswith("width=")
                print(line)