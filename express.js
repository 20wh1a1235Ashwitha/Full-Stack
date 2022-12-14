const e = require("express");
const express = require("express");
const math=
{
	add:function(a,b)
	{
		return a+b;
	}
}
const app = express();
const port = 3000;

const { initializeApp , cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
var serviceAccount = require("./serviceAccountkey.json");
initializeApp({
	credential: cert(serviceAccount),
});

const db = getFirestore();

app.set("view engine","ejs");
app.use(express.static('public'));


app.get("/first", (req, res) => {
	res.render("first");
});

app.get("/login",(req,res)=>{
	res.render("login");
});
app.get("/loginsubmit",(req,res)=>{
	const Email=req.query.email;
	const Pwd=req.query.pwd;
	console.log(req);
	db.collection("full_stack")
	.where("Email","==",Email)
	.where("Pwd","==",Pwd)
	.get()
	.then((docs) => {
		if(docs.size > 0){
			res.render("first");
		}
		else{
			res.render("products");
		}
	});
});

app.get("/signup",(req,res)=>{
	res.render("signup");
});

app.get("/products",(req,res)=>{
	res.render("products");
});

app.get("/about",(req,res)=>{
	res.render("about");
});




app.get("/signupsubmit",(req,res)=>{
	const fname=req.query.first_name;
	const lname=req.query.last_name;
	const email=req.query.email;
	const pwd=req.query.password;
	const phno=req.query.phno;
	db.collection("full_stack").add({
		fname: fname,
		lname: lname,
		email : email,
		pwd: pwd,
		phno: phno,
	}).then(()=>{
		res.render("first");
	});
});

app.get("/first",(req,res)=>{
	res.render("first");
});

const arr=[];
const costs=[];
var amount=0;
app.get("/Cart",(req,res)=>{
	const val=req.query.item;
	var c=req.query.cost;
	costs.push(c);
	c=eval(c.slice(0,c.length-2));
	console.log(c);
	amount=math.add(amount,c);
	arr.push(val);
	res.render("first");
});

app.get("/Cart",(req,res)=>{
	if(typeof(arr) != "undefined"){
		db.collection("full_stack").add({
			Cart : arr,
			Costs : costs,
			TotalCost : amount,
		}).then(()=>{
			res.render("cart",{booksData : arr, amount : amount, costs : costs});
		});
	}
});
app.listen(port,()=>{
	console.log(`You are in port number ${port}`);
});