import axios from "axios";

let url = "http://localhost:5050/api";

if (process.env.NODE_ENV === "production") {
  url = "/api";
  //i'm already on my root in heroku so i don't need all the address
}
// prettier ignore
export const API = axios.create({
  baseURL: url,
});

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static("client/build"));
// }

export default API;
