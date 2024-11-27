## Website

http://150.136.164.41/


## Preface
This is a website I made that is being hosted on a VM instance on Oracle Cloud using the always free tier. I tried using the Linux shape, but due to reasons beyond me, it refused so I had to make peace with Ubuntu. For the website, I am using Apache2 for hosting the static files and then using Node.js for the non-static files. If you, yes YOU, the reader of this, wanted to do something like this, I will hopefully go into detail on how you are able to replicate this same process.

## Set up
To get started, you need to make an account with Oracle Cloud. It's going to ask you for some payment but they will only charge you if you're going to use anything other than the free tier, which will NOT be happening here. After making your account, we will be making a new instance. Once you have made your account and you're in the home menu, we will get started. In the top left menu, click Compute, then click on Instances. Click on Create Instance. Change the name to whatever you like.
   
I am going to describe my setup but if you have your own preferences you would like to choose, you're free to do so:

 ### Placement
 I didn't touch anything in this section, I let it auto choose AD1 for me

 ### Security  
 This is probably important, most likely.

 ### Image and Shape
 For the image, we are going to be changing it to Ubuntu. Hit change image, click on Ubuntu, and we will be using "Canonical Ubuntu 20.04 Always Free-eligible" (Note that it says Always Free-eligible, this is what we want)

 For the shape, it's most likely already chosen for you, but if its not, we want to be using "VM.Standard.E2.1.Micro , Always Free-eligible, Virtual machine, 1 core OCPU, 1 GB memory, 0.48 Gbps network bandwidth" (Again, note that it says always free-eligible)

 ### Primary VNIC information
 We don't need to touch anything here, we will however come back to add some ingress rules (Whatever that may be) to allow connections to the website, but for now, no touch

 ### Add SSH Keys
 This is very important, make sure the "Generate a key pair for me" is selected, and once its selected, you want to download BOTH the "save private key" and the "Save public key"

 ### Boot Volume
 You don't need to touch this area unless you know what you're doing but if you're using the free tier and you don't have any other instances, you're allowed (please fact-check me on this) I believe up to 200GB, but if you don't touch anything here, it will default to giving you ~45 GB of space in your VM

 At this point, we should be good to create the instance. If you're looking at the bottom right and it says it will cost 2$ a month, you can safely ignore that. I chatted with a live agent and they informed me that it doesn't account for the free-tier, for some reason. It will take a min or so to finish creating it. Once it's done, you will be greeted with a lot of information at your face.

 ### Ingress Rules
 Once your instance is up and running, we need to go to the top left menu, click on Networking and then find Virtual Cloud Networks. You should only see one VCN, it's attached to the VM instance you just created, and click on it. There should be another name to click in here, and it's the subnet. One last thing to click on here and it should be called the Default Security List. Once you made it here, you should find a button called "Add Ingress Rules" and click it. For the source C1Dr input "0.0.0.0/0" and then for the Destination Port Range input "80". This is hopefully going to make it so any IP address is going to be able to connect to port 80. 

We are going to be adding one more rule here but please make note of this, it worked for me and I have no idea why it worked when it shouldn't have, so change this if needed. We are going to be doing the same exact thing we just did but instead of 80, we will be putting in 3000. I assume this is because Node.js is going to cry if we don't.


## Installing

### PuTTY
Okay, now that we are set up, let's try to connect to your VM. I am on windows, so in order for me to SSH into my VM, I have to use PuTTY. Once you download PuTTY, you will need to launch puttygen.exe. We are going to click on Load, and change the file types to all, and find the SSH key file we just downloaded that ends with .key and click it. After importing it, you may add a Key Passphrase, it's not required but it's always good practice. Click on "Save Private Key" once you're done and save it.

