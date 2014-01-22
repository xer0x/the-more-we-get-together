
### Setting up a new Phaser template on OSX

sudo npm install -g yo
# ^^ this will also install Grunt & Bower's CLI tools

# Install Phaser scaffolding for Yeoman via npm
sudo npm install -g generator-phaser

# Initialize game directory
mkdir project
cd project
yo phaser

# Serve game files via http server (See Gruntfile.coffee)
grunt

# Check out the smiley face demo "game"
http://localhost:9000
