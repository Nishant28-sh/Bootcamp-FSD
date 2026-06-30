use("admin")


db.employee.insertMany([
{
    name: "Nishant",
    empId: 101,
    department: "IT",
    email: "nishant@gmail.com",
    salary: 50000,
    bonus: 5000
},
{
    name: "Rahul",
    empId: 102,
    department: "HR",
    email: "rahul@gmail.com",
    salary: 45000,
    bonus: 4000
},
{
    name: "Priya",
    empId: 103,
    department: "Finance",
    email: "priya@gmail.com",
    salary: 60000,
    bonus: 6000
},
{
    name: "Aman",
    empId: 104,
    department: "Marketing",
    email: "aman@gmail.com",
    salary: 55000,
    bonus: 4500
},
{
    name: "Neha",
    empId: 105,
    department: "IT",
    email: "neha@gmail.com",
    salary: 65000,
    bonus: 7000
}
])

db.employee.find()


db.employee .updateOne({ empId: 101 },{$set: {salary: 70000}})
db.employee.find({ empId: 101 })
db.employee.deleteOne(
    { empId: 104 }
)
db.employee.find()

db.employee.aggregate([
    {
        $sort: {
            salary: -1
        }
    },
    {
        $project: {
            _id: 0,
            name: 1,
            salary: 1,
            department: 1,
            totalsalary: {
                $add: ["$salary", "$bonus"]
            }
        }
    }
]);

db.employee.aggregate([
    {
        $group: {
            _id: "$department",
            totalSalary: {
                $sum: "$salary"
            }
        }
    }
]);

db.employee.getIndexes()
db.employee.createIndex({ empId: 1 })
db.employee.getIndexes()


