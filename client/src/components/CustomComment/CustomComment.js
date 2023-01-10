import React, { useState } from "react";
import CustomInput from "../CustomInput/CustomInput";
import CustomButton from "../CustomButton/CustomButton";
import "./CustomComment.css";
const CustomComment = ({ post }) => {
  const [comments, setComments] = useState([1, 2, 3, 4]);
  const [comment, setComment] = useState("");

  return (
    <div className="container">
      <div className="container">
        {comments.map((comment, index) => (
          <div key={index}>
            <p className="comment-p">comment{index}</p>
            <hr />
          </div>
        ))}
      </div>
      <div>
        <div>
        <CustomInput
          type="textarea"
          float
          label="write a Comment . . . ."
          placeholder="write a Comment . . . ."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <CustomButton value="comment" className="commentbtn"/>
        </div>
      </div>
    </div>
  );
};

export default CustomComment;
