const http = require("http");
const fs = require("fs");
const formidable = require("formidable");

const server = http.createServer();

// server.on("request", (req, res) => {
//   console.log(req.method, " ", req.url);
//   const data = "This is November Nodejs Class, also mongodb and expres";

//   if (req.method === "GET" && req.url === "/") {
//     return res.end("Home Page");
//   }

//   //write
//   else if (req.method === "GET" && req.url === "/write") {
//     fs.writeFile("demo.txt", data, (err) => {
//       if (err) throw err;
//       return res.end("Write Success");
//     });
//   }

//   //append
//   else if (req.method === "GET" && req.url === "/append") {
//     fs.appendFile("demo.txt", data, (err) => {
//       if (err) throw err;
//       return res.end("Append successfull");
//     });
//   } else if (req.method === "GET" && req.url === "/read") {
//     fs.readFile("demo.txt", (err, data) => {
//       if (err) throw err;
//       //   console.log(data);

//       return res.end(data);
//     });
//   }
//   //delete
//   else if (req.method === "GET" && req.url === "/delete") {
//     fs.unlink("demo.txt", (err) => {
//       if (err) throw err;

//       return res.end("Delete Success");
//     });
//   }

//   //rename
//   else if (req.method === "GET" && req.url === "/rename") {
//     fs.rename("demo.txt", "newDemo.txt", (err) => {
//       if (err) throw err;

//       return res.end("Rename Success");
//     });
//   }

//   //stream read
//   else if (req.method === "GET" && req.url === "/streamfile") {
//     const rStream = fs.createReadStream("demo.txt");

//     rStream.on("data", (char) => {
//       //   console.log(char);
//       res.write(char);
//     });

//     rStream.on("end", () => {
//       return res.end();
//     });
//   }

//   //   return res.end("Wrong URL");
// });

server.on("request", (req, res) => {
  if (req.method === "POST" && req.url === "/fileupload") {
    console.log("hello");

    const form = new formidable.IncomingForm();
    form.parse(req, (err, feilds, files) => {
      const oldPath = files.fileToUpload[0].filepath;
      const newPath =
        __dirname + "/uploads/" + files.fileToUpload[0].originalFilename;
      console.log(oldPath);
      console.log(newPath);

      fs.rename(oldPath, newPath, (err) => {
        if (err) throw err;
        return res.end("Form submitted");
      });
    });
  } else {
    fs.readFile("test.html", (err, data) => {
      if (err) throw err;
      return res.end(data);
    });
  }
});

server.listen(8000, () => {
  console.log("server is running on port 8000");
});