Now we need to open up the mythical putty.exe. Go to Connection -> SSH -> Auth -> Credentials and for the Private key file for auth, hit browse and select the private key you just saved, it should end in a .ppk. Go back to Session and here we will need to go back to our VM instance. Click on the top left, go to Compute and then click Instances and click your instance. In Instance Information, find the Instance Access section and find the username and public IP address. Combine them together as such: username@IPAddress and type that into your putty host name. It should prompt you the first time you SSH into it saying it's not cached and you should only continue if you trust it, so just double check that you inputted the right information and hit go. I added a passphrase, so it's asking me to input it (It doesn't show you typing it in so you need to have faith in yourself). And if all goes well, you should be greeted with Welcome to Ubuntu with a bunch of other things!

### Apache2
Like mentioned before, we will be using Apache2. I guess, for some reason, it's good practice to run `sudo apt update` when I get into the VM, so do that first, if you choose, and wait until it finishes. Afterwards, we will install Apache2 using the following command `sudo apt install apache2`. If it goes well, which I have my fingers crossed that it does, we will then start it using `sudo systemctl start apache2`. Again, hopefully it goes well. I prefer to have my web server start whenever it gets booted, so I will type in `sudo systemctl enable apache2`. Before we check if everything was set up right, we can check the status of apache2 by typing in `sudo systemctl status apache2`. What we are looking for is "Active (running)". We can then grab the Public IP Address (the one displayed in your information for your VM and one you used to SSH) and type it into the web browser. If all goes well, you should have a public website that is accessible to everyone!


### Node.js

Okay, now that we have our static website running, we want to add more live to it, and make it more dynamic, if you will. Let's install Node.js. Type `sudo apt install nodejs npm`. After it's done, you can confirm that it's installed by typing `node -v` and `npm -v`. For my own preference, I am going to `cd /var/www/html`. This should take you to where Apache2 is running the website, unless you changed the root document inside the config. We need to make this into a npm project so while we are in the `/var/www/html` directory, we are going to type `npm init` which will initialize the directory into a npm project and download packages that we will be needing. It will ask you a bunch of questions and you may answer how you would like. For this specific project, we need socket.io, and we can get it by typing `npm install express socket.io`. Now that we have all the packages needed, we need to clone the files into our current directory.

*NOTE: YOU WILL NEED TO CHANGE THE "const socket = io('ws://{DOMAIN}:PORT');" INSIDE THE CHAT.JS IF YOU'RE GOING TO COPY THIS REPO. YOU REPLACE DOMAIN WITH YOUR IP ADDRESS IF YOU DO NOT HAVE A DOMAIN SET UP AND PORT TO 3000, IF YOU'RE GOING TO BE FOLLOWING ALONG*

To clone the files into our current directory, we can do `git clone https://github.com/MonMog/ubuntu-website.git .`. We want Apache2 to be aware of the changes we just made, so we will do `sudo systemctl restart apache2`. Keep in mind, we are not done yet and if you check your website, it may be grasping at straws and suffering, but we will help it soon. I am not entirely sure why, but Apache2 and Node.js don't like to co-exist so we have to do another step to help them get along, and it's called ProxyPass

### ProxyPass?

Let's type this into the terminal `sudo nano /etc/apache2/sites-available/000-default.conf`. It will make us edit the config file for Apache2. Somewhere in the middle of the config file, I am sure it doesn't matter where exactly but as long as it's between the lines, we need to add:
`        ProxyPass /socket.io/ http://localhost:3000/socket.io/
        ProxyPassReverse /socket.io/ http://localhost:3000/socket.io/
`
After we add those two lines to the config file, we need to enable the proxy by typing `sudo a2enmod proxy` and then follow-up with `sudo a2enmod proxy_http`. It wouldn't hurt to let apache2 to restart `sudo systemctl restart apache2`


## Usage

Hopefully, if everything went our way, there is one final step to do now. Make sure we are in the /var/www/html directory where we have all our files cloned and the website is up and running. We will now type `node app.js` and it should occupy your terminal with a message "Server is running on port 3000". To verify that everything is working, you can open up another tab and watch that Connected Users in the top left go from 1 to 2 and start typing and looking at the messages from both sides.

## Future work

I have decided that I will stop updating the files in this repo so that it can serve as a foundation for others who choose to get this started, sort of like a blank slate for them. I will however, keep updating my website and the files of course can still be viewed if inspected at the sources tab. I will also add a list of future work that I would like to add to this website:

*PLANNED WORK*:

- Allow users to have their own profiles with custom message and profile picture
- Allow users to react to messages
- Allow users to delete or edit messages
- Add typing Indicators to show who is currently typing
- Add group chats
- Remove ability for guests to private message for security reasons
  
  

## Current Features

- Guest mode: You do not need an account to message
- Private messages: You can click an online user in the left side and start private messaging them 


## Credits
 - https://youtu.be/1BfCnjr_Vjg?si=p2eUEKHcgljGpm2x
 - https://www.youtube.com/watch?v=1BfCnjr_Vjg

 
 
