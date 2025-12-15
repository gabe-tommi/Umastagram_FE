# Umastagram_FE
Expo app Frontend written in typescript. Makes use of a REST API and React Native to run a social networking app centered around horse racing.
Linked to Backend repo at:
https://github.com/gabe-tommi/Umastagram_BE.
CST 438: Project 03 Retrospective
Team 02
December 14th 2025
Dr. Drew A. Clinkenbeard


Project 03 Retrospective
Gabriel Gallagher, Alexangelo Orozco Gutierrez, Joceline Cortez Arellano, Armando Vega

Github Links
Frontend: https://github.com/gabe-tommi/Umastagram_FE 
Backend: https://github.com/gabe-tommi/Umastagram_BE 
Introduction
This was a React Native project with a custom backend API written in Java with springboot, hosted on Heroku and modifying a database hosted on Supabase. The app primarily serves as a social media app themed around Umasmusume, a popular Japanese videogame franchise. The app shows capability with manipulating data, allowing users to post and follow each other as well as authenticate via other apps with OAuth. The backend provides the link between the frontend and the database, allowing updates based on frontend user actions. There is also a data part of the API, allowing users of the app and direct access to formatted data about characters from the videogame, prior to which there was much real world API usage available for this data.
We communicated primarily through Discord and in person meetings.
We initially considered about 8 user stories that resulted in 16 github issues.  In the end we completed 55 of the 64 issues with a total of 54 PRs

Introduction	1
Team Member Retrospectives	2
Armando Vega	2
Joceline Cortez-Arellano	4
Alexangelo Orozco Gutierrez	6
Gabe Gallagher	8
Course Retrospectives	9
Armando Vega	9
Joceline Cortez-Arellano	10
Alexangelo Orozco Gutierrez	11
Gabriel Gallagher	12
Conclusions	15
How successful was the project?	15
What was the largest victory? 🥠	15
Final assessment of the project	15
Team Member Retrospectives
Armando Vega
What was your role / which stories did you work on
I worked mostly on user account related dev and user stories. I created and maintained the user POJO and its interactions with the version on Supabase. The user repository and service files were created in such a way for the user API routes to be cleanly used by the frontend. 
I also worked on OAuth2 for GitHub and Google. 
How much time was spent working outside of class
I spent about 5 hours each week outside of class on this project since most of my time was spent educating myself on how particular processes work. 
What was the biggest challenge? 
The biggest challenge was figuring out how exactly the pathing for OAuth2 for each GitHub and Google for two different platforms was going to work.
Why was it a challenge?
This was a challenge since by default, Google already has two different types of OAuth2 applications: web and mobile. The issue with this was that the mobile OAuth2 for Google was meant for an app that has both the frontend and the backend not on different repositories. So realizing this, I needed to refactor the whole structure of the OAuth routes of the API that I was constructing to just support web for both web and mobile since they can both just use an external browser to login. 
How was it addressed?
Debugging included a lot of Heroku logging and asking Claude to diagnose those logs in order to find bugs in the routes. I needed to learn what is needed for a typical OAuth flow for both mobile and web to distinguish what exactly I needed or didn’t need for each. For example, for mobile OAuth2 for Google, there’s this thing called PKCE which functions as an extra code challenge to ensure that the access code request to the Google API is a valid one coming from the right/valid application. But since, again, we are not using mobile OAuth2 and simply are using web ones for both, this needed to be removed from the project structure as it was not working and causing problems. I was able to diagnose this issue by querying Claude to understand why exactly PKCE was not needed for web OAuth2 and why mobile OAuth2 was not viable in the first place.
Favorite / most interesting part of this project
My favorite part of this project was actually testing out the features to see them working as well as seeing the styling options we were able to come up with in order for everything to come together. We spent some time looking at color palettes and referencing the game in order to try and make the feel just like what we would imagine the app to be in the game.
If you could do it over, what would you change?
If I could do it over, I would implement the repository, service, and route files a lot quicker now that I know the project structure of a Spring Boot application and the workflow of OAuth2.
What is the most valuable thing you learned?
The most valuable thing I learned was how OAuth2 works and how to set up the different pieces of the workflow for two different providers. 
Joceline Cortez-Arellano
What was your role / which stories did you work on
I worked on the Uma Search feature on both the frontend and backend (POJOs & tests, Alex helped a bit with setting up controllers, helped research and fill out the tables on superbase)
Worked on styling and design for the overall app
How much time was spent working outside of class
4+ hours per week, mostly toward the end of the project
What was the biggest challenge? 
The biggest challenge on my end was adjusting some faulty calls on the backend that weren’t fetching the database properly
Why was it a challenge?
It took me a bit to realize where the issue was and afterwards to adjust all the necessary pojos/controllers for consistency, and even then I had to add some alternate terms for calls to the frontend since some things hadn’t been properly named. 
How was it addressed?
Double checking that the front and back end were consistent with each other and what I needed for my feature.
Favorite / most interesting part of this project
My favorite part of the project overall was fixing up all the styling details on the frontend to make sure everything and everyone’s parts looked nice and cohesive, especially on my own feature where it was a challenge to figure out a good looking layout. 
If you could do it over, what would you change?
I would be less intimidated by superbase and would have included more information (facts, images, etc) to make my feature more interesting and to add more interactability with the user if possible (being able to view character’s alternate outfits, selecting a favorite horse/uma, being able to add specific notes to pages, etc). Aside from that, I wish I could have helped more with hosting and Oauth implementations.
What is the most valuable thing you learned?
Creating thorough tests as you create/modify features makes things SIGNIFICANTLY easier and gives you a much better chance of being able to fix bugs or errors before they blow out of control. I also learned that these sorts of projects are a lot easier to work through the more communication you have with your teammates. 



