# Simple TODO LIST website

> Todo List provides a simple and easy to use functionality, to create your own todo list.
The Home page displays a default list with the title "Today's todo list" (with today's date displayed directly underneath the title). 
You can add todo items to the list and delete them, by selecting the corresponding checkbox. 
The site also provides other menu options to - create new todo lists, view all todo lists and delete lists.


> I developed the site utilising HTML5, CSS, Node.js backend, MongoDB database (hosted on MongoDB Atlas cloud server) and EJS template. The created EJS templates allows for the creation of many todo lists, without having to repeat the creation of many similar HTML pages. The header, footer and styles are also abstracted to avoid repetition of work, thus making web development more efficient.
Finally, Express Route Parameters were also used to allow the creation and handling of many routes (for each newly created todo list), without the need to create many http route handler methods. All todo lists’ routes are handled by a single http routing handler method, thanks to Route Params. 
 

> The website is hosted live on Heroku: https://todolist-hazzaldo.herokuapp.com/