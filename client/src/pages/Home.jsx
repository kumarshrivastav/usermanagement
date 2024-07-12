import React from "react";

const Home = () => {
  return (
    <div className="flex min-h-96">
      <div className="flex flex-col gap-10 mt-32 mx-4">
        <div className="">
          <h1 className="text-6xl font-serif font-semibold text-white">
            Welcome to User Management{" "}
            <span className="text-gray-500 italic">Web Application</span>
          </h1>
        </div>
        <div className="">
          <p className="text-gray-800 italic text-justify font-serif">
            This is a basic user management application and role based activity
            can user take place apart from this in this application i used React
            library on view layer and Node for backend support to run javascript
            outside the browser environment and for the apis call i used Express
            it's also a third party library and for data management we use
            mongodb atlas and for ORM (Object Relational Mapping) i used
            mongoose for schema validation its a architecture of this web
            applicatoin. And for user authentication i use JWT (json web token)
            for token based authentication access, multer it's also a third
            party library for handling the mutli part form data and works as
            middleware and every user profile store on cloud based service on
            Cloudinary.{" "}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