Alexangelo Orozco Gutierrez
What was your role / which stories did you work on
My main role was to develop the Posts feature. This is basically the feed that everyone gets and scrolls. Another significant feature was making Posts, which required the user to add and make an entry that gets uploaded to posts. I also was responsible for assets and styling choices.
How much time was spent working outside of class
At least 4 hours a week. Later on the projects life a lot more.
What was the biggest challenge? 
Merging to main and getting supabase keys to register correctly in the client side. 
Why was it a challenge?
My changes always seem to break on Heroku or something due to the way it was getting things for package lock or other files. Also getting the correct set of keys to the client and Heroku proved difficult as the documentation was a little hard to understand and AI tools were of little help. 
How was it addressed?
I needed to get everything on main several times in order for my changes to not cause conflicts or issues on Heroku. This meant a lot of copying and pasting code from branched since whenever a push to main was done and something went wrong on Heroku, pulling from main will cause all the same files I was working on to be deleted. So it took some trial and error on top of making my later branches smaller and quicker in order to prevent these issues from happening again.
Favorite / most interesting part of this project
Making the Posting feature to upload text and images was the most interesting part of the project. It involved several different components to get up and running but once things rolled they 
If you could do it over, what would you change?
I would make all the backend components first since some things I wanted to add in the end were a little more complicated to add and I was afraid of breaking everything if I messed with the backend more since I did most of my backend work early on.
What is the most valuable thing you learned?
Developing large applications isn’t so bad after all. Testing is also an essential part of developing.









Gabe Gallagher
What was your role / which stories did you work on
I started by working on controllers for the Horse and Uma tables, which Jocy would eventually take over. I wrote some basic code to get it going though. Most of my end to end work regarded the Friends feature, which required a manual setup of two linked tables, one to hold the state of an active friend request, and another to convert friend requests into active followers, and delete the linked friend request. Ideally, this would have let users filter posts by people they follow, and eventually DM each other, but we didn’t get that far. It would be nice to implement as a continuation of the project. This involved full end to end development, from styling the frontend and configuring API calls to writing, testing and pushing the backend routes, controllers, services, and repositories to Heroku while monitoring the Supabase database live.

How much time was spent working outside of class
Per week, I’d say I averaged 3 to 6 hours. Those numbers definitely increased in the last two weeks of the project.
What was the biggest challenge? 
Initially, it was linking the frontend and the backend. The way the JPA repository  / springboot formats entities into data objects is still wild to me, and is a process I don’t fully understand. Two of the tables I was working on required unique composite keys, which in themselves had to be their own entities. Very confusing, but very cool to work with.
Why was it a challenge?
Well, both tables were managing state. Ideally, the frontend would have been a mastery of this process, but only the basic meat and potatoes of state based, actively updated friend request and follow tables were in the finished product. I’m proud of it, but it was a lot to take in. I still learned a lot.
How was it addressed?
Lots of googling and looking over the Springboot documentation, plus trial and error and asking for help.
Favorite / most interesting part of this project
Almost getting DM’s working ! But getting friends as a feature finished was also very cool, as well as seeing my friends create custom (non-AI generated!) assets, in a field where artists are prevalent and so very important.
If you could do it over, what would you change?
Start working on the friending capability from the start. It would have been cool to get DM’s working by product deadline, but I was indecisive. Oh well.
What is the most valuable thing you learned?
I think it’s important to realize that no matter how stuck you might feel, if you keep trying at something, and learning where you can, you’ll eventually master it. In project 02 I felt just completely lost, but I was so confident this time around. It was a huge relief to know that I wasn’t just stupid or something, and I think a good lesson learned is to be more gentle with myself when I’m learning something new.



