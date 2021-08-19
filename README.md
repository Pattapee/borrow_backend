# Borrow System Ombudsman.go.th
Backend Project about borrow and refund money Ombudsman and send email(Exchange) alert user for over the time limit.

## Installation 
```bash
npm install
```

## Platform or Pattern for Learning
    - MVC
    - Typescript (Node js)
    - RESTful API

## Library important
    - express
    - lodash
    - moment
    - nodemailer
    - typeorm
    - node-cron
    - body-parser

## Path Folder
> src
    > api
        - router for call api service 
    > constants
        - http status codes
    > entities
        - Structure Database
    > repositories
        - function call api database
    > services
        - Services get post data with typeorm or mssql and
index.ts
    - start run and set port, bodyParser, set node-cron
ormconfig.json
    - Data Configuration typeorm
tslint.json
    - Configuration tslint about limit coding typescript

## Git repository
[OMB_system_borrow](https://pattapee@bitbucket.org/pattapee/omb_system_borrow.git)

## License
[Ombudsman.go.th](https://www.ombudsman.go.th)