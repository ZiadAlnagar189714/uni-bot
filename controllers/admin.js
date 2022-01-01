const glob = require("../config/globals");
const fetch = require("node-fetch");
const fs = require("fs");
const csv = require("csvtojson");
const botUser = require("../model/BotUser");

exports.getAllBotUsers = async () => {
    try {
        fetch("https://api.chatbot.com/users/export", {
            headers: {
                Authorization: `Bearer ${glob("BDev")}`,
                "Content-Type": "application/json",
            },
            method: "POST",
        }).then((res) => {
            let destPath = "./botUserList.txt";
            const dest = fs.createWriteStream(destPath);
            res.body.pipe(dest);
            csv()
                .fromFile(destPath)
                .then((arr) => {
                    arr.forEach((user, i) => {
                        let bUser = {
                            name: user.Name,
                            email: user.Email,
                            firstSeen: user["First Seen"],
                            lastSeen: user["Last Seen"],
                            source: user.Source,
                            userID: user["User ID"],
                            ip: user.IP,
                            region: user.Region,
                            country: user.Country,
                        };
                        console.log(bUser);
                        botUser.deleteMany().exec();
                        botUser.create(bUser, (err, botUser) => {
                            if (err) console.log(err + botUser);
                        });
                    });
                });
        });
    } catch (err) {
        console.log(err);
    }
};
