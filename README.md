# Outline
+ Prerequisites
+ Deployment Requirements
+ Local Development
  14. Installing client
  127. Configuring and running server
+ Application initialization
  0. Obtaining Authentication Token
  2. uuApp initialization
  5. uuAppWorkspace initialization
  9. uuJokes instance initialization
  4. Testing functionality
+ Additional information sources

# Prerequisites
- Node.js 8.9+ with npm
- MongoDB 3.4+

# Deployment Requirements
- 1x ASID
- 1x AWID
- awidOwner uuIdentity
- 1x OSID (or a MongoDB connection string for local development)
- 1x BSID (or a MongoDB connection string for local development)

# Local Development
## 1. Installing client
(This step can be skipped if only the server side of the application is needed.)  
1. In client project:
   4. Execute command  
   ```npm install```
   in folder **uu_jokes_maing01-hi**
## 2. Configuring and running server
13. Start mongoDB
7. In config file **uu_jokes_maing01-server\env\development.json**, replace \<uuIdentity> in *privilegedUserMap.asidOwner* field with your uuIdentity. Connection strings can be optionally changed as well (fields *uuSubAppDataStoreMap.primary* and *uuSubAppDataStoreMap.binary*)
105. Execute command  
     ```npm install```  
     in **uu_jokes_maing01-server** folder.
0. Start the server by running  
   ```npm start```  
   in **uu_jokes_maing01-server** folder.
   
# Application initialization
## 0. Obtaining Authentication Token
All the following calls have to have the ```Authorization``` header set to ```Bearer <token>```, where the value of ```<token>``` can be found [here](https://oidc.plus4u.net/uu-oidcg01-main/0-0/showToken).
## 1. uuApp initialization
Initialize uuApp and change runtime mode to STANDARD to allow calls of unprivileged commands.  
Use any rest client and call the following:
```
POST http://localhost:8080/uu-jokes-maing01/00000000000000000000000000000000-11111111111111111111111111111111/sys/initApp
Request body:
{
  "runtimeMode": {
    "mode": "standard"
  }     
}
```
## 2. uuAppWorkspace initialization
Use any rest client and call the following:  
```
POST http://localhost:8080/uu-jokes-maing01/00000000000000000000000000000000-11111111111111111111111111111111/sys/initAppWorkspace
Request body:
{
  "awid": "22222222222222222222222222222222",
  "awidOwner": "<uuIdentity>",
  "licenseOwner": {
    "organization" : {
      "name": "Unicorn a.s.",
      "oId": "154156465465162",
      "web": "http://www.unicorn.com/"
    },
    "userList": [
      {
        "uuIdentity": "1-1",
        "name": "Vladimír Kovář"
      }
    ]
  }
}
```
**! Replace \<uuIdentity\> with your uuIdentity id.**

## 3. uuJokes instance initialization
Use any rest client and call the following:
```
POST http://localhost:8080/uu-jokes-maing01/00000000000000000000000000000000-22222222222222222222222222222222/jokesInstance/init
Request body:
{
  "uuAppProfileAuthorities": "urn:uu:GGALL"
}
```
This call assigns *Authorities* rights to all users.

## 4. Testing functionality
Open [this link](http://localhost:8080/uu-jokes-maing01/00000000000000000000000000000000-22222222222222222222222222222222/jokes) in browser.  


# Additional information sources
+ [uuJokes documentation](https://uuos9.plus4u.net/uu-bookkitg01-main/78462435-71f8d7b5cfdc4336b0abfe47b3cb237b)
+ [uuJokes NodeJs documentation](https://uuos9.plus4u.net/uu-bookkitg01-main/78462435-7eab0465e52d4a2d97e58fd400bc7dd3)
+ [uuApp Server Library](https://uuos9.plus4u.net/uu-bookkitg01-main/78462435-34df77ebe0a04adda6dcd62d32c4f513)
+ [uuApp Server Library (NodeJs)](https://uuos9.plus4u.net/uu-bookkitg01-main/78462435-2590bf997d264d959b9d6a88ee1d0ff5)
+ [uuAppg01Devkit Documentation](https://uuos9.plus4u.net/uu-bookkitg01-main/78462435-e884539c8511447a977c7ff070e7f2cf)
+ [uuSubApp Instance Descriptor](https://uuos9.plus4u.net/uu-bookkitg01-main/78462435-289fcd2e11d34f3e9b2184bedb236ded/book/page?code=uuSubAppInstanceDescriptor)
+ [uuApp Client Project (UU5)](https://uuos9.plus4u.net/uu-bookkitg01-main/78462435-e884539c8511447a977c7ff070e7f2cf/book/page?code=89628511)




























