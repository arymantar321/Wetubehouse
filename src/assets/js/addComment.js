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
  button.innerHTML = "❌";

  // increase view number
  increaseNumber();
  //location.reload(true); // <-이건 그거다...페이지 전체 새로고침
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
    console.log(response.data[0]);
    console.log(response.data[1]);
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
