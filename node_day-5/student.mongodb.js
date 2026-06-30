// use("admin")

// db.user.insertMany([
//   {
//     "name": "Nishant",
//     "rollNo": "2301010017",
//     "branch": "CSE"
//   },
//   {
//     "name": "Rahul",
//     "rollNo": "2301010018",
//     "branch": "ECE"
//   },
//   {
//     "name": "Priya",
//     "rollNo": "2301010019",
//     "branch": "IT"
//   },
//   {
//     "name": "Aman",
//     "rollNo": "2301010020",
//     "branch": "ME"
//   },
//   {
//     "name": "Neha",
//     "rollNo": "2301010021",
//     "branch": "CSE"
//   }
// ])
use("admin")
db.user.find()


db.user.find({branch:"CSE"})
db.user.findOne({ name: "Nishant" })

db.user.updateOne({ name: "Rahul" },{$set: {branch: "CSE"}})
db.user.findOne({ name: "Rahul" })
db.user.deleteOne({
  name: "Priya"
})

db.user.find()