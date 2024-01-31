var express=require("express")
var mysql=require("mysql")
var upload=require("express-fileupload")
var bodyparser=require("body-parser")
var util= require("util")
var app=express()

app.use(bodyparser.urlencoded({extended:true}))
var upload =require("express-fileupload");
app.use(upload())
app.use(express.static("public"))

var conn=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"nodejs4"
})
 
var exec=util.promisify(conn.query).bind(conn)

app.get("/", async function(req,res){
    var company_list=await exec("SELECT * FROM company")
    res.render("add_company.ejs",{companies:company_list})
})

app.post("/save_company", async function(req,res){
    var d=req.body;
    var company_logo = new Date().getTime() + ".jpg";
    req.files.company_logo.mv("public/" + company_logo);
    var sql=`INSERT INTO company(company_name,company_contact_no,company_email,company_logo,comapny_address) VALUES ('${d.company_name}','${d.company_contact_no}','${d.company_email}','${d.company_logo}','${d.company_address}')`;
    var data=await exec(sql)
    res.redirect("/")
})

app.listen(1000)

//CREATE TABLE company(company id INT PRIMARY KEY AUTO_INCREMENT,company_name VARCHAR(200),company_contact_no VARCHAR(200),company_email VARCHAR(200),company_logo VARCHAR(200),comapny_address VARCHAR(200))