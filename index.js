const express = require('express')
const admin = require("firebase-admin")
const app = express()
const port = process.env.PORT || 3000
const serviceAccount = require("./config.json")
const path = require("path")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://personal-blog-e8701.firebaseio.com"
});

const db = admin.firestore();

app.set('view engine', 'ejs');
app.use('/assets', express.static('assets'))

let panelData = []
let postDataList = []
let postData = []
let aboutData = []

const fetchPanelData = (res,req,next) =>{

	panelData = []

	db.collection('Personal_Info').doc('Info').get()
	.then(doc=>{
		panelData.push(doc.data())
		next();
	})

}

const fetchPostList = (res,req,next) =>{

	postDataList = []

	db.collection('Posts').get()
	.then(doc=>{
		doc.forEach(data=>{

			var id = data.id
			var resp = data.data()

			postDataList.push(resp)
		})
		next();
				
	})

}

const routePostData = (res,req,next)=>{

	var id = res.params.id

	 postData = []

	 db.collection('Posts').doc(id).get()
	 .then(doc=>{
	 	postData.push(doc.data())
	 	next()
	 })

}

const fetchAboutData = (res,req,next)=>{

	aboutData = []

	db.collection('Personal_Info').doc('Info').get()
	 .then(doc=>{
	 	aboutData.push(doc.data())
	 	next()
	 })

}

app.get('/', fetchPanelData, fetchPostList, (req, res) => {
	res.render('index',{
		title:'Fahri Muhammet Demir',
		panelData:{
			site_name:panelData[0].site_name,
			bio:panelData[0].bio,
			profile_image:panelData[0].profile_image
		},
		postList:postDataList

	})
})

app.get('/about', fetchPanelData, fetchAboutData, (req, res) => {
	res.render('about',{
		title:'Fahri Muhammet Demir',
		panelData:{
			site_name:panelData[0].site_name,
			bio:panelData[0].bio,
			profile_image:panelData[0].profile_image
		},
		data:{
			title:aboutData[0].title,
			content:aboutData[0].content
		}
		
	})
})

app.get('/:id', fetchPanelData, routePostData, (req, res) => {
	res.render('post',{
		title:'Fahri Muhammet Demir',
		panelData:{
			site_name:panelData[0].site_name,
			bio:panelData[0].bio,
			profile_image:panelData[0].profile_image
		},
		data:{
			image:postData[0].image,
			title:postData[0].title,
			date:postData[0].date,
			content:postData[0].content
		}
		
	})
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
