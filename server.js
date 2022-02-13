const Sequelize = require('sequelize')
const sequelize = new Sequelize (process.env.DATABASE_URL || 'postgres://localhost/bookmark_db')
const STRING = Sequelize.DataTypes.STRING

const Bookmark = sequelize.define('bookmark', {
    name: {
        type: STRING,
        unique: true,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
})
const Category = sequelize.define('category', {
    name: {
        type: STRING,
        unique: true,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
});

Bookmark.belongsTo(Category)
Category.hasMany(Bookmark)






const express = require('express')
const app = express();

app.get('/', (req, res) => res.redirect('/bookmarks'));

app.get('/bookmarks', async (req, res, next) => {
  try {
    const bookmarks = await Bookmark.findAll({
        include: [ Category ]
    })   
    
    const html = bookmarks.map( bookmark=> {
        return `
        <div>
          ${bookmark.name}
          <a href= '/category/${bookmark.categoryId}'> ${bookmark.category.name} </a>
        </div>
        `;
    }).join('');

   res.send(`
     <html>
       <head> 
        <title> Acme Bookmarks </title>
       </head>
       <body>
         <ul>
          <h1> Acme Bookmarks </h1>
           ${html}
         </ul>
       </body>
     </html>
   `)

  }
  catch (ex) {
    next(ex)
  }
});


app.get('/category/:categoryId', async(req, res, next) => {
  try {
    const categories = await Category.findByPk(req.params.categoryId, {
      include: [ Bookmark ]
   });
    res.send(categories)

  }
  catch (ex) {
    next(ex)
  }


});







const start = async () => {
    try{

await sequelize.sync({force: true});  

const search = await Category.create({ name: 'search'});
const coding = await Category.create({ name: 'coding' });
const jobs = await Category.create({ name: 'jobs'});
 
 await Bookmark.create({name: 'google.com', categoryId: search.id});
 await Bookmark.create({name: 'stackoverflow.com', categoryId: coding.id});
 await Bookmark.create({name: 'bing.com', categoryId: search.id});
 await Bookmark.create({name: 'linkedin.com', categoryId: jobs.id});
 await Bookmark.create({name: 'indeed.com', categoryId: jobs.id});
 await Bookmark.create({name: 'msdn.com', categoryId: coding.id });
  

 console.log('starting..')
 const port = process.env.PORT || 3000
 app.listen(port, ()=> console.log(`app listening on port ${port}`));
    }
    catch(ex){
        console.log(ex)
    }
}

start();