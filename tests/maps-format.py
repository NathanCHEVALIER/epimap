import os
import sys

count = 0
for filename in os.listdir("maps"):
    f = os.path.join("maps", filename)

    if os.path.isfile(f):
        svg = open(f, 'r')
        lines = svg.readlines()
  
        for line in lines:
            if "width=" in line:
                if ("width=\"100%\"") not in line:
                    count += 1
                    print(f)
                    
                break

if count > 0:
    print("Warning: There is", count, "maps format errors")
    sys.exit(1)
else:
    sys.exit(0)
            