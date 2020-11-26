const express = require('express');
const app = express()

const port = 3000;

app.get("/", function(req, res) {
    const url = "https://github.com/facebook/react-native"
    console.log(`Redirect to ${url}`);
    res.redirect(url);
});

app.listen(port, function(error) {
    if (error) {
        console.error("Failed to start the server");
    } else {
        console.log("Server started");
    }
});