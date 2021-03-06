import React, { useState, useContext, useRef } from "react";
import API from "../../api/user.api";
import Input from "../Input/Input";
import { MyContext } from "../../context/MyContext";

const CreatePost = () => {
  const inputRef = useRef(null);
  const { setRender } = useContext(MyContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const insertOptions = () => {
    const categories = ["choose category", "Home&Garden", "Fitness", "Food", "Travel", "Wellness", "Study"];
    const categoryValues = ["choose category", "home", "fitness", "food", "travel", "wellness", "study"];
    return categories.map((category, idx) => {
      return (
        <React.Fragment key={idx}>
          <option value={categoryValues[idx]}>{category}</option>
        </React.Fragment>
      );
    });
  };

  // const onHandleChange = (categoryCode) => {
  //   setCategory(categoryCode.value);
  // };

  const onHandleSubmit = async (e) => {
    setError(null);
    setIsUpdating(true);
    e.preventDefault();
    //spinner?
    try {
      const { url } = await fetch("/api/s3Url").then((res) => res.json());
      // post the image direclty to the s3 bucket
      await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: file,
      });

      const imageUrl = url.split("?")[0];

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      file ? formData.append("image", imageUrl) : formData.append("image", null);

      await API.post("posts/create", formData, {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
      });

      alert("Your tip was published successfuly!");
      setIsUpdating(false);
      setTitle("");
      setDescription("");
      setCategory("");
      setFile(null);
      inputRef.current.value = null;
      setRender(true); //for profile component to render
    } catch (err) {
      console.log(err);
      setError(err.response.data);
      setIsUpdating(false);
    }
  };
  console.log(file);
  return (
    <div className="createPost-container">
      <form className="form" onSubmit={onHandleSubmit}>
        <h2>Create a new tip</h2>

        <Input
          label="Title:"
          id="title"
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
        <div className="field">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            type="text"
            rows="7"
            cols="40"
            placeholder="Enter you tip here"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
        </div>
        <select className="selectbar" onChange={(e) => setCategory(e.target.value)} value={category}>
          {insertOptions()}
        </select>
        <div className="field">
          <label htmlFor="image">Upload Image (optional):</label>
          <input
            ref={inputRef}
            type="file"
            label="Upload Image (optional):"
            id="image"
            onChange={(e) => {
              setFile(e.target.files[0]);
              // e.target.value = null;
            }}
          />
        </div>
        <button
          className="btn"
          type="submit"
          disabled={isUpdating ? true : false}
          style={isUpdating ? { color: "lightgrey" } : { color: "rgb(70, 69, 69)" }}>
          Add your tip
        </button>
      </form>
      {isUpdating && <span>Creating your tip...</span>}
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
};

export default CreatePost;
