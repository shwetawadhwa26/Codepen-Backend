var express = require('express');
let app = express();
let bodyParser = require('body-parser');
let session = require('express-session');
let db = require("./database.js");
app.use(session({secret:"test123!@#",resave:true,saveUninitialized:true}));

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');

app.get("/",(req,res)=>{
	let msg = "";
	if(req.session.msg!=undefined && req.session.msg!=""){
		msg = req.session.msg;
	}
	res.render("itemhome",{msg:msg});
});

app.get("/itemlist",async function(req,res){
	const items = db.collection("item");
	const itemList = await items.find().toArray();
	res.render("itemlist_view",{itemList:itemList});
	//console.log(itemList);
	//res.send("")
});

app.get("/additem",function(req,res){
	res.render("additem_view");
});
app.post("/addItemSubmit",async (req,res)=>{
	const items = db.collection("item");
	const result = await items.insertOne({
	iname:req.body.iname,
	price:req.body.price,
	dom:new Date(),
	color:req.body.color,
	category:req.body.category});
	
	if(result.acknowledged === true){
		req.session.msg = "item added";
		res.redirect("/");
	}
	else{
		req.session.msg = "can not add item";
		res.redirect("/");
	}
});




app.listen(4000,()=>{
	console.log("CRUD on item running at port no. 4000");
})