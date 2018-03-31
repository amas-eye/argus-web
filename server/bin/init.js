#!/usr/bin/env node

let ObjectId = require("mongodb").ObjectID
let crypto = require("crypto")

let user = require("../models/user")
let groups = require("../models/groups")

let username = "admin"
let password = "123"
let groupname = username

let key = crypto.pbkdf2Sync(password, "argus", 5000, 64, "sha256")
let epassword = key.toString("hex");

/**
*/
let userAdminObjectId = ObjectId()
let groupAdminObjectId = ObjectId()

let groupAdmin = new groups({
        "_id": groupAdminObjectId,
        "group_name": groupname,
        "group_privilieged": {
            "dashboard": "r",
            "caiji": "rw",
            "alert": "rw",
            "chain": "r",
            "jk": "rw"
        },
        "users": [userAdminObjectId]
    })
groupAdmin.save()

let userAdmin = new user({
        "_id": userAdminObjectId,
        "username": username,
        "name": username,
        "password": epassword,
        "groups": groupAdminObjectId,
        "is_admin": true
    })
userAdmin.save()

//process.exit(1)
