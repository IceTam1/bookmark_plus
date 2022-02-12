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



const start = async () => {
    try{

await sequelize.sync({force: true});  

const search = Category.create({ name: 'search'});
const coding = Category.create({ name: 'coding' });
const jobs = Category.create({ name: 'jobs'});
 
 await Bookmark.create({name: 'google.com', categoryId: search.id});
 await Bookmark.create({name: 'stackoverflow.com', categoryId: coding.id});
 await Bookmark.create({name: 'bing.com', categoryId: search.id});
 await Bookmark.create({name: 'linkedin.com', categoryId: jobs.id});
 await Bookmark.create({name: 'indeed.com', categoryId: jobs.id});
 await Bookmark.create({name: 'msdn.com', categoryId: coding.id });
  

 console.log('starting..')
    }
    catch(ex){
        console.log(ex)
    }
}

start();