# bunny-vm
 Rabb.it clone built using xfvb, headless chrome and xdotool

Building
--------

`docker build -t bunny-vm .`

Running
-------
To run this, you need to give the VM a name, and a valid token for remote control.

`docker run --rm -it bunny-vm http://127.0.0.1:9000 vm-name jwt-secret remote-password`