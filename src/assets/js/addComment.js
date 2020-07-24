import axios from "axios";

const addCommentForm = document.getElementById("jsAddComment");
const commentList = document.getElementById("jsCommentList");
const commentNumber = document.getElementById("jsCommentNumber");

const increaseNumber = () => {
  commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) + 1;
};

const addComment = async (comment, id) => {
  const li = document.createElement("li");
  const span = document.createElement("span");
  commentList.prepend(li);
  li.appendChild(span);

  span.innerHTML = comment;
  li.classList.add("commentList");
  li.id = id;
  span.classList.add("commentSpan");

  // button

  const button = document.createElement("button");
  span.appendChild(button);
  button.classList.add("deleteButton");
  button.innerHTML = "X";

  // increase view number
  increaseNumber();
};

const sendComment = async (comment) => {
  const videoId = window.location.href.split("/videos/")[1];
  const response = await axios({
    url: `/api/${videoId}/comment`,
    method: "POST",
    data: {
      comment,
    },
  });
  if (response.status === 200) {
    let comment = response.data[0];
    let id = response.data[1];
    addComment(comment, id);
  }
};

const handleSubmit = (event) => {
  event.preventDefault();
  const commentInput = addCommentForm.querySelector("input");
  let comment = commentInput.value;
  sendComment(comment);
  commentInput.value = "";
};

function init() {
  addCommentForm.addEventListener("submit", handleSubmit);
}

if (addCommentForm) {
  init();
}
