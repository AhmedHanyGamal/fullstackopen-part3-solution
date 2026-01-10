const mongoose = require("mongoose");


if (process.argv.length <= 2 || process.argv.length === 4 || process.argv.length >= 6) {
    console.log("incorrect arguments");
    process.exit(1);
}


const db_password = process.argv[2];
const url = `mongodb+srv://a7madhany2003_db_user:${db_password}@cluster0.55l6eci.mongodb.net/phonebookApp?appName=Cluster0`;

mongoose.set("strictQuery", false);

mongoose.connect(url, { family: 4 });

const personSchema = new mongoose.Schema({
    name: String,
    number: String
});
const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 3) {
    Person.find({}).then((result) => {
        console.log("phonebook:");
        result.forEach((person) => {
            console.log(`${person.name} ${person.number}`);
        });

        mongoose.connection.close();
    });
}
else {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
    });

    person.save().then((result) => {
        console.log(`added ${result.name} number ${result.number} to phonebook`);
        mongoose.connection.close();
    });
}