Course Retrospectives
Armando Vega
What new skills did you learn?
I learned how to build a backend and frontend respectively and host them on their own separate applications. I learned how to use React Native and Typescript in order to build a functioning frontend. I felt like I didn’t get too much experience with Android Studio in Software Design, but now I can say with confidence that I have gotten a lot more that I can use.
What old skills did you apply to the course? 
Some old skills I applied to this course was building a database based on a repository/service file format. Creating API routes and calling them were skills from my Internet Programming class that I got to use here but in Java instead of Javascript which was nice because it’s been so long since I’ve practiced Java. 
What would you change about the course?
I think that the overall structure of the projects was a good idea: have the first project mainly focus on the frontend, the second on the backend, and the third on a fully fledged app with total freedom. Breaking it up in this way was a nice way to understand the components of the app. I think project 2 however was a bit rough trying to piece together the pieces for an app that was previously made with dependencies that might or might not be out of date. I think that one was the most rough out of the three. Honestly, I couldn’t come up with something better to substitute it, but at the very least I can give my feelings about it so that they could perhaps point you in the right direction.
Joceline Cortez-Arellano
Course Retrospective
What new skills did you learn?
I learned a lot about what the development cycle is like (although this was probably a very very sped up and condensed version of it) as well as the crucial steps in setting up and linking front and backend codebases. Getting more experience with app development was very fun as I learned a lot more about frameworks other than android studio and gained some more knowledge on react native. 
What old skills did you apply to the course? 
I was able to reuse some of the knowledge I’d acquired in my web development class to work out how to call and style things on the front end, which was very fun as I felt that I hadn’t gotten a chance to show my best work during that course.
What would you change about the course?
I think the class was pretty well structured,  though I would’ve appreciated a bit more guidance for things like the databases and setup for Oauth and such. Though it is helpful to figure these things out on your own, it can be very tedious and demoralizing when you don’t even know where to begin. I think having some basic tutorials in video form back in 338 was extremely helpful back then, and I think it would have made a great starting point for some of the things we had to learn this semester.
Alexangelo Orozco Gutierrez
Course Retrospective
What new skills did you learn?
Newfound Frontend and Backend development techniques, documenting what functionalities I need to develop in the backend in order to make front end functionality possible. The use of S3 buckets that are essential in order to store data such as images in this project, and being able to use the URL to the images in order to efficiently show off images for social media posts. More tests stuff since I rarely made tests beforehand.
What old skills did you apply to the course? 
Java usage for backend, a little. There were a lot of new things I used here. Some things like designing interfaces to make things make sense and also styling since styling here is similar to CSS in Internet Programming in order to make elements take up proper amounts of space and look nice. I also had graphic design skills so there were things like assets and such that project 1 and 3 had.
What would you change about the course?
More written tutorials on how to do things, especially for the first 2 projects. Its nice having to figure out on your own how to do things but sometimes it just takes a ridiculous amount of time. Also more strict GitHub checking and usage to make sure branches and PRs don’t stay open for too long as it has been a common issue where slow iterations on PR causes conflicts on main.

