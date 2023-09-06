const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
require("dotenv").config();
const person = require("./Models/person.js");

//mongoose connection
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`Runing on ${port}`);
    });
    console.log("connect to DB");
  });

app.post("/add", (res, req) => {
  let newPerson = new person({
    name: "Sarra",
    age: 21,
    favoriteFoods: ["Pizza", "Burger"],
  });
  //save record
  newPerson
    .save()
    .then((data) => {
      req.json(newPerson);
      console.log("Record saved:", data);
    })
    .catch((err) => {
      console.error(err);
    });
});

//Create many records
app.post("/addMany", async (res, req) => {
  const people = [
    { name: "Ali", age: 30, favoriteFoods: ["Spaghetti", "Steak"] },
    { name: "Aya", age: 25, favoriteFoods: ["Sushi","Burritos"] },
    { name: "Mary", age: 27, favoriteFoods: ["Burritos"] },
    { name: "Fares", age: 20, favoriteFoods: ["Pizza", "Steak","Burritos"] },
    { name: "Aymen", age: 22, favoriteFoods: ["fish"] },
    { name: "Mary", age: 45, favoriteFoods: ["Pasta","Burritos"] },

  ];
  try {
    var response = await person.create(people);

    console.log("Records created:", response);
    req.json(response);
  } catch (error) {
    console.log(error);
  }
});

//search the DB
app.get("/all", async (req, res) => {
  try {
    const response = await person.find({
      name: /Ay/
    });
    console.log(response)
    res.json(response);
  } catch (error) {
    console.log(error);
  }
});
//find one person
app.get("/findOne", async (req, res) => {
    try {
      const onePerson = await person.findOne({
        favoriteFoods:'Spaghetti'
       });
         console.log('The person who`s like spaghetti is ',onePerson)
         res.json(onePerson);
       }
       catch(err) {
         console.error(err)
       }
       });;


//find person by Id
app.get("/findId", async (req, res) => {
    try {
      const findId = await person.findById({
        _id: '64f8ea156801f3c6b01cc03e'
       });
        console.log('The person who has this id is',findId)
         res.json(findId);
       }
       catch(err) {
         console.error(err)
       }
       });


//Classic Updates
app.get("/update", async (req, res) => {
    try {
      const findPerson = await person.findById({
        _id: '64f8ea156801f3c6b01cc03f',
       })
    
    findPerson.favoriteFoods.push('Hamburger');

    const updatedPerson = await findPerson.save();

    console.log(updatedPerson);
    res.json(updatedPerson);
      } catch (err) {
    console.error(err);
       }
       });


//find and update
app.get("/findUpdate", async (req, res) => {
    try {
      const findUp = await person.findOneAndUpdate(
        {
          name: 'Ali'
        },
        {
          age: 20
        },
        {
          new: true,
          runValidators: true
        })
        console.log('update:',findUp)
         res.json(findUp);
       }
       catch(err) {
         console.error(err)
       }
       });


//Delete One Document
app.get("/delete", async (req, res) => {
    try {
      const delPerson = await person.findByIdAndDelete(
        {
          _id: '64f8b4f3f412c590b9601893'
        })
        console.log('Deleted person:',delPerson)
         res.json(delPerson);
       }
       catch(err) {
         console.error(err)
       }
       });

//Delete many
app.get("/deleteMany", async (req, res) => {
    try {
      const delMany = await person.deleteMany( {
        name: 'Mary'
    })
      res.json(delMany)
       }
       catch(err) {
         console.error(err)
       }
       });

//person who like burritos

app.get("/burrito", async (req, res) => {
        try {
          const burrito = await person.find({ favoriteFoods: "Burritos" })
            .sort('name')
            .limit(2)
            .select('-age')
            .exec();
          console.log(burrito)
          res.json(burrito);
        } catch (err) {
          console.error(err);
        }
      });

      