Gabriel Gallagher
Course Retrospective
What new skills did you learn?
I learned a lot about backend development with springboot, and the REST API structure of repository to service to controllers. I heard a lot about the REST model before but it never really clicked for me, even on project 02. Isolating the SQL statements to a repository really did make it a lot easier to work with the synergy between Object Oriented Programming and the REST model, since both heavily make use of encapsulation. I also learned that the REST model is better served as a guideline, since there were instances of me writing boilerplate, repetitive code to have all my SQL in respective repositories. While it is nice, I think it affects readability negatively sometimes when you have different tiers of the hierarchy calling all the way down to the repository when they sometimes don’t need to. I have some issues with pure OOP anyway which this project highlighted for me, but overall learning Springboot was great, and I’m confident in my ability to manipulate data from a database with Java now as a result. I learned a lot about database setup and management, and how a REST API actually works as well. I especially loved seeing people make cool apps to actually serve their community, it really is a great skill to have.
What old skills did you apply to the course? 
Lots of skills, from different classes. I knew how to use CSS styling and Typescript from my internet programming class, which paired well with the new skill of learning React Native. I’ve known how to write in Java since I took Software Design last semester, and have been applying concepts in Object Oriented Programming for some time before that. This was my first time where an Object Oriented language like Java really hit the road for me in terms of designing an app, which was nice after years of using it either incorrectly or for other use cases than app development. I tried to implement some more advanced concepts, like caching that I theoretically know how to use, but the app didn’t end up being complicated enough or having enough time for that to work out. 
What would you change about the course?
This course was overall pretty good. It’s strange because there were many things about this course I much preferred to the earlier software design class that came before it. I know new concepts will always be harder to learn, but I think jumping into stuff like factories in Software Design, which are concepts we didn’t get to apply much before the final project then, and then going into Software Development and writing a basic CRUD app from the ground up felt like putting the cart before the horse. I would have appreciated some of the basic app development stuff we learned here in that course. I know that’s technically not a critique of this course but still. Regarding this course, it was overall pretty solid but parts of it definitely also felt a little rough around the edges. Specifically for Project 02, I think it was just too short of a time frame. Building an app from the ground up is tough, but what’s tougher is being given someone else’s bad code and being told to fix it. I understand it is truly good experience for the field, but I think Project 02 would have been better served as a solo project, since we ran into the issue of not having enough to do for a four person team. So one person inevitably ended up soloing the project for a week, while the rest of us stood around not really sure how to work with springboot and googled a lot to see what we needed to do, or at least that was my experience. Then that person would trade off with someone else the next week. The app we were given was also particularly unstable to run, which didn’t make things easier. I think I would have preferred a custom written, semi complete app from the professor or TA designed specifically for the assignment rather than an old project from a student, since it would guarantee that running the app wouldn’t be too difficult for students. Having project 02 be generally more guided, like having a class session dedicated to setting up a repository that could make calls to the supabase database we set up ourselves would have been a great help on the project. It definitely felt like we were handed tools we weren’t sure at all how to use. I understand that’s the way it works sometimes in the industry, but it was definitely a source of stress. I kind of can’t believe we got our app to run at all for project 02, and I remember literally learning how to push my changes to heroku the day before we were supposed to present, just because no one on my team was really sure how to actually do that. All that said, I really did enjoy the class. Project 03 is one of the coolest things I’ve been able to do as a programmer, and it really has felt like a culmination of the skills I’ve learned in my degree up to this point, frontend to backend. I just think especially when it comes to initial backend setup and programming, having a guided session or recording of how to do things like write a functional working repository for a service to use, or even being explained the repository - service - controller structure during a lecture would have been very helpful. I also think Project 02 should have been a more individual-centered, non groupwork smaller project, to focus on giving people the skills they would need to actually complete working and tested code on Project 03, that is possible for other people to read and work with as well. I know I wrote a lot, but that’s because this course was really cool, and I learned a lot even in the rougher parts of the course that were sources of stress.







Conclusions
How successful was the project?
The project was rather successful in terms of getting most of our features that we wanted to implement completed. The Uma and Horse database feature, Post feature, Friend feature, and OAuth2 functionality were all implemented. While we did not completely finish all that we wanted to, we did complete a full app that encompasses the feel and features that we imagined the in-game version would have.
What was the largest victory? 🥠
The largest victory for this project was getting all the components to connect with each other in a seamless way. The extensive log in system gives users plenty of ways to get access to our app and there are plenty of features like posting, viewing all posts, viewing 100s of Umamusume with data on the real life counterparts, and the ability to friend and almost talk to them in DMs. The project felt very extensive and was leading up to much more if we had more time.
Final assessment of the project
The project is very well rounded, with a lot of personality. There's much more to add, however it can stand on its own and almost has all the features a traditional social media app would have. Some shortcomings could be some styling errors where not all pages look consistent and some buttons seem pretty long, and some omissions such as likes and comments due to time constraints, but it's nothing an extra week or two wouldn’t have fixed. Overall very good!

